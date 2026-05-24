"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox } from "antd";
import { FiArrowLeft, FiCheckCircle, FiEdit2 } from "react-icons/fi";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ReviewSubmitStep = ({ onBack, goToStep, formData }) => {
  const sectionRef = useRef(null);
  const router = useRouter();

  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!formData) {
    return null;
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".step-fade", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getAvailabilityText = (timeSlots) => {
    if (!timeSlots) return "-";

    const selected = [];
    if (timeSlots.morning) selected.push("Morning");
    if (timeSlots.afternoon) selected.push("Afternoon");
    if (timeSlots.evening) selected.push("Evening");
    if (timeSlots.night) selected.push("Night");

    return selected.length ? selected.join(", ") : "-";
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      let profilePhotoData = formData.profilePhoto;

      if (formData.profilePhoto instanceof File) {
        const reader = new FileReader();
        profilePhotoData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(formData.profilePhoto);
        });
      }

      const payload = {
        ...formData,
        profilePhoto: profilePhotoData,
      };

      const response = await fetch("/api/babysitters/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Registration failed");
      } else if (response.ok) {
        router.push("/login");
      }

    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6 sm:py-6"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
        <div className="flex flex-1 flex-col justify-between">
          <div className="mx-auto w-full max-w-2xl py-10">
            <div className="step-fade mb-10 text-center">
              <h3 className="text-2xl font-medium text-gray-800">
                Review your information
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Make sure everything is correct before submitting
              </p>
            </div>

            <div className="step-fade mb-10">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h4 className="text-lg font-semibold text-gray-400">
                  Basic Info
                </h4>

                <button
                  onClick={() => goToStep(0)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-700"
                >
                  <FiEdit2 />
                  Edit
                </button>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <img
                  src={
                    formData.profilePhoto instanceof File
                      ? URL.createObjectURL(formData.profilePhoto)
                      : formData.profilePhoto || "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-gray-400">Profile photo</p>
                  <p className="mt-1 text-base text-gray-800">
                    {formData.profilePhoto ? "Uploaded successfully" : "Not uploaded"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Full name
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.fullName || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Email
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.email || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Phone
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.phoneNumber || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="step-fade mb-10">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h4 className="text-lg font-semibold text-gray-400">
                  Profile Details
                </h4>

                <button
                  onClick={() => goToStep(1)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-700"
                >
                  <FiEdit2 />
                  Edit
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Age
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.age || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Gender
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.gender || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Location
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.location || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Zip Code
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.zipCode || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Languages
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.languages?.join(", ") || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Years of Experience
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.yearsOfExperience || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Hourly Rate
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.hourlyRate || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Comfortable with age group
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.comfortableWithAgeGroup?.join(", ") || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Skills
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.skills?.join(", ") || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Preferences
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {Array.isArray(formData.preferences)
                      ? formData.preferences.join(", ")
                      : formData.preferences || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-lg font-semibold text-gray-400">
                    Bio
                  </label>
                  <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                    {formData.description || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="step-fade mb-10">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h4 className="text-lg font-semibold text-gray-400">
                  Availability
                </h4>

                <button
                  onClick={() => goToStep(2)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-700"
                >
                  <FiEdit2 />
                  Edit
                </button>
              </div>

              <div className="space-y-6">
                {formData.availability?.length > 0 ? (
                  formData.availability.map((item) => (
                    <div key={item.day}>
                      <label className="text-lg font-semibold text-gray-400">
                        {item.day}
                      </label>
                      <p className="mt-2 border-b-2 border-gray-300 pb-3 text-base text-gray-800">
                        {getAvailabilityText(item.timeSlots)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-base text-gray-800">No availability set</p>
                )}
              </div>
            </div>

            {formData.verificationDocs?.length > 0 && (
              <div className="step-fade mb-10">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h4 className="text-lg font-semibold text-gray-400">
                    Verification Documents
                  </h4>

                  <button
                    onClick={() => goToStep(3)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-700"
                  >
                    <FiEdit2 />
                    Edit
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.verificationDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2">
                      <FiCheckCircle className="text-green-500" />
                      <p className="text-base text-gray-800">{doc.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="step-fade mt-10">
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              >
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms&conditions" className="underline">
                    Terms & Conditions
                  </Link>
                </span>
              </Checkbox>
            </div>
          </div>

          <div className="step-fade sticky bottom-0 bg-white px-4 py-4">
            <div className="mx-auto flex max-w-2xl items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-lg text-brandColor underline"
              >
                <FiArrowLeft />
                Back
              </button>

              <button
                type="primary"
                disabled={!agree || isLoading}
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-full py-2 px-6 bg-brandColor text-white cursor-pointer disabled:bg-brandColor/80 disabled:cursor-not-allowed hover:bg-brandColor/80"
              >
                {isLoading ? "Submitting..." : "Submit"}
                <FiCheckCircle />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSubmitStep;