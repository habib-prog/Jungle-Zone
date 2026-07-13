"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getImageUrl } from "@/app/lib/imageUtils";

const AllParents = () => {
  const [parents, setParents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter states - separated input from actual search to trigger on button click
  const [emailInput, setEmailInput] = useState("");
  const [emailSearch, setEmailSearch] = useState("");

  const limit = 10;

  useEffect(() => {
    const fetchParents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (emailSearch) params.append("email", emailSearch);

        const res = await fetch(`/api/admin/parentsInfo?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setParents(data.parents || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        toast.error(error.message || "Failed to fetch parents:");
      } finally {
        setLoading(false);
      }
    };
    fetchParents();
  }, [page, emailSearch]);

  const handleInfoClick = (parent) => {
    setSelectedParent(parent);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedParent(null);
  };

  const handleClearFilters = () => {
    setEmailInput("");
    setEmailSearch("");
    setPage(1);
  };

  const handleSearch = () => {
    setEmailSearch(emailInput);
    setPage(1);
  };

  return (
    <div className="bg-white p-6 rounded-xl border">
      <div className="flex justify-between items-start">
        <h2 className="font-semibold mb-4">All Parents</h2>

        {/* Filters */}
        <div className="flex flex-wrap items-stretch gap-4 mb-6">
          <div className="max-w-75">
            <input
              type="text"
              placeholder="Search by email..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-brandColor text-white hover:bg-brandColor/80 rounded-lg cursor-pointer"
          >
            Search
          </button>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="py-2">ID</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subscription</th>
                <th>TotalDeals</th>
                <th>Total Spent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parents?.map((u, i) => (
                <tr key={u._id} className="border-b last:border-none">
                  <td className="py-2">#{i + 1}</td>
                  <td className="py-2">
                    <img
                      loading="lazy"
                      src={
                        getImageUrl(u.picture) ??
                        u.image ??
                        "/default-avatar.png"
                      }
                      alt={u.fullName || u.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>
                  <td>{u.fullName || u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.subscription}</td>
                  <td>{u.totalDeals}</td>
                  <td>{u.totalSpent}</td>
                  <td>
                    <button
                      onClick={() => handleInfoClick(u)}
                      className="bg-brandColor hover:bg-brandColor/80 cursor-pointer text-white px-2 py-1 rounded"
                    >
                      Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Parent Details Modal */}
      {showModal && selectedParent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Parent Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
              >
                <X />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <img
                  loading="lazy"
                  src={
                    getImageUrl(selectedParent.picture) ??
                    selectedParent.image ??
                    "/default-avatar.png"
                  }
                  alt={selectedParent.fullName || selectedParent.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-brandColor"
                />
                <h4 className="mt-2 font-semibold text-lg">
                  {selectedParent.fullName || selectedParent.name}
                </h4>
                <p className="text-gray-500">{selectedParent.role}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span>{selectedParent.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span>{selectedParent.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">
                    Subscription:
                  </span>
                  <span className="capitalize">
                    {selectedParent.subscription}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">
                    Total Deals:
                  </span>
                  <span>{selectedParent.totalDeals}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">
                    Total Spent:
                  </span>
                  <span>${selectedParent.totalSpent || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Provider:</span>
                  <span className="capitalize">{selectedParent.provider}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-700 mb-2">
                Address Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">House No:</span>
                  <span>{selectedParent.houseNo || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Road:</span>
                  <span>{selectedParent.road || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">State:</span>
                  <span>{selectedParent.state || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Post Code:</span>
                  <span>{selectedParent.postCode || "Not provided"}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-700 mb-2">
                Additional Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">
                    National ID:
                  </span>
                  <span>{selectedParent.nationalId || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">More Info:</span>
                  <span>{selectedParent.moreInfo || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Joined:</span>
                  <span>
                    {new Date(selectedParent.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">
                    Last Updated:
                  </span>
                  <span>
                    {new Date(selectedParent.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllParents;
