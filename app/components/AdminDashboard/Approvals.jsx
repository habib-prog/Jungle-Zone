"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getImageUrl } from "@/app/lib/imageUtils";

const CATEGORIES = [
  { key: "all", label: "All categories" },
  { key: "babysitting", label: "Babysitting" },
  { key: "cleaning", label: "Cleaning" },
  { key: "cooking", label: "Cooking" },
];

const getCategory = (request) => request.serviceCategory || "babysitting";

const getCategoryLabel = (category) => ({
  babysitting: "Babysitter / Nanny",
  cleaning: "Cleaner",
  cooking: "Cook / Chef",
}[category] || "Babysitter / Nanny");

const Approvals = () => {
  const [requests, setRequests] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [counts, setCounts] = useState({ all: 0, babysitting: 0, cleaning: 0, cooking: 0 });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: activeCategory, page: String(page), limit: "8" });
      const response = await fetch(`/api/admin/babySitterApproval?${params}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load pending requests");
      setRequests(Array.isArray(result.requests) ? result.requests : []);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.totalCount || 0);
      setCounts(result.counts || { all: 0, babysitting: 0, cleaning: 0, cooking: 0 });
    } catch (error) {
      toast.error(error.message || "Could not load pending requests");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (request, action) => {
    if (action === "reject" && !window.confirm(`Reject and remove ${request.fullName}'s ${getCategoryLabel(getCategory(request))} request?`)) return;

    setSubmittingId(request._id);
    try {
      const response = await fetch("/api/admin/babySitterApproval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ babysitterId: request._id, action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Could not ${action} request`);

      toast.success(action === "approve" ? "Provider approved" : "Request rejected");
      if (requests.length === 1 && page > 1) setPage((current) => current - 1);
      else fetchRequests();
    } catch (error) {
      toast.error(error.message || `Could not ${action} request`);
    } finally {
      setSubmittingId("");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Pending provider requests</h2>
        <p className="mt-1 text-sm text-gray-500">Provider profiles waiting for an admin decision. Email verification status is shown on each request.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter approvals by service category">
        {CATEGORIES.map((category) => (
          <button
            key={category.key}
            type="button"
            role="tab"
            aria-selected={activeCategory === category.key}
            onClick={() => { setActiveCategory(category.key); setPage(1); }}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${activeCategory === category.key ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"}`}
          >
            {category.label}<span className="ml-2 opacity-70">{counts[category.key]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">Loading approval requests…</div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h3 className="font-semibold text-gray-800">No pending requests</h3>
          <p className="mt-1 text-sm text-gray-500">New provider requests will appear here under their service category.</p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {requests.map((request) => {
            const category = getCategory(request);
            const busy = submittingId === request._id;
            const photo = getImageUrl(request.profilePhoto);
            return (
              <article key={request._id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-4 border-b border-gray-100 p-5">
                  <img
                    src={photo || "/img/user-placeholder.svg"}
                    alt=""
                    className="h-16 w-16 rounded-full bg-gray-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{request.fullName}</h3>
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800">{getCategoryLabel(category)}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${request.isVerified ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
                        Email {request.isVerified ? "verified" : "not verified"}
                      </span>
                    </div>
                    <p className="mt-1 break-all text-sm text-gray-600">{request.email}</p>
                    <p className="mt-1 text-xs text-gray-400">Submitted {new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <p><span className="text-gray-400">Location:</span> <span className="text-gray-700">{[request.location, request.zipCode].filter(Boolean).join(" · ") || "—"}</span></p>
                    <p><span className="text-gray-400">Experience:</span> <span className="text-gray-700">{request.yearsOfExperience ?? "—"} years</span></p>
                    <p><span className="text-gray-400">Rate:</span> <span className="text-gray-700">{request.hourlyRate ? `£${request.hourlyRate}/hr` : "—"}</span></p>
                    <p><span className="text-gray-400">Phone:</span> <span className="text-gray-700">{request.phoneNumber || "—"}</span></p>
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-gray-600">{request.description || "No bio provided."}</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Comfortable with</h4>
                      <p className="mt-1 text-sm text-gray-700">{(request.comfortableWith?.length ? request.comfortableWith : request.comfortableWithAgeGroup || []).join(", ") || "—"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Preferences</h4>
                      <p className="mt-1 text-sm text-gray-700">{request.preferences?.join(", ") || "—"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Skills</h4>
                      <p className="mt-1 text-sm text-gray-700">{request.skills?.join(", ") || "—"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Provider statements</h4>
                      <p className="mt-1 text-sm text-gray-700">{request.verificationDocs?.length ? request.verificationDocs.join("; ") : "None"}</p>
                    </div>
                  </div>

                  <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">Provider statements are self-reported and have not been checked or verified by JungleZone.</p>

                  <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                    <button type="button" onClick={() => handleAction(request, "reject")} disabled={busy} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">Reject</button>
                    <button type="button" onClick={() => handleAction(request, "approve")} disabled={busy} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50">{busy ? "Saving…" : "Approve"}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && totalCount > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{(page - 1) * 8 + 1}–{Math.min(page * 8, totalCount)}</span> of <span className="font-semibold text-gray-900">{totalCount}</span> requests
          </p>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >Previous</button>
            <span className="min-w-20 text-center text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >Next</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Approvals;
