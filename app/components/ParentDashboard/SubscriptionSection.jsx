"use client";

import { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

// DEMO: Multiple billing records to simulate history
const demoBillingHistory = [
  {
    id: "INV-2025-004",
    plan: "Parent",
    price: 2.99,
    currency: "£",
    billingPeriod: "months",
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(new Date(new Date().setDate(new Date().getDate() - 7)).setMonth(new Date(new Date().setDate(new Date().getDate() - 7)).getMonth() + 1)),
    status: "active",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-2025-003",
    plan: "Parent",
    price: 2.99,
    currency: "£",
    billingPeriod: "months",
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    endDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    status: "expired",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-2025-002",
    plan: "Parent",
    price: 2.99,
    currency: "£",
    billingPeriod: "months",
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    endDate: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    status: "expired",
    paymentMethod: "Mastercard •••• 7891",
  },
  {
    id: "INV-2025-001",
    plan: "Basic",
    price: 0,
    currency: "£",
    billingPeriod: "free",
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 5)),
    endDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    status: "expired",
    paymentMethod: "—",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-50 text-green-700 border border-green-200",
    expired: "bg-gray-100 text-gray-500 border border-gray-200",
    cancelled: "bg-red-50 text-red-600 border border-red-200",
  };
  const icons = {
    active: <FiCheckCircle className="w-3 h-3" />,
    expired: <FiClock className="w-3 h-3" />,
    cancelled: <FiXCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium font-poppins ${styles[status] || styles.expired}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const SubscriptionSection = ({ currentPlan = "free" }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userSubscription, setUserSubscription] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const plansRes = await fetch("/api/parent/subscription");
        const plansData = await plansRes.json();
        if (plansRes.ok) setPlans(plansData.plans || []);
        else setError(plansData.error || "Failed to load plans");

        const profileRes = await fetch("/api/parent/profile");
        const profileData = await profileRes.json();
        if (profileRes.ok && profileData.parent) setUserSubscription(profileData.parent);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const getDaysLeft = (endDate) =>
    Math.max(0, Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-8 h-8 border-4 border-brandColor border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const activePlan = demoBillingHistory.find((b) => b.status === "active");

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-semibold font-poppins text-gray-800">Subscription</h1>
          <p className="text-sm text-gray-500 font-poppins">Manage your plan and billing</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Active Plan Summary Card */}
        {activePlan && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold font-poppins text-gray-700 uppercase tracking-wide">
                Current Plan
              </h2>
              <StatusBadge status="active" />
            </div>
            <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-400 font-poppins mb-1">Plan</p>
                <p className="text-sm font-semibold font-poppins text-gray-800">{activePlan.plan}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-poppins mb-1">Price</p>
                <p className="text-sm font-semibold font-poppins text-gray-800">
                  {activePlan.currency}{activePlan.price}/month
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-poppins mb-1">Renews On</p>
                <p className="text-sm font-semibold font-poppins text-gray-800">{formatDate(activePlan.endDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-poppins mb-1">Days Remaining</p>
                <p className="text-sm font-semibold font-poppins text-brandColor">
                  {getDaysLeft(activePlan.endDate)} days left
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billing History Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold font-poppins text-gray-700 uppercase tracking-wide">
              Billing History
            </h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm font-poppins">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Start Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">End Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {demoBillingHistory.map((record) => (
                  <tr
                    key={record.id}
                    className={`hover:bg-gray-50/60 transition-colors ${record.status === "active" ? "bg-green-50/30" : ""}`}
                  >
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">{record.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{record.plan}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(record.startDate)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(record.endDate)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {record.price === 0 ? "Free" : `${record.currency}${record.price.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{record.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={record.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-gray-100">
            {demoBillingHistory.map((record) => (
              <div
                key={record.id}
                className={`px-4 py-4 ${record.status === "active" ? "bg-green-50/30" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800 font-poppins text-sm">{record.plan}</p>
                    <p className="text-xs text-gray-400 font-mono">{record.id}</p>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <p className="text-xs text-gray-400 font-poppins">Start</p>
                    <p className="text-xs font-medium text-gray-700 font-poppins">{formatDate(record.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-poppins">End</p>
                    <p className="text-xs font-medium text-gray-700 font-poppins">{formatDate(record.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-poppins">Amount</p>
                    <p className="text-xs font-semibold text-gray-800 font-poppins">
                      {record.price === 0 ? "Free" : `${record.currency}${record.price.toFixed(2)}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-poppins">Payment</p>
                    <p className="text-xs text-gray-500 font-poppins">{record.paymentMethod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionSection;