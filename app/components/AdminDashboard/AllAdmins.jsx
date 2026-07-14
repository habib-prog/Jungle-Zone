"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/admins", { cache: "no-store" });
        const data = await res.json();
        setAdmins(data.admins || []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch admins");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleRemove = async (id) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;
    try {
      const res = await fetch(`/api/admin/admins?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove admin");
      setAdmins((prev) => prev.filter((a) => a._id !== id));
      toast.success(data.message || "Admin removed successfully");
    } catch (error) {
      toast.error(error.message || "Failed to remove admin");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="font-semibold mb-4">All Admins</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : admins.length === 0 ? (
        <p className="text-gray-500">No admins found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="border-b text-left">
            <tr>
              <th className="py-2">ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a, i) => (
              <tr key={a._id} className="border-b last:border-none">
                <td className="py-2">#{i + 1}</td>
                <td>{a.fullName || "—"}</td>
                <td>{a.email}</td>
                <td>
                  {a.isSuperAdmin ? (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                      Super Admin
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      Admin
                    </span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleRemove(a._id)}
                    disabled={a.isSuperAdmin}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllAdmins;
