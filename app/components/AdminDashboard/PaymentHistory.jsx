"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiClock, FiXCircle, FiAlertCircle, FiRefreshCw, FiSearch, FiFilter } from "react-icons/fi";

const StatusBadge = ({ status }) => {
  const config = {
    completed: { style: "bg-green-50 text-green-700 border border-green-200", icon: <FiCheckCircle className="w-3 h-3" />, label: "Completed" },
    pending:   { style: "bg-yellow-50 text-yellow-700 border border-yellow-200", icon: <FiClock className="w-3 h-3" />, label: "Pending" },
    failed:    { style: "bg-red-50 text-red-600 border border-red-200", icon: <FiXCircle className="w-3 h-3" />, label: "Failed" },
    cancelled: { style: "bg-gray-100 text-gray-500 border border-gray-200", icon: <FiAlertCircle className="w-3 h-3" />, label: "Cancelled" },
    refunded:  { style: "bg-purple-50 text-purple-700 border border-purple-200", icon: <FiRefreshCw className="w-3 h-3" />, label: "Refunded" },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium font-poppins ${c.style}`}>
      {c.icon}
      {c.label}
    </span>
  );
};

const CategoryBadge = ({ category }) => {
  const config = {
    parent:     "bg-blue-50 text-blue-700 border border-blue-200",
    babysitter: "bg-orange-50 text-orange-700 border border-orange-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-poppins capitalize ${config[category] || "bg-gray-100 text-gray-500"}`}>
      {category}
    </span>
  );
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const formatAmount = (amount, currency = "gbp") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount ?? 0);

const STATUSES = ["all", "completed", "pending", "failed", "cancelled", "refunded"];

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0, revenue: 0 });

  const fetchPayments = async (currentPage = 1, status = "all") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage, limit: 20 });
      if (status !== "all") params.set("status", status);

      const res = await fetch(`/api/admin/payments?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load payments");

      setPayments(data.payments || []);
      setPagination(data.pagination || { total: 0, pages: 1 });

      // Compute stats from all completed payments total
      const allRes = await fetch(`/api/admin/payments?limit=1000`);
      const allData = await allRes.json();
      if (allRes.ok) {
        const all = allData.payments || [];
        setStats({
          total: all.length,
          completed: all.filter((p) => p.status === "completed").length,
          pending: all.filter((p) => p.status === "pending").length,
          failed: all.filter((p) => p.status === "failed").length,
          revenue: all
            .filter((p) => p.status === "completed")
            .reduce((sum, p) => sum + (p.amount || 0), 0),
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(page, statusFilter);
  }, [page, statusFilter]);

  const filtered = payments.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.planName?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.stripeSessionId?.toLowerCase().includes(q) ||
      p.userId?.toString().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Payments", value: stats.total, color: "text-gray-800" },
          { label: "Completed", value: stats.completed, color: "text-green-600" },
          { label: "Pending", value: stats.pending, color: "text-yellow-600" },
          {
            label: "Total Revenue",
            value: formatAmount(stats.revenue),
            color: "text-blue-700",
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-poppins uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold font-poppins ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by plan, category, session ID..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg font-poppins text-gray-700 focus:outline-none focus:ring-2 focus:ring-brandColor/30"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter className="text-gray-400 w-4 h-4 shrink-0" />
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-poppins capitalize transition-colors ${
                statusFilter === s
                  ? "bg-brandColor text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold font-poppins text-gray-700 uppercase tracking-wide">
            Payment Records
          </h2>
          <span className="text-xs text-gray-400 font-poppins">{pagination.total} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-brandColor border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="px-6 py-10 text-center text-red-500 font-poppins text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400 font-poppins text-sm">
            No payment records found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm font-poppins">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Date & Time", "Plan", "Category", "Amount", "Billing", "Status", "Session ID"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 text-gray-700 whitespace-nowrap text-xs">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-800">
                        {p.planName || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <CategoryBadge category={p.category} />
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-800">
                        {formatAmount(p.amount, p.currency)}
                      </td>
                      <td className="px-5 py-4 text-gray-500 capitalize text-xs">
                        {p.billingCycle || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-4 text-gray-400 font-mono text-xs">
                        {p.stripeSessionId ? p.stripeSessionId.slice(0, 24) + "…" : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map((p) => (
                <div key={p._id} className="px-4 py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 font-poppins">{p.planName}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={p.category} />
                    <span className="text-xs text-gray-500 font-poppins capitalize">{p.billingCycle}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-poppins">
                    <span>{formatDate(p.createdAt)}</span>
                    <span className="font-semibold text-gray-800">{formatAmount(p.amount, p.currency)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-poppins">
                  Page {pagination.currentPage} of {pagination.pages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 font-poppins"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= pagination.pages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 font-poppins"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
