"use client";

import React, { useEffect, useState } from "react";
import {
  FiPhone,
  FiMail,
  FiUser,
  FiMessageSquare,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
} from "react-icons/fi";
import { Pagination } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";

const ContactInfo = () => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [actionId, setActionId] = useState("");

  /// PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalContacts, setTotalContacts] = useState(0);

  /// FETCH CONTACT DATA
  const fetchContacts = async (page = currentPage, limit = pageSize) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/contact?page=${page}&limit=${limit}`, {
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch contacts");
      }

      setContacts(result.data || []);
      setTotalContacts(result.pagination?.total || 0);
      setCurrentPage(result.pagination?.page || page);
      setPageSize(result.pagination?.limit || limit);
    } catch (error) {
      toast.error(error.message || "Failed to fetch contacts");
      setContacts([]);
      setTotalContacts(0);
    } finally {
      setLoading(false);
    }
  };

  /// FIRST LOAD
  useEffect(() => {
    fetchContacts(currentPage, pageSize);
  }, []);

  /// HANDLE PAGINATION CHANGE
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    fetchContacts(page, size);
  };

  /// HANDLE RELOAD
  const handleReload = () => {
    fetchContacts(currentPage, pageSize);
  };

  /// HANDLE DELETE
  const handleDelete = async (id) => {
    try {
      setActionId(id);

      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete contact");
      }

      toast.success("Contact deleted successfully");

      /// IF LAST ITEM OF PAGE DELETED, GO PREVIOUS PAGE
      const updatedTotal = totalContacts - 1;
      const updatedTotalPages = Math.ceil(updatedTotal / pageSize);
      const nextPage =
        contacts.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage > updatedTotalPages && updatedTotalPages > 0
          ? updatedTotalPages
          : currentPage;

      fetchContacts(nextPage, pageSize);
    } catch (error) {
      toast.error(error.message || "Failed to delete contact");
    } finally {
      setActionId("");
    }
  };

  /// HANDLE MARK AS READ
  const handleMarkRead = async (id, currentStatus) => {
    try {
      setActionId(id);

      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          isRead: !currentStatus,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update read status");
      }

      toast.success(
        !currentStatus
          ? "Message marked as read"
          : "Message marked as unread"
      );

      setContacts((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: !currentStatus } : item
        )
      );
    } catch (error) {
      toast.error(error.message || "Failed to update read status");
    } finally {
      setActionId("");
    }
  };

  return (
    <>
      <section className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Contact Messages
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Review and manage user messages
              </p>
            </div>

            <button
              onClick={handleReload}
              disabled={loading}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Reload
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="min-w-[320px] px-6 py-4">Message</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {contacts.length > 0 ? (
                  contacts.map((item) => (
                    <tr
                      key={item._id}
                      className={`transition hover:bg-gray-50 ${
                        item.isRead ? "bg-white" : "bg-cyan-50/40"
                      }`}
                    >
                      {/* NAME */}
                      <td className="px-6 py-5 font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-gray-300" />
                          {item.name}
                        </div>
                      </td>

                      {/* PHONE */}
                      <td className="px-6 py-5 text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiPhone className="text-gray-300" />
                          {item.phone}
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="break-all px-6 py-5 text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiMail className="text-gray-300" />
                          {item.email}
                        </div>
                      </td>

                      {/* MESSAGE */}
                      <td className="px-6 py-5 text-gray-500">
                        <div className="flex items-start gap-2">
                          <FiMessageSquare className="mt-1 shrink-0 text-gray-300" />
                          <p className="whitespace-normal leading-6">
                            {item.comment}
                          </p>
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            onClick={() =>
                              handleMarkRead(item._id, item.isRead)
                            }
                            disabled={actionId === item._id}
                            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs transition disabled:cursor-not-allowed disabled:opacity-70 ${
                              item.isRead
                                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                            }`}
                          >
                            <FiCheckCircle />
                            {actionId === item._id
                              ? "Updating..."
                              : item.isRead
                              ? "Read"
                              : "Mark Read"}
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={actionId === item._id}
                            className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <FiTrash2 />
                            {actionId === item._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-sm text-gray-400"
                    >
                      {loading
                        ? "Loading contacts..."
                        : "No contact messages found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-400">
              {totalContacts > 0
                ? `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(
                    currentPage * pageSize,
                    totalContacts
                  )} of ${totalContacts} messages`
                : "No messages found"}
            </p>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalContacts}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["5", "10", "20", "50"]}
              onShowSizeChange={handlePageChange}
              responsive
            />
          </div>
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ContactInfo;