import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import stripe from "@/config/stripe";
import Payment from "@/models/paymentSchema";
import Subscription from "@/models/subscriptionSchema";
import Parent from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { normalizeRole } from "@/app/lib/roleUtils";
import { fulfillSubscription } from "@/app/lib/stripeUtils";

const handleCheckoutSessionCompleted = async (session) => {
  await fulfillSubscription({
    stripeSubscriptionId: session.subscription,
    stripeCustomerId: session.customer,
    paymentIntentId: session.payment_intent,
    stripeSessionId: session.id,
    metadata: session.metadata,
  });
};

const handlePaymentIntentFailed = async (paymentIntent) => {
  const { id: paymentIntentId } = paymentIntent;

  await connectDB();

  const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
  if (payment) {
    await Payment.findByIdAndUpdate(payment._id, {
      status: "failed",
      failureReason: paymentIntent.last_payment_error?.message || "Payment failed",
    });
  }
};

const handleCustomerSubscriptionDeleted = async (subscription) => {
  const { id: stripeSubscriptionId, metadata } = subscription;

  await connectDB();

  const subscriptionRecord = await Subscription.findOneAndUpdate(
    { stripeSubscriptionId },
    {
      $set: {
        isActive: false,
        paymentStatus: "cancelled",
      },
    },
    { new: true }
  );

  const userId = metadata?.userId || subscriptionRecord?.userId;
  const category = metadata?.category || subscriptionRecord?.category;
  const normalizedCategory = normalizeRole(category);

  if (userId) {
    const userModel = normalizedCategory === "babysitter" ? BabySitterRegistration : Parent;
    await userModel.findByIdAndUpdate(userId, {
      subscriptionId: null,
      subscription: "free",
      subscriptionStart: null,
      subscriptionExpiry: null,
    });
    console.log("[Webhook] Successfully downgraded user to free:", userId);
  } else {
    console.warn("[Webhook] Could not downgrade user on subscription deletion: userId not found", {
      stripeSubscriptionId,
      metadata
    });
  }
};

const handleInvoicePaymentSucceeded = async (invoice) => {
  const stripeSubscriptionId = invoice.subscription;
  let metadata = invoice.metadata;

  if (stripeSubscriptionId) {
    try {
      const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      if (stripeSub && stripeSub.metadata) {
        metadata = { ...metadata, ...stripeSub.metadata };
      }
    } catch (err) {
      console.error("Error retrieving Stripe subscription metadata in webhook:", err);
    }
  }

  await fulfillSubscription({
    stripeSubscriptionId: invoice.subscription,
    stripeCustomerId: invoice.customer,
    paymentIntentId: invoice.payment_intent,
    invoiceId: invoice.id,
    receiptUrl: invoice.hosted_invoice_url,
    metadata,
  });
};

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleCustomerSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
