"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FiUser, FiPhone, FiMessageSquare, FiSend } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });

  const [errors, setErrors] = useState({});

  /// VALIDATE FORM
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters";
    }

    return newErrors;
  };

  /// HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /// HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setloading(false);

        toast.error(data.message || "Failed to send message");
        return;
      }
      /// SUCCESS
      setloading(false);
      toast.success("Message sent successfully ");

      setFormData({
        name: "",
        phone: "",
        email: "",
        comment: "",
      });
      setErrors({});
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <section className="min-h-screen bg-brandColor/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium text-brandColor">Contact Us</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-800 sm:text-4xl">
              Get in touch with us
            </h1>
            <p className="mt-3 text-sm text-gray-500 sm:text-base">
              Fill out the form below and we will get back to you as soon as
              possible.
            </p>
            {/* Response time & support info */}
            <div className="mt-6 inline-flex items-center gap-6 rounded-full bg-brandColor/10 px-6 py-3">
              <div className="flex items-center gap-2">
                <FiSend className="text-brandColor" />
                <span className="font-poppins text-sm font-medium text-brandColor">
                  We reply within 24 hours
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <Link
                href="mailto:support@junglezone.uk"
                className="font-poppins text-sm font-medium text-brandColor hover:underline"
              >
                support@junglezone.uk
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Name
                </label>
                <div
                  className={`flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3 ${errors.name
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-cyan-500"
                    }`}
                >
                  <FiUser className="text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <div
                  className={`flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3 ${errors.phone
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-cyan-500"
                    }`}
                >
                  <FiPhone className="text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div
                  className={`flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3 ${errors.email
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-cyan-500"
                    }`}
                >
                  <MdEmail className="text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* COMMENT */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Comment
                </label>
                <div
                  className={`rounded-2xl border bg-gray-50 px-4 py-3 ${errors.comment
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-cyan-500"
                    }`}
                >
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Write your comment here..."
                    className="w-full resize-none bg-transparent text-sm outline-none"
                  />
                </div>
                {errors.comment && (
                  <p className="mt-2 text-sm text-red-500">{errors.comment}</p>
                )}
              </div>

              {loading ? (
                // {/* Loading BUTTON */}
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-700 px-6 py-3 text-sm font-medium text-white cursor-not-allowed"
                >
                  <span className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></span>
                </button>
              ) : (
                // {/* Submit BUTTON */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brandColor px-6 py-3 text-sm font-medium text-white hover:bg-brandColor/80 cursor-pointer duration-200"
                >
                  <FiSend />
                  Send Message
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* TOAST */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default page;
