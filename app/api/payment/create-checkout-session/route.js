import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getAuthenticatedUser } from "@/middleware/auth";
import { cookies } from "next/headers";
import stripe from "@/config/stripe";
import subscriptionPlans from "@/models/subscriptionPlans";
import Subscription from "@/models/subscriptionSchema";
import Payment from "@/models/paymentSchema";
import Parent from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { normalizeRole } from "@/app/lib/roleUtils";

const getBaseUrl = (req) => {
  // If running in production, prefer the official domain to avoid configuration mismatches
  if (process.env.NODE_ENV === "production") {
    const host = req.headers.get("host") || "";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      const proto = req.headers.get("x-forwarded-proto") || "http";
      return `${proto}://${host}`;
    }
    return "https://junglezone.uk";
  }

  // In development, resolve dynamically from request headers or default to NEXT_PUBLIC_API_URL
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) {
    const proto = req.headers.get("x-forwarded-proto") || "http";
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
};

export async function POST(req) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, billingCycle = "monthly" } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 },
      );
    }

    if (!["monthly", "yearly"].includes(billingCycle)) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 },
      );
    }

    const plan = await subscriptionPlans.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (!plan.isActive) {
      return NextResponse.json(
        { error: "This plan is no longer available" },
        { status: 400 },
      );
    }

    // Verify plan is available for user's category
    const normalizedRole = normalizeRole(user.role);

    if (plan.category !== "both" && plan.category !== normalizedRole) {
      return NextResponse.json(
        { error: "This plan is not available for your account type" },
        { status: 403 },
      );
    }

    const userModel =
      normalizedRole === "babysitter" ? BabySitterRegistration : Parent;
    const userDoc = await userModel.findById(user.id);
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isTestMode = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_test_");

    const getStripeProductId = async () => {
      const productField = isTestMode ? "stripeTestProductId" : "stripeProductId";
      if (plan[productField]) return plan[productField];

      const productData = {
        name: plan.name,
        metadata: {
          planId: plan._id.toString(),
          category: plan.category,
        },
      };
      if (plan.description && plan.description.trim()) {
        productData.description = plan.description.trim();
      }
      const product = await stripe.products.create(productData);

      await subscriptionPlans.findByIdAndUpdate(plan._id, {
        [productField]: product.id,
      });

      return product.id;
    };

    const getPriceAmount = () => {
      let amount = plan.price;
      if (plan.isDiscounted && plan.discountPercentage) {
        amount = plan.price * (1 - plan.discountPercentage / 100);
      }
      return Math.round(amount * 100);
    };

    const createStripePrice = async (productId, cycle) => {
      const unitAmount = getPriceAmount();
      const recurringAmount =
        cycle === "yearly" ? Math.round(unitAmount * 12 * 0.75) : unitAmount;

      const price = await stripe.prices.create({
        product: productId,
        unit_amount: recurringAmount,
        currency: "gbp",
        recurring: { interval: cycle === "yearly" ? "year" : "month" },
        metadata: {
          planId: plan._id.toString(),
          billingCycle: cycle,
        },
      });

      const priceField = isTestMode
        ? (cycle === "yearly" ? "stripeTestYearlyPriceId" : "stripeTestMonthlyPriceId")
        : (cycle === "yearly" ? "stripeYearlyPriceId" : "stripeMonthlyPriceId");
      const productField = isTestMode ? "stripeTestProductId" : "stripeProductId";

      await subscriptionPlans.findByIdAndUpdate(plan._id, {
        [priceField]: price.id,
        [productField]: productId,
      });

      return price.id;
    };

    const productId = await getStripeProductId();
    const priceField = isTestMode
      ? (billingCycle === "yearly" ? "stripeTestYearlyPriceId" : "stripeTestMonthlyPriceId")
      : (billingCycle === "yearly" ? "stripeYearlyPriceId" : "stripeMonthlyPriceId");
    
    let priceId = plan[priceField];
    if (!priceId) {
      priceId = await createStripePrice(productId, billingCycle);
    }

    const finalAmount =
      billingCycle === "yearly"
        ? Math.round(getPriceAmount() * 12 * 0.75) / 100
        : getPriceAmount() / 100;

    const hasActiveTrial =
      userDoc.subscription === "trial" &&
      userDoc.subscriptionExpiry &&
      new Date(userDoc.subscriptionExpiry) > new Date();
    const hasNeverHadTrial =
      userDoc.subscription === "free" && !userDoc.subscriptionStart;

    let trialDays = 0;
    if (hasActiveTrial) {
      const diffTime =
        new Date(userDoc.subscriptionExpiry).getTime() - Date.now();
      trialDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else if (hasNeverHadTrial) {
      trialDays = normalizedRole === "babysitter" ? 60 : 30;
    }

    const baseUrl = getBaseUrl(req);

    const sessionOptions = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseUrl}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?planId=${planId}&billingCycle=${billingCycle}`,
      customer_email: userDoc.email,
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: plan._id.toString(),
          planName: plan.name,
          category: normalizedRole,
          billingCycle,
        },
      },
      metadata: {
        userId: user.id,
        planId: plan._id.toString(),
        planName: plan.name,
        category: normalizedRole,
        billingCycle,
      },
    };

    if (trialDays > 0) {
      sessionOptions.payment_method_collection = "always";
      sessionOptions.subscription_data.trial_period_days = trialDays;
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    await Payment.create({
      userId: user.id,
      category: normalizedRole,
      subscriptionPlanId: plan._id,
      planName: plan.name,
      amount: finalAmount,
      currency: "gbp",
      stripeSessionId: session.id,
      status: "pending",
      billingCycle,
      stripePriceId: priceId,
    });

    return NextResponse.json(
      { sessionId: session.id, sessionUrl: session.url, amount: finalAmount },
      { status: 200 },
    );
  } catch (error) {
    console.error("Create Checkout Session Error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 },
    );
  }
}
