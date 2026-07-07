import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getAuthenticatedUser } from "@/middleware/auth";
import { cookies } from "next/headers";
import stripe from "@/config/stripe";
import Payment from "@/models/paymentSchema";
import Subscription from "@/models/subscriptionSchema";
import { normalizeRole } from "@/app/lib/roleUtils";
import { fulfillSubscription } from "@/app/lib/stripeUtils";

export async function POST(req) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const isSuccessful = session.payment_status === "paid" || session.payment_status === "no_payment_required";

    if (isSuccessful) {
      await fulfillSubscription({
        stripeSubscriptionId: session.subscription,
        stripeCustomerId: session.customer,
        paymentIntentId: session.payment_intent,
        stripeSessionId: session.id,
        metadata: session.metadata,
      });
    }

    const payment = await Payment.findOne({ stripeSessionId: sessionId });
    const subscription = await Subscription.findOne({ userId: user.id })
      .select("endDate startDate plan billingCycle paymentStatus");
    const role = normalizeRole(user.role || payment?.category || subscription?.category);

    if (isSuccessful) {
      return NextResponse.json(
        {
          status: "success",
          subscription,
          payment: payment || null,
          role,
          message: "Payment successful",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: session.payment_status,
        subscription,
        payment: payment || null,
        role,
        message: "Payment not completed yet",
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
