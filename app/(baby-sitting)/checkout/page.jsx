"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutForm = ({ planId, planDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle: "monthly",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error(error);
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
      </div>

      <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-brandColor text-white py-3 rounded-lg font-semibold hover:bg-[#558b2f] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader size={20} className="animate-spin" />}
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndPlan = async () => {
      // Check authentication first
      try {
        const authResponse = await fetch("/api/parent/profile");
        if (!authResponse.ok) {
          toast.error("Please login to checkout");
          router.push("/login");
          return;
        }
      } catch (error) {
        toast.error("Authentication failed");
        router.push("/login");
        return;
      }

      setIsAuthenticated(true);

      // Check planId
      if (!planId) {
        toast.error("No plan selected");
        router.push("/pricing");
        return;
      }

      // Fetch plan details
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
        console.error(error);
        toast.error("Failed to load plan details");
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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Checkout
        </h1>

        <Elements stripe={stripePromise}>
          <CheckoutForm planId={planId} planDetails={planDetails} />
        </Elements>

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

export default CheckoutPage;
