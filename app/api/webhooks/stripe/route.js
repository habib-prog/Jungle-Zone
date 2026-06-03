import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import stripe from "@/config/stripe";
import Payment from "@/models/paymentSchema";
import Subscription from "@/models/subscriptionSchema";
import Parent from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

const handleCheckoutSessionCompleted = async (session) => {
  const { metadata, id: sessionId, customer_email } = session;

  await connectDB();

  const payment = await Payment.findOne({ stripeSessionId: sessionId });
  if (!payment) {
    console.log("Payment record not found for session:", sessionId);
    return;
  }

  if (payment.status === "completed") {
    console.log("Payment already processed:", sessionId);
    return;
  }

  const plan = await require("@/models/subscriptionPlans").default.findById(metadata.planId);
  if (!plan) {
    console.log("Plan not found:", metadata.planId);
    return;
  }

  const startDate = new Date();
  let endDate = new Date();

  if (metadata.billingCycle === "yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  await Subscription.updateOne(
    { userId: metadata.userId, category: metadata.category },
    {
      $set: {
        userId: metadata.userId,
        category: metadata.category,
        subscriptionId: metadata.planId,
        plan: metadata.planName,
        startDate,
        endDate,
        isActive: true,
        paymentMethod: "stripe",
        transactionId: session.payment_intent,
        stripeSessionId: sessionId,
        stripeCustomerId: session.customer,
        paymentStatus: "active",
        nextPaymentDate: endDate,
        billingCycle: metadata.billingCycle,
        lastPaymentId: payment._id,
      },
    },
    { upsert: true }
  );

  const userModel =
    metadata.category === "babysitter" ? BabySitterRegistration : Parent;
  await userModel.findByIdAndUpdate(metadata.userId, {
    subscriptionId: metadata.planId,
    subscription: metadata.planName,
    subscriptionStart: startDate,
    subscriptionExpiry: endDate,
  });

  await Payment.findByIdAndUpdate(payment._id, {
    status: "completed",
    stripePaymentIntentId: session.payment_intent,
    stripeSessionId: sessionId,
    stripeCustomerId: session.customer,
    stripeSubscriptionId: session.subscription,
    nextPaymentDate: endDate,
  });
};

const handlePaymentIntentFailed = async (paymentIntent) => {
  const { id: paymentIntentId, metadata } = paymentIntent;

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

  await Subscription.updateOne(
    { userId: metadata?.userId },
    {
      $set: {
        isActive: false,
        paymentStatus: "cancelled",
      },
    }
  );
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
