"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const CheckoutForm = ({ planId, planDetails, billingCycle }) => {
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error("Please acknowledge the platform fee and terms to proceed.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle }),
      });
      if (!response.ok) throw new Error("Failed to create checkout session");
      const { sessionUrl } = await response.json();
      if (!sessionUrl) throw new Error("Checkout URL was not returned");
      window.location.href = sessionUrl;
    } catch (error) {
      toast.error(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const cycleText = billingCycle === "yearly" ? "year" : "month";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="mb-5 p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div>
            <p className="text-xs font-semibold text-brandColor uppercase tracking-wider">
              Product
            </p>
            <p className="text-lg font-bold text-gray-900">
              JungleZone Platform Access: {planDetails?.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-gray-900">
              £{planDetails?.price?.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              per {cycleText} (incl. VAT where applicable)
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-600 space-y-1.5 pt-1">
          <p>
            <span className="font-semibold text-gray-700">Billing Cycle:</span>{" "}
            Billed {billingCycle === "yearly" ? "annually" : "monthly"}.
          </p>
          <p>
            <span className="font-semibold text-gray-700">
              Automatic Renewal:
            </span>{" "}
            Subscriptions renew automatically each {cycleText} unless cancelled
            before renewal.
          </p>
          <p>
            <span className="font-semibold text-gray-700">How to Cancel:</span>{" "}
            Cancel anytime in your Account Settings or by emailing{" "}
            <a
              href="mailto:support@junglezone.uk"
              className="text-brandColor underline"
            >
              support@junglezone.uk
            </a>{" "}
            before the renewal date.
          </p>
          <p>
            <span className="font-semibold text-gray-700">
              Cooling-Off & Refunds:
            </span>{" "}
            A statutory 14-day cooling-off period applies to new subscriptions
            under UK consumer law. If you access digital features during this
            period, fees may be prorated or non-refundable in accordance with
            our terms.
          </p>
        </div>
      </div>

      {/* Prominent Platform Fees Notice */}
      <div className="mb-5 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg text-amber-950 text-xs leading-relaxed">
        <p className="font-bold text-amber-900 uppercase tracking-wide mb-1 text-[11px]">
          Important Notice – Platform Fees
        </p>
        <p className="mb-1.5">
          Any fee paid to JungleZone is a{" "}
          <strong>platform access or membership fee</strong>. It gives you
          access to the JungleZone platform and its features (such as messaging,
          profile browsing, and booking requests).
        </p>
        <p>
          This fee <strong>does NOT include childcare services</strong>. Any
          fees for childcare are agreed separately between the parent/guardian
          and the babysitter and are paid directly by the parent to the
          babysitter. JungleZone does not set, collect, process, or guarantee
          childcare payments.
        </p>
      </div>

      <div className="mb-5">
        <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-brandColor border-gray-300 focus:ring-brandColor shrink-0"
            required
          />
          <span>
            I agree to the{" "}
            <a
              href="/terms-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brandColor underline font-semibold"
            >
              Terms &amp; Conditions
            </a>{" "}
            and acknowledge that this payment is solely for JungleZone platform
            access and does not include or cover childcare fees.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !termsAccepted}
        className="w-full bg-brandColor text-white py-3 rounded-lg font-semibold hover:bg-[#558b2f] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
      >
        {loading && <Loader size={20} className="animate-spin" />}
        {loading ? "Processing..." : "Continue to Stripe"}
      </button>
    </form>
  );
};

// ── Inner component that uses useSearchParams ──
const CheckoutContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndPlan = async () => {
      try {
        const authResponse = await fetch("/api/parent/profile");
        const authSitterResponse = !authResponse.ok
          ? await fetch("/api/babysitters/profile")
          : authResponse;
        if (!authResponse.ok && !authSitterResponse.ok) {
          toast.error("Please login to checkout");
          router.push("/login");
          return;
        }
      } catch (error) {
        toast.error("Authentication failed");
        router.push("/login");
        return;
      }

      if (!planId) {
        toast.error("No plan selected");
        router.push("/pricing");
        return;
      }

      try {
        const response = await fetch("/api/parent/subscription");
        const { plans } = await response.json();
        const plan = plans.find((p) => p._id === planId);
        if (plan && plan.isActive) {
          setPlanDetails(plan);
        } else {
          toast.error("Plan not available");
          router.push("/pricing");
        }
      } catch (error) {
        toast.error(error.message || "Failed to load plan details");
        router.push("/pricing");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndPlan();
  }, [planId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={40} className="animate-spin text-brandColor" />
      </div>
    );
  }

  const billingCycle = searchParams.get("billingCycle") || "monthly";

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Checkout
        </h1>
        <CheckoutForm
          planId={planId}
          planDetails={planDetails}
          billingCycle={billingCycle}
        />
        <div className="w-full mt-4 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 text-center text-brandColor hover:underline py-2"
          >
            Return to Home
          </button>
          <button
            onClick={() => router.push("/pricing")}
            className="flex-1 text-center text-gray-600 hover:text-brandColor hover:underline py-2"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main export wrapped in Suspense ──
const CheckoutPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader size={40} className="animate-spin text-brandColor" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
};

export default CheckoutPage;
