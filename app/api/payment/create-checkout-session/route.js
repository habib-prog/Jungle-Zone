import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { verifyToken } from "@/middleware/auth";
import { cookies } from "next/headers";
import stripe from "@/config/stripe";
import subscriptionPlans from "@/models/subscriptionPlans";
import Subscription from "@/models/subscriptionSchema";
import Payment from "@/models/paymentSchema";
import Parent from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

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

    const { planId, billingCycle = "monthly" } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    if (!["monthly", "yearly"].includes(billingCycle)) {
      return NextResponse.json({ error: "Invalid billing cycle" }, { status: 400 });
    }

    const plan = await subscriptionPlans.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (!plan.isActive) {
      return NextResponse.json({ error: "This plan is no longer available" }, { status: 400 });
    }

    // Verify plan is available for user's category
    if (plan.category !== "both" && plan.category !== user.role) {
      return NextResponse.json(
        { error: "This plan is not available for your account type" },
        { status: 403 }
      );
    }

    const userModel = user.role === "babysitter" ? BabySitterRegistration : Parent;
    const userDoc = await userModel.findById(user.id);
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has active subscription
    const existingSubscription = await Subscription.findOne({
      userId: user.id,
      isActive: true,
    });
    if (existingSubscription) {
      return NextResponse.json(
        { error: "You already have an active subscription. Please cancel it first to upgrade/downgrade." },
        { status: 400 }
      );
    }

    let amount = plan.price;
    if (plan.isDiscounted && plan.discountPercentage) {
      amount = plan.price * (1 - plan.discountPercentage / 100);
    }

    const finalAmount = billingCycle === "yearly" ? amount * 12 * 0.75 : amount;
    const amountInCents = Math.round(finalAmount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: plan.name,
              description: plan.description || "",
              metadata: {
                planId: plan._id.toString(),
                features: JSON.stringify(plan.features),
              },
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout?planId=${planId}`,
      customer_email: userDoc.email,
      metadata: {
        userId: user.id,
        planId: plan._id.toString(),
        planName: plan.name,
        category: user.role,
        billingCycle,
      },
    });

    await Payment.create({
      userId: user.id,
      category: user.role,
      subscriptionPlanId: plan._id,
      planName: plan.name,
      amount: finalAmount,
      currency: "gbp",
      stripeSessionId: session.id,
      status: "pending",
      billingCycle,
    });

    return NextResponse.json(
      { sessionId: session.id, amount: finalAmount },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
