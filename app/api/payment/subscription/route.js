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

    // Cancel on Stripe if we have a Stripe subscription ID
    if (subscription.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      } catch (stripeErr) {
        console.error("Stripe cancel error:", stripeErr.message);
        // Continue even if Stripe cancel fails (may already be cancelled)
      }
    }

    // Mark subscription as inactive in DB
    await Subscription.findByIdAndUpdate(subscription._id, {
      isActive: false,
      paymentStatus: "cancelled",
    });

    // Reset user subscription fields
    const role = normalizeRole(user.role);
    const UserModel = role === "babysitter" ? BabySitterRegistration : Parent;
    await UserModel.findByIdAndUpdate(user.id, {
      subscriptionId: null,
      subscription: "free",
      subscriptionStart: null,
      subscriptionExpiry: null,
    });

    // Mark pending/active payments as cancelled
    await Payment.updateMany(
      { userId: user.id, status: { $in: ["pending", "completed"] }, stripeSubscriptionId: subscription.stripeSubscriptionId },
      { $set: { status: "cancelled" } }
    );

    return NextResponse.json({ message: "Subscription cancelled successfully" }, { status: 200 });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
