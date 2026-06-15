import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { verifyToken } from "@/middleware/auth";
import { cookies } from "next/headers";
import stripe from "@/config/stripe";
import Payment from "@/models/paymentSchema";
import Subscription from "@/models/subscriptionSchema";

const getUserFromToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = verifyToken(token);
    return decoded;
  } catch {
    return null;
  }
};

export async function POST(req) {
  try {
    await connectDB();
    const user = await getUserFromToken();

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
    const payment = await Payment.findOne({ stripeSessionId: sessionId });
    const subscription = await Subscription.findOne({ userId: user.id })
      .select("endDate startDate plan billingCycle paymentStatus");

    if (session.payment_status === "paid") {
      return NextResponse.json(
        {
          status: "success",
          subscription,
          payment: payment || null,
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
