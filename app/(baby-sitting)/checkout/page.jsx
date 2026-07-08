"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const CheckoutForm = ({ planId, planDetails, billingCycle }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">Plan: {planDetails?.name}</p>
        <p className="text-2xl font-bold text-gray-800">
          £{planDetails?.price?.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          Billing: {billingCycle === "yearly" ? "Yearly" : "Monthly"}
        </p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brandColor text-white py-3 rounded-lg font-semibold hover:bg-[#558b2f] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <button
          onClick={() => router.push("/pricing")}
          className="w-full mt-4 text-center text-brandColor hover:underline py-2"
        >
          Back to Pricing
        </button>
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
