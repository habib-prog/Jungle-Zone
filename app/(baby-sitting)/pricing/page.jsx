"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Check,
  Loader,
  RefreshCw,
  XCircle,
  ArrowUpCircle,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/* ─── helpers ─── */
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

/* ─── Modal component ─── */
const ActionModal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
        <h3 className="text-lg font-bold font-poppins text-gray-800 mb-4">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
};

/* ─── Main page ─── */
const SubscriptionPage = () => {
  const [selectedRole, setSelectedRole] = useState("parent");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  // Modal state: { type: 'cancel'|'switch'|'renew', targetPlanId, targetBillingCycle }
  const [modal, setModal] = useState(null);

  const router = useRouter();

  /* fetch plans */
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/parent/subscription?role=${selectedRole}`,
        );
        const { plans } = await res.json();
        setPlans(plans || []);
      } catch {
        toast.error("Failed to load subscription plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [selectedRole]);

  /* fetch user profile + active subscription */
  const fetchUserState = useCallback(async () => {
    try {
      const [parentRes, sitterRes] = await Promise.all([
        fetch("/api/parent/profile"),
        fetch("/api/babysitters/profile"),
      ]);
      let profile = null;
      if (parentRes.ok) {
        const d = await parentRes.json();
        profile = d.parent;
      } else if (sitterRes.ok) {
        const d = await sitterRes.json();
        profile = d.sitter;
      }
      setUserProfile(profile);

      // Fetch active subscription
      const subRes = await fetch("/api/payment/subscription");
      if (subRes.ok) {
        const d = await subRes.json();
        setActiveSub(d.subscription || null);
      }
    } catch {
      /* not logged in – fine */
    }
  }, []);

  useEffect(() => {
    fetchUserState();
  }, [fetchUserState]);

  /* ── determine per-card state ── */
  const getCardState = (billingCycle) => {
    if (!activeSub) return "idle"; // no subscription
    if (activeSub.billingCycle === billingCycle) return "current"; // same plan+cycle
    return "switch"; // different cycle
  };

  /* ── checkout (new subscription) ── */
  const doCheckout = async (planId, billingCycle) => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to create checkout session");
      const { sessionUrl } = data;
      if (!sessionUrl) throw new Error("Checkout URL was not returned");
      window.location.href = sessionUrl;
    } catch (err) {
      toast.error(err.message || "Failed to process checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  /* ── cancel subscription ── */
  const doCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch("/api/payment/subscription", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to cancel subscription");
      toast.success("Subscription will be cancelled at the end of the period.");
      await fetchUserState();
    } catch (err) {
      toast.error(err.message || "Failed to cancel");
    } finally {
      setCancelLoading(false);
      setModal(null);
    }
  };

  /* ── resume subscription ── */
  const doResume = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch("/api/payment/subscription", {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to resume subscription");
      toast.success("Subscription resumed successfully");
      await fetchUserState();
    } catch (err) {
      toast.error(err.message || "Failed to resume");
    } finally {
      setCancelLoading(false);
      setModal(null);
    }
  };

  /* ── handle button click on a card ── */
  const handlePlanClick = async (planId, billingCycle) => {
    if (!userProfile) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    const state = getCardState(billingCycle);
    if (state === "current") {
      // Same plan — show renew or cancel modal
      setModal({ type: "current", planId, billingCycle });
    } else if (state === "switch") {
      // Different cycle — show switch modal (cancel current, buy new)
      setModal({ type: "switch", planId, billingCycle });
    } else {
      // No subscription — go straight to checkout
      await doCheckout(planId, billingCycle);
    }
  };

  /* ── switch: just go to checkout; old sub cancelled server-side on success ── */
  const doSwitch = async () => {
    setModal(null);
    await doCheckout(modal.planId, modal.billingCycle);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={40} className="animate-spin text-brandColor" />
      </div>
    );
  }

  const filteredPlans = plans.filter(
    (p) => p.category === selectedRole || p.category === "both",
  );

  const monthlyPlanObj =
    filteredPlans.find((p) => p.name.toLowerCase() === "monthly") ||
    filteredPlans[0];
  const yearlyPlanObj =
    filteredPlans.find((p) => p.name.toLowerCase() === "yearly") ||
    filteredPlans[1];

  const monthlyPrice = monthlyPlanObj?.price || 2.99;
  const yearlyPrice = yearlyPlanObj?.price || 26.91;
  const savings = monthlyPrice * 12 - yearlyPrice;

  const data = {
    parent: { name: "Parent", icon: "👨‍👩‍👧" },
    babysitter: { name: "Babysitter", icon: "👩‍🍼" },
  };

  const features = {
    parent: [
      "Find trusted babysitters near you",
      "UNLIMITED babysitter searches",
      "Background checks & verified profiles",
      "Cancellation protection",
    ],
    babysitter: [
      "Get hired by families",
      "Build your reputation",
      "Profile visibility boost",
      "Priority listing",
    ],
  };

  /* ── Card button renderer ── */
  const PlanButton = ({ billingCycle, planId, baseColor, hoverColor }) => {
    const state = getCardState(billingCycle);

    if (state === "current") {
      const isCancelled = activeSub?.paymentStatus === "cancelled";
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 justify-center text-xs text-brandColor font-poppins font-medium bg-green-50 border border-green-200 py-2 px-3 rounded-xl">
            <Check size={14} /> Current active plan
            {activeSub?.endDate && (
              <span className="text-gray-400 ml-1">
                · {isCancelled ? "cancels" : "renews"} {fmtDate(activeSub.endDate)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => isCancelled ? doResume() : handlePlanClick(planId, billingCycle)}
              disabled={checkoutLoading || cancelLoading}
              className={`flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold text-sm text-white transition-all shadow ${baseColor} ${hoverColor} disabled:opacity-50`}
            >
              <RefreshCw size={14} /> {isCancelled ? "Resume" : "Renew"}
            </button>
            {activeSub?.paymentStatus !== "cancelled" && (
              <button
                onClick={() => setModal({ type: "cancel" })}
                disabled={cancelLoading}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold text-sm text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all disabled:opacity-50"
              >
                <XCircle size={14} /> Cancel
              </button>
            )}
          </div>
        </div>
      );
    }

    if (state === "switch") {
      const switchLabel =
        billingCycle === "yearly" ? "Switch to Yearly" : "Switch to Monthly";
      return (
        <button
          onClick={() => handlePlanClick(planId, billingCycle)}
          disabled={checkoutLoading || cancelLoading}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg text-white transition-all shadow-lg ${baseColor} ${hoverColor} disabled:opacity-50`}
        >
          {checkoutLoading || cancelLoading ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <ArrowUpCircle size={20} />
          )}
          {checkoutLoading || cancelLoading ? "Processing..." : switchLabel}
        </button>
      );
    }

    // idle
    const isNew = !userProfile;
    const isTrialActive = isUserOnTrial;
    const isEligibleForNewTrial = hasNeverHadTrial;

    let buttonLabel = "";
    if (isNew || isEligibleForNewTrial) {
      buttonLabel = `Start ${selectedRole === "parent" ? "1-Month" : "2-Month"} Free Trial`;
    } else {
      buttonLabel =
        billingCycle === "yearly" ? "Choose Yearly" : "Choose Monthly";
    }

    return (
      <button
        onClick={() => handlePlanClick(planId, billingCycle)}
        disabled={checkoutLoading || !planId}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg text-white transition-all shadow-lg ${baseColor} ${hoverColor} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {checkoutLoading && <Loader size={20} className="animate-spin" />}
        {checkoutLoading ? "Processing..." : buttonLabel}
      </button>
    );
  };

  const isUserOnTrial =
    userProfile?.subscription === "trial" &&
    userProfile?.subscriptionExpiry &&
    new Date(userProfile.subscriptionExpiry) > new Date();
  const hasNeverHadTrial =
    userProfile &&
    userProfile.subscription === "free" &&
    !userProfile.subscriptionStart;
  const showTrialBadge = !userProfile || hasNeverHadTrial || isUserOnTrial;

  return (
    <section className="min-h-screen pt-30 pb-12 lg:pt-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select your role to see the subscription options available.
          </p>
        </div>

        {/* Trial banner */}
        {isUserOnTrial && (
          <div className="mb-8 max-w-3xl mx-auto bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-xs">
            <span className="text-xl shrink-0 mt-0.5">🎉</span>
            <div className="text-sm font-poppins text-gray-700">
              <span className="font-semibold text-brandColor">
                You are on a Free Trial!
              </span>{" "}
              Your free access is active until{" "}
              <strong className="text-gray-900">
                {fmtDate(userProfile.subscriptionExpiry)}
              </strong>
              . You will not be charged anything during this trial period. If
              you subscribe to a paid plan now, you will pay{" "}
              <strong className="text-gray-900">£0.00 today</strong>, and you
              will only be charged{" "}
              <strong className="text-gray-900">£2.99/month</strong> or{" "}
              <strong className="text-gray-900">£26.91/year</strong> when your
              trial ends, unless you cancel beforehand.
            </div>
          </div>
        )}

        {/* Active subscription banner */}
        {activeSub && (
          <div className="mb-8 max-w-3xl mx-auto bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <Info size={18} className="text-brandColor shrink-0 mt-0.5" />
            <div className="text-sm font-poppins text-gray-700">
              <span className="font-semibold text-brandColor">
                Active subscription:
              </span>{" "}
              {activeSub.plan} ·{" "}
              {activeSub.billingCycle === "yearly" ? "Yearly" : "Monthly"} ·
              {activeSub.paymentStatus === "cancelled" ? " Cancels " : " Renews "} {fmtDate(activeSub.endDate)}
            </div>
          </div>
        )}

        {/* Role Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-1 inline-flex">
            {Object.keys(data).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${selectedRole === role ? "bg-brandColor text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <span className="text-xl">{data[role].icon}</span>
                <span>{data[role].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Monthly Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-brandColor flex flex-col justify-between">
            <div>
              <div className="bg-brandColor p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-1">Monthly</h3>
                <p className="opacity-90 text-sm">Pay month-to-month</p>
              </div>
              <div className="p-8 text-center pb-2">
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="flex items-center justify-center">
                    <span className="text-5xl font-bold text-gray-900">
                      £{monthlyPrice.toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-lg ml-1">/month</span>
                  </div>
                  {showTrialBadge && (
                    <span className="mt-2 inline-block px-3 py-1 bg-green-50 text-brandColor text-xs font-semibold rounded-full border border-green-200">
                      {selectedRole === "parent"
                        ? "Includes 1 Month Free Trial"
                        : "Includes 2 Months Free Trial"}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {features[selectedRole].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-[#e8f5e9] flex items-center justify-center shrink-0">
                        <Check size={14} className="text-brandColor" />
                      </div>
                      <span className="text-gray-600 text-sm leading-relaxed">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-8 pt-0">
              <PlanButton
                billingCycle="monthly"
                planId={monthlyPlanObj?._id}
                baseColor="bg-brandColor"
                hoverColor="hover:bg-[#558b2f]"
              />
            </div>
          </div>

          {/* Yearly Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative flex flex-col justify-between">
            <div>
              <div className="absolute top-0 right-0 bg-[#ff5722] text-white px-5 py-2 rounded-bl-xl text-sm font-bold z-20 shadow-lg">
                Most Popular
              </div>
              <div className="bg-linear-to-r from-[#ff9800] to-[#ffb74d] p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-1">Yearly</h3>
                <p className="opacity-90 text-sm">Billed annually (25% off)</p>
              </div>
              <div className="p-8 text-center pb-2">
                <div className="flex flex-col items-center justify-center mb-2">
                  <div className="flex items-center justify-center">
                    <span className="text-5xl font-bold text-gray-900">
                      £{yearlyPrice.toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-lg ml-1">/year</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    £{(yearlyPrice / 12).toFixed(2)} per month
                  </p>
                  {showTrialBadge && (
                    <span className="mt-2 inline-block px-3 py-1 bg-green-50 text-brandColor text-xs font-semibold rounded-full border border-green-200">
                      {selectedRole === "parent"
                        ? "Includes 1 Month Free Trial"
                        : "Includes 2 Months Free Trial"}
                    </span>
                  )}
                </div>
                <div className="mb-4 inline-flex items-center gap-1 bg-green-100 text-brandColor px-3 py-1 rounded-full text-sm font-medium">
                  <Check size={16} /> You save £{savings.toFixed(2)}!
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {features[selectedRole].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-[#e8f5e9] flex items-center justify-center shrink-0">
                        <Check size={14} className="text-brandColor" />
                      </div>
                      <span className="text-gray-600 text-sm leading-relaxed">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-8 pt-0">
              <PlanButton
                billingCycle="yearly"
                planId={yearlyPlanObj?._id}
                baseColor="bg-[#ff9800]"
                hoverColor="hover:bg-[#f57c00]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Cancel Confirmation Modal ─── */}
      <ActionModal
        open={
          modal?.type === "cancel" ||
          (modal?.type === "current" && modal?.action === "cancel")
        }
        onClose={() => setModal(null)}
        title="Cancel Subscription"
      >
        <p className="text-sm text-gray-600 font-poppins mb-5">
          Are you sure you want to cancel your current subscription?
          {activeSub?.endDate && (
            <span className="block mt-1 text-gray-400">
              You will keep access until{" "}
              <strong>{fmtDate(activeSub.endDate)}</strong>.
            </span>
          )}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setModal(null)}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-poppins hover:bg-gray-50"
          >
            Keep Plan
          </button>
          <button
            onClick={doCancel}
            disabled={cancelLoading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-poppins hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {cancelLoading ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <XCircle size={14} />
            )}
            {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </ActionModal>

      {/* ─── Current Plan Modal (Renew or Cancel) ─── */}
      <ActionModal
        open={modal?.type === "current"}
        onClose={() => setModal(null)}
        title="Manage Your Subscription"
      >
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-sm font-poppins text-gray-700">
          <p>
            <span className="font-semibold text-brandColor">Active:</span>{" "}
            {activeSub?.plan} ·{" "}
            {activeSub?.billingCycle === "yearly" ? "Yearly" : "Monthly"}
          </p>
          {activeSub?.endDate && (
            <p className="text-xs text-gray-400 mt-1">
              {activeSub?.paymentStatus === "cancelled" ? "Cancels on " : "Renews on "} {fmtDate(activeSub.endDate)}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <button
            onClick={async () => {
              if (activeSub?.paymentStatus === "cancelled") {
                await doResume();
              } else {
                setModal(null);
                await doCheckout(modal.planId, modal.billingCycle);
              }
            }}
            disabled={checkoutLoading || cancelLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brandColor text-white text-sm font-poppins hover:bg-[#558b2f] disabled:opacity-50"
          >
            {checkoutLoading || cancelLoading ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            {activeSub?.paymentStatus === "cancelled" ? "Resume Plan" : "Renew Plan"}
          </button>
          {activeSub?.paymentStatus !== "cancelled" && (
            <button
              onClick={() => setModal({ type: "cancel" })}
              disabled={cancelLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-poppins hover:bg-red-100 disabled:opacity-50"
            >
              <XCircle size={14} /> Cancel Subscription
            </button>
          )}
        </div>
      </ActionModal>

      {/* ─── Switch Plan Modal ─── */}
      <ActionModal
        open={modal?.type === "switch"}
        onClose={() => setModal(null)}
        title="Switch Billing Cycle"
      >
        <p className="text-sm text-gray-600 font-poppins mb-2">
          Your current plan will be <strong>cancelled</strong> and you'll be
          charged for the new{" "}
          <strong className="capitalize">{modal?.billingCycle}</strong> plan
          immediately.
        </p>
        {activeSub?.endDate && (
          <p className="text-xs text-gray-400 font-poppins mb-5">
            Current plan ends: {fmtDate(activeSub.endDate)}
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => setModal(null)}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-poppins hover:bg-gray-50"
          >
            Keep Current
          </button>
          <button
            onClick={doSwitch}
            disabled={cancelLoading || checkoutLoading}
            className="flex-1 py-2.5 rounded-xl bg-brandColor text-white text-sm font-poppins hover:bg-[#558b2f] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {cancelLoading || checkoutLoading ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <ArrowUpCircle size={14} />
            )}
            {cancelLoading || checkoutLoading ? "Processing..." : "Switch Now"}
          </button>
        </div>
      </ActionModal>
    </section>
  );
};

export default SubscriptionPage;
