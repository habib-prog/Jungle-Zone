"use client";

import { useState } from "react";
import { toast } from "sonner";

const AddAdmin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/addAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add admin");
      toast.success(data.message || "Admin added successfully");
      setEmail("");
    } catch (error) {
      toast.error(error.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border max-w-md">
      <h2 className="font-semibold mb-2">Add New Admin</h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter the email of an existing user (or a new email) to grant admin
        access.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-brandColor text-white hover:bg-brandColor/80 rounded-lg cursor-pointer disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Admin"}
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;
