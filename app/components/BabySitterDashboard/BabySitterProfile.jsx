"use client";
import { useState, useEffect, useRef } from "react";
import { FiEdit2, FiSave, FiX, FiUser, FiPhone, FiMapPin, FiHash, FiCamera, FiDollarSign, FiClock, FiAward, FiBook, FiGlobe, FiBriefcase, FiTag, FiCalendar, FiCheck, FiPlus, FiTrash2 } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { getImageUrl } from "@/app/lib/imageUtils";

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

const ArrayField = ({ icon: Icon, label, name, value, onChange, editing }) => {
  if (name === "availability") {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-500 font-poppins uppercase tracking-wide">
          {label}
        </label>
        {editing ? (
          <div className="space-y-3">
            {value?.map((item, idx) => (
              <div key={idx} className="p-3 border border-brandColor/30 rounded-md bg-brandColor/5">
                <div className="flex items-center justify-between mb-2">
                  <select
                    value={item.day}
                    onChange={(e) => {
                      const newArray = [...value];
                      newArray[idx] = { ...newArray[idx], day: e.target.value };
                      onChange(name, newArray);
                    }}
                    className="px-3 py-1.5 rounded-md border border-brandColor text-gray-800 font-poppins text-sm focus:outline-none focus:ring-1 focus:ring-brandColor"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const newArray = value.filter((_, i) => i !== idx);
                      onChange(name, newArray);
                    }}
                    className="p-1.5 rounded-md border border-red-300 text-red-500 hover:bg-red-50 transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: "morning", label: "Morning" },
                    { key: "afternoon", label: "Afternoon" },
                    { key: "evening", label: "Evening" },
                    { key: "night", label: "Night" },
                  ].map((slot) => (
                    <label key={slot.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.timeSlots?.[slot.key] || false}
                        onChange={(e) => {
                          const newArray = [...value];
                          newArray[idx] = {
                            ...newArray[idx],
                            timeSlots: {
                              ...newArray[idx].timeSlots,
                              [slot.key]: e.target.checked,
                            },
                          };
                          onChange(name, newArray);
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-brandColor focus:ring-brandColor"
                      />
                      <span className="text-sm text-gray-700 font-poppins">{slot.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItem = {
                  day: "Monday",
                  timeSlots: { morning: false, afternoon: false, evening: false, night: false },
                };
                onChange(name, [...(value || []), newItem]);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-brandColor border border-brandColor rounded-md hover:bg-brandColor/5 transition self-start"
            >
              <FiPlus className="w-4 h-4" /> Add Day Availability
            </button>
          </div>
        ) : (
          <div className="px-4 py-3 rounded-md border border-gray-200 bg-gray-50">
            {value?.length > 0 ? (
              <div className="space-y-2">
                {value.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-medium text-gray-800">{item.day}:</span>
                    <span className="text-gray-600 ml-2">
                      {Object.entries(item.timeSlots || {})
                        .filter(([, v]) => v)
                        .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                        .join(", ") || "Not available"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No availability set</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 font-poppins uppercase tracking-wide">
        {label}
      </label>
      {editing ? (
        <div className="space-y-2">
          {value?.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newArray = [...value];
                  newArray[idx] = e.target.value;
                  onChange(name, newArray);
                }}
                className="flex-1 px-4 py-2.5 rounded-md border border-brandColor ring-1 ring-brandColor/20 text-gray-800 font-poppins text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const newArray = value.filter((_, i) => i !== idx);
                  onChange(name, newArray);
                }}
                className="p-2.5 rounded-md border border-red-300 text-red-500 hover:bg-red-50 transition"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange(name, [...(value || []), ""])}
            className="flex items-center gap-2 px-3 py-2 text-sm text-brandColor border border-brandColor rounded-md hover:bg-brandColor/5 transition"
          >
            <FiPlus className="w-4 h-4" /> Add {label.slice(0, -1)}
          </button>
        </div>
      ) : (
        <div className="px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {value?.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 font-poppins">
                <FiCheck className="w-3 h-3 text-brandColor" />
                {item}
              </span>
            )) || <span className="text-sm text-gray-400">None specified</span>}
          </div>
        </div>
      )}
    </div>
  );
};

const BabySitterProfile = () => {
  const { refreshUser } = useAuth();
  const [sitter, setSitter] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    age: "",
    location: "",
    zipCode: "",
    description: "",
    certifications: [],
    educationLevel: "",
    languages: [],
    yearsOfExperience: "",
    hourlyRate: "",
    comfortableWithAgeGroup: [],
    skills: [],
    availability: [],
  });

  useEffect(() => {
    fetch("/api/babysitters/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.sitter) {
          setSitter(data.sitter);
          setForm({
            fullName: data.sitter.fullName || "",
            phoneNumber: data.sitter.phoneNumber || "",
            age: data.sitter.age?.toString() || "",
            location: data.sitter.location || "",
            zipCode: data.sitter.zipCode || "",
            description: data.sitter.description || "",
            certifications: data.sitter.certifications || [],
            educationLevel: data.sitter.educationLevel || "",
            languages: data.sitter.languages || [],
            yearsOfExperience: data.sitter.yearsOfExperience?.toString() || "",
            hourlyRate: data.sitter.hourlyRate?.toString() || "",
            comfortableWithAgeGroup: data.sitter.comfortableWithAgeGroup || [],
            skills: data.sitter.skills || [],
            availability: data.sitter.availability || [],
          });
        }
      })
      .catch(() => {
        setError("Failed to load profile");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, newValue) => {
    setForm(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : undefined,
        yearsOfExperience: form.yearsOfExperience ? parseInt(form.yearsOfExperience) : undefined,
        hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : undefined,
      };

      const res = await fetch("/api/babysitters/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setSitter(data.account);
        await refreshUser();
        setEditing(false);
        toast.success(data.message);
        setTimeout(() => setError(""), 3000);
      } else {
        setError(data.message || "Update failed");
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      setError(err.message || "Update failed");
      toast.error(err.message || "Update failed");
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
      const res = await fetch("/api/babysitters/picture", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setSitter((prev) => ({ ...prev, profilePhoto: data.picture }));
        await refreshUser();
        toast.success("Profile picture updated");
      } else {
        setError(data.message || "Upload failed");
        toast.error(data.message || "Upload failed");
      }
    } catch {
      setError("Upload failed");
      toast.error("Upload failed");
    } finally {
      setPicLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!sitter) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-brandColor border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const avatarSrc = getImageUrl(sitter?.profilePhoto) ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(form.fullName || "S")}&background=random`;

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold font-poppins text-gray-800">My Profile</h1>
            <p className="text-sm text-gray-500 font-poppins">Manage your personal information</p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={() => { setEditing(false); setError(""); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-600 text-sm font-poppins hover:bg-gray-100 transition cursor-pointer">
                  <FiX className="w-4 h-4" /> Cancel
                </button>
                <button onClick={handleSave} disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-brandColor text-white text-sm font-poppins hover:opacity-90 transition cursor-pointer hover:bg-brandColor/80 disabled:opacity-50 disabled:cursor-not-allowed">
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
                loading="lazy"
                src={avatarSrc}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button onClick={() => fileInputRef.current?.click()} disabled={picLoading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-brandColor rounded-full flex items-center justify-center shadow border-2 border-white hover:opacity-90 transition cursor-pointer hover:bg-brandColor/80 disabled:opacity-50">
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
            <p className="text-sm text-gray-500 font-poppins">{sitter?.email || "No email"}</p>
            <span className="inline-block mt-1 text-xs bg-brandColor/10 text-brandColor font-poppins px-2 py-0.5 rounded-full">
              Babysitter
            </span>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field icon={FiUser} label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} editing={editing} />
            <Field icon={FiPhone} label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} editing={editing} type="tel" />
            <Field icon={FiHash} label="Age" name="age" value={form.age} onChange={handleChange} editing={editing} type="number" />
            <Field icon={FiMapPin} label="Location" name="location" value={form.location} onChange={handleChange} editing={editing} />
            <Field icon={FiHash} label="Post Code" name="zipCode" value={form.zipCode} onChange={handleChange} editing={editing} />
            <Field icon={FiBriefcase} label="Years of Experience" name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange} editing={editing} type="number" />
            <Field icon={FiDollarSign} label="Hourly Rate ($)" name="hourlyRate" value={form.hourlyRate} onChange={handleChange} editing={editing} type="number" step="0.01" />
            <Field icon={FiBook} label="Education Level" name="educationLevel" value={form.educationLevel} onChange={handleChange} editing={editing} />
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">About Me</h3>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={!editing}
            rows={4}
            placeholder="Tell parents about yourself..."
            className={`w-full px-4 py-2.5 rounded-md border font-poppins text-sm transition-all resize-none
              ${!editing
                ? "bg-gray-50 border-gray-200 text-gray-600 cursor-default"
                : "bg-white border-brandColor ring-1 ring-brandColor/20 text-gray-800 focus:outline-none"
              }`}
          />
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">Certifications</h3>
          <ArrayField icon={FiAward} label="Certifications" name="certifications" value={form.certifications} onChange={handleArrayChange} editing={editing} />
        </div>

        {/* Languages */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">Languages</h3>
          <ArrayField icon={FiGlobe} label="Languages" name="languages" value={form.languages} onChange={handleArrayChange} editing={editing} />
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">Skills</h3>
          <ArrayField icon={FiTag} label="Skills" name="skills" value={form.skills} onChange={handleArrayChange} editing={editing} />
        </div>

        {/* Comfortable Age Groups */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">Comfortable With Age Groups</h3>
          <ArrayField icon={FiCheck} label="Age Groups" name="comfortableWithAgeGroup" value={form.comfortableWithAgeGroup} onChange={handleArrayChange} editing={editing} />
        </div>

        {/* Availability */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold font-poppins text-gray-700 mb-4 uppercase tracking-wide">Availability</h3>
          <ArrayField icon={FiCalendar} label="Availability" name="availability" value={form.availability} onChange={handleArrayChange} editing={editing} />
        </div>
      </div>
    </>
  );
};

export default BabySitterProfile;
