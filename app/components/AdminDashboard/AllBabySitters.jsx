"use client";

import Link from "next/link";
import { SquareArrowOutUpRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getImageUrl } from "@/app/lib/imageUtils";

const AllBabySitters = () => {
    const [babysitters, setBabysitters] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedSitter, setSelectedSitter] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [approvalAction, setApprovalAction] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter states - separated input from actual search to trigger on button click
    const [emailInput, setEmailInput] = useState("");
    const [emailSearch, setEmailSearch] = useState("");
    const [statusInput, setStatusInput] = useState("all");
    const [statusSearch, setStatusSearch] = useState("all");

    const limit = 10;

    useEffect(() => {
        const fetchBabysitters = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });
                if (emailSearch) params.append("email", emailSearch);
                if (statusSearch !== "all") params.append("isApproved", statusSearch === "approved" ? "true" : "false");

                const res = await fetch(`/api/admin/babySitterInfo?${params.toString()}`);
                const data = await res.json();
                setBabysitters(data.babysitters || []);
                setTotalPages(data.pagination?.totalPages || 1);
            } catch (error) {
                toast.error(error.message || "Failed to fetch babysitters:");
            } finally {
                setLoading(false);
            }
        };
        fetchBabysitters();
    }, [page, emailSearch, statusSearch]);

    const handleInfoClick = (sitter) => {
        setSelectedSitter(sitter);
        setShowModal(true);
        setApprovalAction(sitter.isApproved ? "reject" : "approve");
    };

    const handleStatusSubmit = async () => {
        if (!selectedSitter || !approvalAction) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/babySitterInfo?babysitterId=${selectedSitter._id}&action=${approvalAction}`, {
                method: "POST",
            });
            if (res.ok) {
                setBabysitters((prev) =>
                    prev.map((s) =>
                        s._id === selectedSitter._id ? { ...s, isApproved: approvalAction === "approve" } : s
                    )
                );
                setSelectedSitter((prev) => ({ ...prev, isApproved: approvalAction === "approve" }));
            }
        } catch (error) {
            toast.error(error.message || "Failed to update status:");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedSitter(null);
        setApprovalAction("");
    };

    const handleClearFilters = () => {
        setEmailInput("");
        setEmailSearch("");
        setStatusInput("all");
        setStatusSearch("all");
        setPage(1);
    };

    const handleSearch = () => {
        setEmailSearch(emailInput);
        setStatusSearch(statusInput);
        setPage(1);
    };

    return (
        <div className="bg-white p-6 rounded-xl border">
            <div className="flex justify-between items-start">
                <h2 className="font-semibold mb-4">All Babysitters</h2>

                {/* Filters */}
                <div className="flex flex-wrap items-stretch gap-4 mb-6">
                    <div className="max-w-75">
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
                        />
                    </div>
                    <div>
                        <select
                            value={statusInput}
                            onChange={(e) => setStatusInput(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
                        >
                            <option value="all">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-4 py-1 bg-brandColor text-white hover:bg-brandColor/80 rounded-lg cursor-pointer"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer"
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
                                <th>Postal Code</th>
                                <th>Place</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {babysitters?.map((s, i) => (
                                <tr key={s._id} className="border-b last:border-none">
                                    <td className="py-2">#{i + 1}</td>
                                    <td className="py-2">
                                        <img
                                            loading="lazy"
                                            src={getImageUrl(s.profilePhoto) ?? "/default-avatar.png"}
                                            alt={s.fullName}
                                            className="w-12 h-12 object-cover rounded-full"
                                        />
                                    </td>
                                    <td>{s.fullName}</td>
                                    <td>{s.email}</td>
                                    <td>{s.zipCode}</td>
                                    <td>{s.location}</td>
                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${s.isApproved
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {s.isApproved ? "Approved" : "Rejected"}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        <button
                                            onClick={() => handleInfoClick(s)}
                                            className="px-2 py-1 bg-slate-300 hover:bg-slate-400 duration-200 rounded cursor-pointer"
                                        >
                                            Info
                                        </button>
                                        <Link
                                            href={`/babysitters/${s._id}`}
                                        >
                                            <button className=" duration-200 rounded cursor-pointer text-black p-1 hover:bg-gray-300">
                                                <SquareArrowOutUpRight size={20} />
                                            </button>
                                        </Link>
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

            {/* Babysitter Details Modal */}
            {showModal && selectedSitter && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Babysitter Details</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer">
                                <X />
                            </button>
                        </div>

                        {/* Profile Header */}
                        <div className="flex justify-between gap-6 my-6">
                            <img
                                loading="lazy"
                                src={getImageUrl(selectedSitter.profilePhoto) ?? "/default-avatar.png"}
                                alt={selectedSitter.fullName}
                                className="w-32 h-32 object-cover rounded-full border-4 border-brandColor"
                            />
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold">{selectedSitter.fullName}</h4>
                                <p className="text-gray-500">{selectedSitter.role}</p>
                                <div className="mt-2 flex items-center gap-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${selectedSitter.isApproved
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {selectedSitter.isApproved ? "Approved" : "Rejected"}
                                    </span>
                                    <span className="capitalize px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                        {selectedSitter.subscription || "free"}
                                    </span>
                                </div>
                            </div>

                            {/* Approval Status Control */}
                            <div className="bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-700 mb-3 text-end">Approval Status</h4>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setApprovalAction("approve");
                                            handleStatusSubmit();
                                        }}
                                        disabled={selectedSitter.isApproved || isSubmitting}
                                        className={`px-4 py-2 rounded text-white font-medium cursor-pointer ${selectedSitter.isApproved
                                            ? "bg-gray-300 cursor-none-allowed pointer-events-none"
                                            : "bg-green-500 hover:bg-green-600"
                                            }`}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            setApprovalAction("reject");
                                            handleStatusSubmit();
                                        }}
                                        disabled={!selectedSitter.isApproved || isSubmitting}
                                        className={`px-4 py-2 rounded text-white font-medium cursor-pointer ${!selectedSitter.isApproved
                                            ? "bg-gray-300 cursor-none-allowed pointer-events-none"
                                            : "bg-red-500 hover:bg-red-600"
                                            }`}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <h4 className="col-span-2 font-semibold text-gray-700 mb-2">Contact Information</h4>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium text-gray-600">Email:</span>
                                <span>{selectedSitter.email}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium text-gray-600">Phone:</span>
                                <span>{selectedSitter.phoneNumber}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium text-gray-600">Age:</span>
                                <span>{selectedSitter.age} years</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium text-gray-600">Gender:</span>
                                <span>{selectedSitter.gender}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium text-gray-600">Location:</span>
                                <span>{selectedSitter.location}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium text-gray-600">Post Code:</span>
                                <span>{selectedSitter.zipCode}</span>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <h4 className="col-span-2 font-semibold text-gray-700 mb-2">Professional Details</h4>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium text-gray-600">Hourly Rate:</span>
                                <span>${selectedSitter.hourlyRate || "Not set"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium text-gray-600">Years of Experience:</span>
                                <span>{selectedSitter.yearsOfExperience || "Not specified"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b col-span-2">
                                <span className="font-medium text-gray-600">Preferred Location:</span>
                                <span>{selectedSitter.preferredBabysittingLocation || "Not specified"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b col-span-2">
                                <span className="font-medium text-gray-600">Languages:</span>
                                <span>{selectedSitter.languages?.join(", ") || "Not specified"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b col-span-2">
                                <span className="font-medium text-gray-600">Skills:</span>
                                <span>{selectedSitter.skills?.join(", ") || "Not specified"}</span>
                            </div>
                        </div>

                        {/* Availability */}
                        {selectedSitter.availability && selectedSitter.availability.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-2">Availability</h4>
                                <div className="space-y-2">
                                    {selectedSitter.availability.map((slot, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b">
                                            <span className="font-medium text-gray-600">{slot.day}:</span>
                                            <span>
                                                {slot.timeSlots?.morning && "Morning "}
                                                {slot.timeSlots?.afternoon && "Afternoon "}
                                                {slot.timeSlots?.evening && "Evening "}
                                                {slot.timeSlots?.night && "Night"}
                                                {!slot.timeSlots?.morning && !slot.timeSlots?.afternoon && !slot.timeSlots?.evening && !slot.timeSlots?.night && "Not available"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-2">Additional Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Education Level:</span>
                                    <span>{selectedSitter.educationLevel || "Not provided"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Education Details:</span>
                                    <span>{selectedSitter.educationDetails || "Not provided"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Certifications:</span>
                                    <span>{selectedSitter.certifications?.join(", ") || "None"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Driver License:</span>
                                    <span>{selectedSitter.driverLicense ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Has Car:</span>
                                    <span>{selectedSitter.hasCar ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Has Children:</span>
                                    <span>{selectedSitter.hasChildren ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Is Smoker:</span>
                                    <span>{selectedSitter.isSmoker ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Gov ID Verified:</span>
                                    <span>{selectedSitter.governmentIdVerified ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Email Verified:</span>
                                    <span>{selectedSitter.emailVerified ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Google Verified:</span>
                                    <span>{selectedSitter.googleAccountVerified ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium text-gray-600">Description:</span>
                                    <span className="text-right max-w-xs">{selectedSitter.description || "Not provided"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Account Dates */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium text-gray-600">Member Since:</span>
                                <span>{new Date(selectedSitter.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium text-gray-600">Last Activity:</span>
                                <span>{selectedSitter.lastActivity ? new Date(selectedSitter.lastActivity).toLocaleDateString() : "Never"}</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllBabySitters