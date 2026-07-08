import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getAuthenticatedUser } from "@/middleware/auth";
import stripe from "@/config/stripe";
import Subscription from "@/models/subscriptionSchema";
import Payment from "@/models/paymentSchema";
import Parent from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { normalizeRole } from "@/app/lib/roleUtils";

// GET — fetch current user's active subscription
export async function GET() {
  try {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subscription = await Subscription.findOne({ userId: user.id, isActive: true });
    return NextResponse.json({ subscription: subscription || null }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// DELETE — cancel current user's active subscription
export async function DELETE() {
  try {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subscription = await Subscription.findOne({ userId: user.id, isActive: true });
    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    // Update on Stripe if we have a Stripe subscription ID
    if (subscription.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
      } catch (stripeErr) {
        console.error("Stripe cancel error:", stripeErr.message);
        // Continue even if Stripe cancel fails
      }
    }

    // Mark subscription paymentStatus as cancelled, but keep isActive true
    // so they can use it until the end of the period. The Stripe webhook 
    // `customer.subscription.deleted` will handle the actual deactivation.
    await Subscription.findByIdAndUpdate(subscription._id, {
      paymentStatus: "cancelled",
    });

    // Mark pending/active payments as cancelled
    await Payment.updateMany(
      { userId: user.id, status: { $in: ["pending"] }, stripeSubscriptionId: subscription.stripeSubscriptionId },
      { $set: { status: "cancelled" } }
    );

    return NextResponse.json({ message: "Subscription will be cancelled at the end of the billing period" }, { status: 200 });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// PATCH — resume a cancelled (cancel_at_period_end) subscription
export async function PATCH() {
  try {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subscription = await Subscription.findOne({ userId: user.id, isActive: true, paymentStatus: "cancelled" });
    if (!subscription) {
      return NextResponse.json({ error: "No cancelled subscription found to resume" }, { status: 404 });
    }

    if (subscription.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: false
        });
      } catch (stripeErr) {
        console.error("Stripe resume error:", stripeErr.message);
        return NextResponse.json({ error: "Failed to resume on Stripe" }, { status: 500 });
      }
    }

    await Subscription.findByIdAndUpdate(subscription._id, {
      paymentStatus: "active",
    });

    return NextResponse.json({ message: "Subscription resumed successfully" }, { status: 200 });
  } catch (err) {
    console.error("Resume subscription error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
