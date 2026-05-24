"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader } from "lucide-react";
import { toast } from "sonner";

const CheckoutSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [status, setStatus] = useState("verifying");
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      toast.error("No session found");
      router.push("/pricing");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/payment/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.status === "success") {
          setStatus("success");
          setSubscription(data.subscription);
          toast.success("Payment successful! Your subscription is now active.");
          setTimeout(() => {
            router.push("/dashboard/parent");
          }, 3000);
        } else {
          setStatus("pending");
          toast.info("Payment is being processed. Please check your account shortly.");
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
        toast.error("Failed to verify payment");
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <Loader size={50} className="animate-spin text-brandColor mb-4" />
        <p className="text-lg text-gray-600">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Your subscription has been activated. You'll be redirected to your dashboard in a few seconds.
          </p>
          {subscription && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600">Plan</p>
              <p className="text-lg font-semibold text-gray-800">{subscription.plan}</p>
              <p className="text-sm text-gray-600 mt-3">Valid until</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(subscription.endDate).toLocaleDateString()}
              </p>
            </div>
          )}
          <button
            onClick={() => router.push("/dashboard/parent")}
            className="w-full bg-brandColor text-white py-3 rounded-lg font-semibold hover:bg-[#558b2f]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-lg text-gray-600">Payment verification in progress...</p>
        <button
          onClick={() => router.push("/dashboard/parent")}
          className="w-full mt-6 bg-brandColor text-white py-3 rounded-lg font-semibold hover:bg-[#558b2f]"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

// ── Wrapped in Suspense to fix build error ──
const CheckoutSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={50} className="animate-spin text-brandColor" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccessPage;