import { connectDB } from "@/config/db";
import Subscription from "@/models/subscriptionSchema";
import Payment from "@/models/paymentSchema";
import Parent from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import subscriptionPlans from "@/models/subscriptionPlans";
import { normalizeRole } from "@/app/lib/roleUtils";
import stripe from "@/config/stripe";

/**
 * Idempotently fulfills a subscription payment.
 * Can be safely called multiple times (e.g. from Success Page redirection and Stripe Webhooks)
 * without duplicating DB records or double-crediting users.
 */
export const fulfillSubscription = async ({
  stripeSubscriptionId,
  stripeCustomerId,
  paymentIntentId,
  stripeSessionId,
  invoiceId,
  receiptUrl,
  metadata
}) => {
  await connectDB();

  console.log("[Fulfillment] Starting fulfillment for:", {
    stripeSubscriptionId,
    stripeSessionId,
    paymentIntentId,
    invoiceId
  });

  // 1. Try to find the original payment record using the session ID or subscription ID
  let payment = null;
  if (stripeSessionId) {
    payment = await Payment.findOne({ stripeSessionId });
  }
  if (!payment && stripeSubscriptionId) {
    payment = await Payment.findOne({ stripeSubscriptionId });
  }

  // 2. Extract metadata details
  const userId = metadata?.userId;
  const category = metadata?.category;
  const planId = metadata?.planId;
  const planName = metadata?.planName;
  const billingCycle = metadata?.billingCycle || "monthly";

  // If no payment was found, but we have metadata, locate the pending payment record
  if (!payment && userId && planId) {
    payment = await Payment.findOne({
      userId,
      subscriptionPlanId: planId,
      status: "pending"
    }).sort({ createdAt: -1 });
  }

  // 3. Normalize values
  const finalUserId = userId || payment?.userId;
  const finalCategory = normalizeRole(category || payment?.category);
  const finalPlanId = planId || payment?.subscriptionPlanId;
  const finalPlanName = planName || payment?.planName;
  const finalBillingCycle = billingCycle || payment?.billingCycle || "monthly";

  if (!finalUserId || !finalPlanId) {
    console.error("[Fulfillment] Failed: Missing userId or planId", {
      stripeSubscriptionId,
      stripeSessionId,
      finalUserId,
      finalPlanId
    });
    return;
  }

  // Check if this is an initial session checkout
  const isInitialPayment = stripeSessionId || (payment && payment.stripeSessionId);

  // If initial payment is already marked completed, avoid redundant processing
  if (isInitialPayment && payment && payment.status === "completed") {
    console.log("[Fulfillment] Initial payment already completed. Skipping schema updates:", payment._id);
    return;
  }

  const plan = await subscriptionPlans.findById(finalPlanId);
  if (!plan) {
    console.error("[Fulfillment] Failed: Plan not found in DB:", finalPlanId);
    return;
  }

  // 4. Calculate start & expiry dates
  let startDate = new Date();
  let endDate = new Date();
  if (finalBillingCycle === "yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  const newStripeSubId = stripeSubscriptionId || payment?.stripeSubscriptionId;
  let userSubscriptionStatus = finalPlanName;

  if (newStripeSubId) {
    try {
      const stripeSubscriptionObj = await stripe.subscriptions.retrieve(newStripeSubId);
      if (stripeSubscriptionObj) {
        startDate = new Date(stripeSubscriptionObj.current_period_start * 1000);
        endDate = new Date(stripeSubscriptionObj.current_period_end * 1000);
        if (stripeSubscriptionObj.status === "trialing") {
          userSubscriptionStatus = "trial";
        }
        console.log("[Fulfillment] Set dates and status from Stripe Subscription:", { startDate, endDate, status: stripeSubscriptionObj.status });
      }
    } catch (err) {
      console.error("[Fulfillment] Failed to retrieve stripe subscription for dates:", err.message);
    }
  }

  const oldSubscriptions = await Subscription.find({
    userId: finalUserId,
    isActive: true,
    ...(newStripeSubId ? { stripeSubscriptionId: { $ne: newStripeSubId } } : {}),
  });

  for (const oldSub of oldSubscriptions) {
    if (oldSub.stripeSubscriptionId && oldSub.stripeSubscriptionId !== newStripeSubId) {
      try {
        await stripe.subscriptions.cancel(oldSub.stripeSubscriptionId);
        console.log("[Fulfillment] Cancelled old Stripe subscription:", oldSub.stripeSubscriptionId);
      } catch (stripeErr) {
        // Already cancelled on Stripe side — safe to continue
        console.warn("[Fulfillment] Old Stripe sub cancel warning:", stripeErr.message);
      }
    }
    await Subscription.findByIdAndUpdate(oldSub._id, {
      isActive: false,
      paymentStatus: "cancelled",
    });
    console.log("[Fulfillment] Marked old DB subscription as cancelled:", oldSub._id);
  }

  // 6. Upsert the new active Subscription record
  await Subscription.updateOne(
    { userId: finalUserId, category: finalCategory, stripeSubscriptionId: newStripeSubId },
    {
      $set: {
        userId: finalUserId,
        category: finalCategory,
        subscriptionId: finalPlanId,
        plan: finalPlanName,
        startDate,
        endDate,
        isActive: true,
        paymentMethod: "stripe",
        transactionId: paymentIntentId || payment?.stripePaymentIntentId,
        stripeSessionId: stripeSessionId || payment?.stripeSessionId,
        stripeCustomerId: stripeCustomerId || payment?.stripeCustomerId,
        stripeSubscriptionId: newStripeSubId,
        paymentStatus: "active",
        nextPaymentDate: endDate,
        billingCycle: finalBillingCycle,
      },
    },
    { upsert: true }
  );

  // 7. Update User document (Parent or BabySitter)
  const userModel = finalCategory === "babysitter" ? BabySitterRegistration : Parent;
  await userModel.findByIdAndUpdate(finalUserId, {
    subscriptionId: finalPlanId,
    subscription: userSubscriptionStatus,
    subscriptionStart: startDate,
    subscriptionExpiry: endDate,
  });

  // 8. Update/Create Payment history record
  if (payment) {
    // Update existing payment record to completed
    await Payment.findByIdAndUpdate(payment._id, {
      status: "completed",
      stripePaymentIntentId: paymentIntentId || payment.stripePaymentIntentId,
      stripeSessionId: stripeSessionId || payment.stripeSessionId,
      stripeCustomerId: stripeCustomerId || payment.stripeCustomerId,
      stripeSubscriptionId: stripeSubscriptionId || payment.stripeSubscriptionId,
      nextPaymentDate: endDate,
      invoiceId: invoiceId || payment.invoiceId,
      receiptUrl: receiptUrl || payment.receiptUrl,
    });
    console.log("[Fulfillment] Successfully fulfilled existing payment record:", payment._id);
  } else {
    // Create a new completed payment record representing a recurring/renewal payment
    const newPayment = await Payment.create({
      userId: finalUserId,
      category: finalCategory,
      subscriptionPlanId: finalPlanId,
      planName: finalPlanName,
      amount: plan.price,
      currency: "gbp",
      stripePaymentIntentId: paymentIntentId,
      stripeSessionId: stripeSessionId,
      stripeCustomerId: stripeCustomerId,
      stripeSubscriptionId: stripeSubscriptionId,
      status: "completed",
      billingCycle: finalBillingCycle,
      nextPaymentDate: endDate,
      invoiceId,
      receiptUrl,
    });
    console.log("[Fulfillment] Successfully recorded recurring payment:", newPayment._id);
  }
};
