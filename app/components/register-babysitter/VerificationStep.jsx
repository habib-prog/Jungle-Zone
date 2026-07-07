"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import gsap from "gsap";
import { verificationDocuments } from "../api/fakeApi";

const BabysitterVerification = ({ onNext, onBack, formData, updateFormData }) => {
  const sectionRef = useRef(null);
  const selectedDocs = Array.isArray(formData?.verificationDocs)
    ? formData.verificationDocs
    : [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".step-fade", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(".mascot-bounce", {
        scale: 0.9,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.7)",
        delay: 0.2,
      });

      gsap.from(".upload-card", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleDocument = (doc) => {
    const currentDocs = Array.isArray(formData?.verificationDocs)
      ? formData.verificationDocs
      : [];

    const exists = currentDocs.some((d) => d === doc.label);

    const newDocs = exists
      ? currentDocs.filter((d) => d !== doc.label)
      : [...currentDocs, doc.label];

    updateFormData({ verificationDocs: newDocs });
  };

  const isSelected = (label) =>
    selectedDocs.some((doc) => doc === label);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6 sm:py-6"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
        <div className="flex flex-1 flex-col justify-between">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-8 sm:py-10">
            <div className="step-fade mb-10 flex flex-col items-center justify-center gap-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-6">
              <div className="mascot-bounce flex h-32 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:h-36 sm:w-28">
                <span className="text-5xl">🪪</span>
              </div>

              <div className="mascot-bounce rounded-full bg-cyan-50 px-8 py-6 text-center shadow-sm sm:px-10 sm:py-8">
                <h3 className="text-xl font-medium text-gray-800 sm:text-2xl">
                  Verify Your Identity to Serve as a Babysitter
                </h3>
              </div>
            </div>

            <div className="step-fade mb-8 text-center">
              <p className="text-sm text-gray-500 sm:text-base">
                Please ensure you have the following documents to verify your eligibility:
              </p>
            </div>

            {/* Legal Documents List */}
            <div className="step-fade mb-8 text-left text-sm text-gray-500 sm:text-base">
              <ul className="list-disc pl-5">
                <li>Valid Passport or UK Photo ID</li>
                <li>Right to Work in the UK (if applicable)</li>
                <li>Enhanced DBS Certificate (recommended)</li>
                <li>Proof of Address (utility bill or bank statement)</li>
                <li>National Insurance Number (if applicable)</li>
                <li>UK Visa / BRP (for non-UK citizens)</li>
                <li>Paediatric First Aid or Childcare Qualifications (optional)</li>
              </ul>
            </div>

            {/* UK Verification Documents Checklist */}
            <div className="step-fade">
              <h4 className="mb-4 text-base font-semibold text-gray-800">
                Select documents you will provide for verification:
              </h4>
              <div className="space-y-3">
                {verificationDocuments.map((doc) => (
                  <label
                    key={doc.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${isSelected(doc.label)
                      ? "border-brandColor bg-brandColor/10"
                      : "border-gray-200 bg-white hover:border-brandColor"
                      }`}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isSelected(doc.label)}
                        onChange={() => toggleDocument(doc)}
                        className="peer sr-only"
                      />

                      <div
                        className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 transition-all duration-200 ${isSelected(doc.label)
                          ? "border-brandColor bg-brandColor scale-90"
                          : "border-gray-300 bg-white"
                          }`}
                      >
                        {isSelected(doc.label) && (
                          <svg
                            className="h-3 w-3 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    </div>

                    <span className="text-sm text-gray-700">{doc.label}</span>
                  </label>
                ))}
              </div>
              {selectedDocs.length > 0 && (
                <p className="mt-3 text-xs text-gray-500">
                  {selectedDocs.length} document type{selectedDocs.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            <div className="step-fade mt-6">
              <p className="text-sm text-gray-500 sm:text-base">
                Your documents are secure and will only be used for verification purposes.
              </p>
            </div>
          </div>

          <div className="step-fade sticky bottom-0 mt-8 bg-white px-4 py-4 sm:px-6">
            <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-lg font-medium text-brandColor cursor-pointer underline underline-offset-4 transition hover:text-brandColor/80"
              >
                <FiArrowLeft />
                Back
              </button>

              <button
                type="primary"
                size="large"
                onClick={onNext}
                disabled={selectedDocs.length === 0}
                className="flex items-center gap-2 rounded px-6 py-2 bg-brandColor text-white cursor-pointer duration-200 hover:bg-brandColor/80 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
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

export default BabysitterVerification;