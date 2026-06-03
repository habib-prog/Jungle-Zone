"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, X, Save, Trash2 } from "lucide-react";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "both",
    description: "",
    price: "",
    duration: "",
    durationUnit: "months",
    features: "",
    isActive: true,
    isPopular: false,
    isDiscounted: false,
    discountPercentage: 0
  });
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscriptionHandle");
      const data = await res.json();
      if (res.ok) {
        setPlans(Array.isArray(data) ? data : []);
      } else {
        setApiError(data.error || "Failed to fetch plans");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch plans");
      setApiError("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name || "",
        category: plan.category || "both",
        description: plan.description || "",
        price: plan.price?.toString() || "",
        duration: plan.duration?.toString() || "",
        durationUnit: plan.durationUnit || "months",
        features: Array.isArray(plan.features) ? plan.features.join("\n") : "",
        isActive: plan.isActive ?? true,
        isPopular: plan.isPopular ?? false,
        isDiscounted: plan.isDiscounted ?? false,
        discountPercentage: plan.discountPercentage || 0
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        category: "both",
        description: "",
        price: "",
        duration: "",
        durationUnit: "months",
        features: "",
        isActive: true,
        isPopular: false,
        isDiscounted: false,
        discountPercentage: 0
      });
    }
    setErrors({});
    setApiError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setErrors({});
    setApiError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.category || !["parent", "babysitter", "both"].includes(formData.category)) {
      newErrors.category = "Invalid category";
    }
    
    if (formData.price === "" || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Valid price is required (0 for free)";
    }
    
    if (!formData.duration || isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      newErrors.duration = "Valid duration is required";
    }
    
    if (formData.durationUnit && !["free", "months", "years"].includes(formData.durationUnit)) {
      newErrors.durationUnit = "Invalid duration unit";
    }
    
    if (formData.isDiscounted && (!formData.discountPercentage || isNaN(Number(formData.discountPercentage)) || Number(formData.discountPercentage) < 0 || Number(formData.discountPercentage) > 100)) {
      newErrors.discountPercentage = "Discount must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitLoading(true);
    setApiError("");

    const payload = {
      ...formData,
      price: Number(formData.price),
      duration: Number(formData.duration),
      discountPercentage: Number(formData.discountPercentage),
      features: formData.features
        .split("\n")
        .map(f => f.trim())
        .filter(f => f !== "")
    };

    // Add ID for updates
    if (editingPlan) {
      payload.id = editingPlan._id;
    }

    try {
      const url = editingPlan ? "/api/admin/subscriptionHandle" : "/api/admin/subscriptionHandle";
      const method = editingPlan ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(editingPlan ? "Plan updated successfully" : "Plan created successfully");
        fetchPlans();
        handleCloseModal();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setApiError(data.error || "Failed to save plan");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save plan");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      parent: "bg-blue-100 text-blue-700",
      babysitter: "bg-purple-100 text-purple-700",
      both: "bg-green-100 text-green-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-8 h-8 border-4 border-brandColor border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-end">
        <button
          onClick={() => handleOpenModal(null)}
          className="flex items-center gap-2 bg-brandColor hover:bg-brandColor/80 text-white px-4 py-2 rounded-lg cursor-pointer transition"
        >
          <Plus size={18} />
          Add Plan
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {apiError}
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-left font-semibold">Price</th>
              <th className="px-4 py-3 text-left font-semibold">Duration</th>
              <th className="px-4 py-3 text-left font-semibold">Discount</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  No subscription plans found. Create your first plan!
                </td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      {plan.description && (
                        <p className="text-xs text-gray-500 line-clamp-1">{plan.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(plan.category)}`}>
                      {plan.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-brandColor">
                      ${plan.price?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {plan.duration} {plan.durationUnit}
                  </td>
                  <td className="px-4 py-3">
                    {plan.isDiscounted && plan.discountPercentage > 0 ? (
                      <span className="text-orange-600 font-medium">
                        {plan.discountPercentage}% off
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {plan.isActive ? (
                        <span className="text-xs text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">Inactive</span>
                      )}
                      {plan.isPopular && (
                        <span className="text-xs bg-brandColor/10 text-brandColor px-2 py-0.5 rounded-full w-fit">
                          Popular
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(plan)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingPlan ? "Edit Plan" : "Create New Plan"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 cursor-pointer p-1"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor ${errors.name ? "border-red-500" : ""}`}
                  placeholder="e.g., Basic Monthly"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
                >
                  <option value="parent">Parent</option>
                  <option value="babysitter">Babysitter</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor resize-none"
                  placeholder="Brief description of the plan"
                />
              </div>

              {/* Price and Duration Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (৳) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor ${errors.price ? "border-red-500" : ""}`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor ${errors.duration ? "border-red-500" : ""}`}
                    placeholder="1"
                  />
                  {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                </div>
              </div>

              {/* Duration Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration Unit
                </label>
                <select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
                >
                  <option value="free">Free</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor resize-none"
                  placeholder="Unlimited messages&#10;Priority support&#10;Advanced analytics"
                />
              </div>

              {/* Discount Section */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isDiscounted"
                    id="isDiscounted"
                    checked={formData.isDiscounted}
                    onChange={handleChange}
                    className="w-4 h-4 text-brandColor rounded focus:ring-brandColor"
                  />
                  <label htmlFor="isDiscounted" className="text-sm font-medium text-gray-700">
                    Enable Discount
                  </label>
                </div>

                {formData.isDiscounted && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor ${errors.discountPercentage ? "border-red-500" : ""}`}
                    />
                    {errors.discountPercentage && (
                      <p className="text-red-500 text-xs mt-1">{errors.discountPercentage}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-brandColor rounded focus:ring-brandColor"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPopular"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={handleChange}
                    className="w-4 h-4 text-brandColor rounded focus:ring-brandColor"
                  />
                  <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">
                    Mark as Popular
                  </label>
                </div>
              </div>

              {/* API Error in Modal */}
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {apiError}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center gap-2 bg-brandColor hover:bg-brandColor/80 text-white px-4 py-2 rounded-lg cursor-pointer transition disabled:opacity-50"
                >
                  {submitLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  {editingPlan ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
