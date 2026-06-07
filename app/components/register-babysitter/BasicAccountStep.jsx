"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Upload } from "antd";
import { FiArrowRight, FiImage } from "react-icons/fi";
import gsap from "gsap";

const BasicAccountStep = ({ onNext, onBack, formData, updateFormData }) => {
  const sectionRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const isValid =
    formData.fullName &&
    formData.email &&
    formData.phoneNumber &&
    formData.password &&
    formData.profilePhoto;
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".step-fade", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".mascot-bounce", {
        scale: 0.9,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.7)",
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleImageUpload = ({ file }) => {
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);
      updateFormData({ profilePhoto: file });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6 sm:py-6"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
        {/* ========== content area ========== */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-8 sm:py-10">
            {/* ========== mascot + question ========== */}
            <div className="step-fade mb-10 flex flex-col items-center justify-center gap-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-6">
              <div className="mascot-bounce flex h-32 w-24 items-center justify-center rounded-full bg-teal-100 text-teal-600 sm:h-36 sm:w-28">
                <span className="text-5xl">🧸</span>
              </div>

              <div className="mascot-bounce rounded-full bg-cyan-50 px-8 py-6 text-center shadow-sm sm:px-10 sm:py-8">
                <h3 className="text-xl font-medium text-gray-800 sm:text-2xl">
                  What's your basic info?
                </h3>
              </div>
            </div>

            {/* ========== form ========== */}
            <div className="space-y-7">
              {/* ========== full name ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => updateFormData({ fullName: e.target.value })}
                  className="h-14 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>

              {/* ========== email address ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  className="h-14 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>

              {/* ========== phone number ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    updateFormData({ phoneNumber: e.target.value })
                  }
                  className="h-14 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>

              {/* ========== password ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create your password"
                  value={formData.password}
                  onChange={(e) => updateFormData({ password: e.target.value })}
                  className="h-14 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>

              {/* ========== profile photo ========== */}
              <div className="step-fade">
                <label className="mb-3 block text-lg font-semibold text-gray-400">
                  Profile photo
                </label>

                <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Profile Preview"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                        <FiImage className="text-2xl" />
                      </div>
                    )}

                    <div>
                      <h4 className="text-base font-semibold text-gray-800">
                        Upload your photo
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Use a clear profile image
                      </p>
                    </div>
                  </div>

                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleImageUpload}
                  >
                    <Button
                      size="large"
                      className="flex h-11 items-center gap-2 rounded-full"
                    >
                      <FiImage />
                      Choose photo
                    </Button>
                  </Upload>
                </div>
              </div>

              {/* ========== helper text ========== */}
              <div className="step-fade">
                <p className="text-sm text-gray-500 sm:text-base">
                  Make sure your information is correct before continuing.
                </p>
              </div>
            </div>
          </div>

          {/* ========== bottom action bar ========== */}
          <div className="step-fade sticky bottom-0 mt-8 bg-white px-4 py-4 sm:px-6">
            <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
              {/* ========== back button ========== */}
              <button
                onClick={onBack}
                disabled
                className="cursor-not-allowed text-lg font-medium text-gray-400"
              >
                Back
              </button>

              {/* ========== next button ========== */}
              <button
                onClick={onNext}
                disabled={!isValid}
                className="flex items-center gap-2 rounded py-2 px-6 hover:bg-brandColor hover:text-white duration-200 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              >
                Next
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicAccountStep;
