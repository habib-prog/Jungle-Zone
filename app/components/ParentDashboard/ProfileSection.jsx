"use client";
import { useState, useEffect, useRef } from "react";
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiHash, FiCamera } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { getImageUrl } from "@/app/lib/imageUtils";

// ✅ Outside the component — never recreated on re-render
const Field = ({ icon: Icon, label, name, value, onChange, editing, disabled = false, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-500 font-poppins uppercase tracking-wide">
      {label}
    </label>
    <div className="relative flex items-center">
      <Icon className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!editing || disabled}
        className={`w-full pl-9 pr-4 py-2.5 rounded-md border font-poppins text-sm transition-all
          ${!editing || disabled
            ? "bg-gray-50 border-gray-200 text-gray-600 cursor-default"
            : "bg-white border-brandColor ring-1 ring-brandColor/20 text-gray-800 focus:outline-none"
          }`}
      />
    </div>
  </div>
);

const ProfileSection = () => {
  const { refreshUser } = useAuth();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    postCode: "", houseNo: "", road: "",
    state: "", nationalId: "", moreInfo: "",
  });
  const fileInputRef = useRef(null);
  useEffect(() => {
    fetch("/api/parent/profile")
    .then((r) => r.json())
    .then((data) => {
        console.log(data)
        setUser(data.parent);
        setForm({
          fullName: data.parent.fullName || "",
          email: data.parent.email || "",
          phone: data.parent.phone || "",
          postCode: data.parent.postCode || "",
          houseNo: data.parent.houseNo || "",
          road: data.parent.road || "",
          state: data.parent.state || "",
          nationalId: data.parent.nationalId || "",
          moreInfo: data.parent.moreInfo || "",
        });
      });
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/parent/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.account);
        await refreshUser();
        setSuccess(true);
        setEditing(false);
        toast.success(data.message)
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      toast.error(err.message || "Update Failed")
    } finally {
      setLoading(false);
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("picture", file);
    setPicLoading(true);
    try {
      const res = await fetch("/api/parent/picture", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => ({ ...prev, picture: data.picture }));
        await refreshUser();
      }
      else setError(data.message || "Upload failed");
    } catch {
      setError("Upload failed");
    } finally {
      setPicLoading(false);
    }
  };

  const avatarUrl = getImageUrl(user?.picture) ?? `https://ui-avatars.com/api/?name=${form.fullName}&background=random`;

  if (!user) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-brandColor border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold font-poppins text-gray-800">My Profile</h1>
            <p className="text-sm text-gray-500 font-poppins">Manage your personal information</p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-600 text-sm font-poppins hover:bg-gray-300 transition cursor-pointer">
                  <FiX className="w-4 h-4" /> Cancel
                </button>
                <button onClick={handleSave} disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-brandColor text-white text-sm font-poppins hover:opacity-90 transition cursor-pointer hover:bg-brandColor/80">
                  <FiSave className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-brandColor text-white text-sm font-poppins hover:opacity-90 transition cursor-pointer hover:bg-brandColor/80">
                <FiEdit2 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-poppins px-4 py-3 rounded-md">
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-poppins px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Avatar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-brandColor bg-gray-100">
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button onClick={() => fileInputRef.current?.click()} disabled={picLoading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-brandColor rounded-full flex items-center justify-center shadow border-2 border-white hover:opacity-90 transition cursor-pointer hover:bg-brandColor/80">
              {picLoading
                ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <FiCamera className="w-3.5 h-3.5 text-white" />
              }
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
              className="hidden" onChange={handlePictureChange} />
          </div>
          <div>
            <h2 className="text-xl font-semibold font-poppins text-gray-800">{form.fullName || "Your Name"}</h2>
            <p className="text-sm text-gray-500 font-poppins">{form.email}</p>
            <span className="inline-block mt-1 text-xs bg-brandColor/10 text-brandColor font-poppins px-2 py-0.5 rounded-full capitalize">
              {user.provider || "credentials"} account
            </span>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field icon={FiUser} label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} editing={editing} />
            <Field icon={FiMail} label="Email" name="email" value={form.email} onChange={handleChange} editing={editing} disabled />
            <Field icon={FiPhone} label="Phone Number" name="phone" value={form.phone} onChange={handleChange} editing={editing} type="tel" />
            <Field icon={FiHash} label="National ID" name="nationalId" value={form.nationalId} onChange={handleChange} editing={editing} />
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field icon={FiMapPin} label="House / Apt No." name="houseNo" value={form.houseNo} onChange={handleChange} editing={editing} />
            <Field icon={FiMapPin} label="Road / Street" name="road" value={form.road} onChange={handleChange} editing={editing} />
            <Field icon={FiMapPin} label="State / City" name="state" value={form.state} onChange={handleChange} editing={editing} />
            <Field icon={FiMapPin} label="Post Code" name="postCode" value={form.postCode} onChange={handleChange} editing={editing} />
          </div>
        </div>

        {/* More Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">Additional Info</h3>
          <textarea
            name="moreInfo"
            value={form.moreInfo}
            onChange={handleChange}
            disabled={!editing}
            rows={3}
            placeholder="Any additional info for sitters..."
            className={`w-full px-4 py-2.5 rounded-md border font-poppins text-sm transition-all resize-none
              ${!editing
                ? "bg-gray-50 border-gray-200 text-gray-600 cursor-default"
                : "bg-white border-brandColor ring-1 ring-brandColor/20 text-gray-800 focus:outline-none"
              }`}
          />
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">Account Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Deals", value: user.totalDeals ?? 0 },
              { label: "Total Spent", value: `$${user.totalSpent ?? 0}` },
              { label: "Wallet Balance", value: `$${user.wallet ?? 0}` },
            ].map((s) => (
              <div key={s.label} className="rounded-md bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs text-gray-500 font-poppins">{s.label}</p>
                <p className="text-xl font-semibold font-poppins text-gray-800 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;