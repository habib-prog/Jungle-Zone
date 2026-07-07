"use client";

import React, { useEffect, useRef } from "react";
import { Button, Select } from "antd";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import gsap from "gsap";

const ProfileDetailsStep = ({ onNext, onBack, formData, updateFormData }) => {
  const sectionRef = useRef(null);

  const ageError = formData.age && (!/^\d+$/.test(formData.age) || Number(formData.age) < 18 || Number(formData.age) > 100)
    ? "Age must be a number between 18 and 100"
    : "";

  const locationError = formData.location && !/^[a-zA-Z\s,]+$/.test(formData.location)
    ? "Location should contain letters only"
    : "";

  const zipError = formData.zipCode && !/^\d+$/.test(formData.zipCode)
    ? "Post code must be positive numbers only"
    : "";

  const expError = formData.yearsOfExperience && (!/^\d+$/.test(formData.yearsOfExperience) || Number(formData.yearsOfExperience) < 0)
    ? "Experience must be a positive number of years"
    : "";

  const rateError = formData.hourlyRate && (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0)
    ? "Hourly rate must be a positive number"
    : "";

  const bioError = formData.description && formData.description.length < 10
    ? "Bio should be at least 10 characters"
    : "";

  const isValid =
    formData.age && !ageError &&
    formData.gender &&
    formData.location && !locationError &&
    formData.zipCode && !zipError &&
    formData.languages?.length > 0 &&
    formData.yearsOfExperience !== "" && !expError &&
    formData.hourlyRate !== "" && !rateError &&
    formData.comfortableWithAgeGroup?.length > 0 &&
    formData.skills?.length > 0 &&
    formData.preferences?.length > 0 &&
    formData.description && !bioError;

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
              <div className="mascot-bounce flex h-32 w-24 items-center justify-center rounded-full bg-violet-100 text-violet-600 sm:h-36 sm:w-28">
                <span className="text-5xl">👶</span>
              </div>

              <div className="mascot-bounce rounded-full bg-cyan-50 px-8 py-6 text-center shadow-sm sm:px-10 sm:py-8">
                <h3 className="text-xl font-medium text-gray-800 sm:text-2xl">
                  Tell us more about you
                </h3>
              </div>
            </div>

            {/* ========== form ========== */}
            <div className="space-y-7">
              {/* ========== age and gender ========== */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="step-fade">
                  <label className="mb-2 block text-lg font-semibold text-gray-400">
                    Age
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => updateFormData({ age: e.target.value })}
                    className="h-14 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  {ageError && (
                    <p className="mt-1 text-sm text-red-500 font-poppins">{ageError}</p>
                  )}
                </div>

                <div className="step-fade">
                  <label className="mb-2 block text-lg font-semibold text-gray-400">
                    Gender
                  </label>
                  <Select
                    size="large"
                    placeholder="Select gender"
                    className="w-full"
                    value={formData.gender}
                    onChange={(value) => updateFormData({ gender: value })}
                    options={[
                      { value: "Female", label: "Female" },
                      { value: "Male", label: "Male" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>
              </div>

              {/* ========== location ========== */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="step-fade">
                  <label className="mb-2 block text-lg font-semibold text-gray-400">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your location"
                    value={formData.location}
                    onChange={(e) =>
                      updateFormData({ location: e.target.value })
                    }
                    className="h-14 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  {locationError && (
                    <p className="mt-1 text-sm text-red-500 font-poppins">{locationError}</p>
                  )}
                </div>

                <div className="step-fade">
                  <label className="mb-2 block text-lg font-semibold text-gray-400">
                    Post Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your post code"
                    value={formData.zipCode}
                    onChange={(e) =>
                      updateFormData({ zipCode: e.target.value })
                    }
                    className="h-14 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  {zipError && (
                    <p className="mt-1 text-sm text-red-500 font-poppins">{zipError}</p>
                  )}
                </div>
              </div>

              {/* ========== languages ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Languages
                </label>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select languages"
                  className="w-full"
                  value={formData.languages}
                  onChange={(value) => updateFormData({ languages: value })}
                  options={[
                    { value: "English", label: "English" },
                    { value: "Bangla", label: "Bangla" },
                    { value: "Hindi", label: "Hindi" },
                    { value: "Arabic", label: "Arabic" },
                  ]}
                />
              </div>

              {/* ========== years of experience ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Years of experience
                </label>
                  <input
                    type="text"
                    placeholder="Enter your experience"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      updateFormData({ yearsOfExperience: e.target.value })
                    }
                    className="h-14 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  {expError && (
                    <p className="mt-1 text-sm text-red-500 font-poppins">{expError}</p>
                  )}
              </div>

              {/* ========== hourly rate ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Hourly rate
                </label>
                  <input
                    type="number"
                    placeholder="Enter your hourly rate"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      updateFormData({ hourlyRate: e.target.value })
                    }
                    className="h-14 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  {rateError && (
                    <p className="mt-1 text-sm text-red-500 font-poppins">{rateError}</p>
                  )}
              </div>

              {/* ========== kids age group ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Comfortable with age group
                </label>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select age group"
                  className="w-full"
                  value={formData.comfortableWithAgeGroup}
                  onChange={(value) =>
                    updateFormData({ comfortableWithAgeGroup: value })
                  }
                  options={[
                    { value: "Baby", label: "Baby" },
                    { value: "Toddler", label: "Toddler" },
                    { value: "Preschool", label: "Preschooler" },
                    { value: "Grade School", label: "Grade schooler" },
                  ]}
                />
              </div>

              {/* ========== skills ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Skills
                </label>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select your skills"
                  className="w-full"
                  value={formData.skills}
                  onChange={(value) => updateFormData({ skills: value })}
                  options={[
                    { value: "Drawing", label: "Drawing" },
                    { value: "Reading", label: "Reading" },
                    { value: "Music", label: "Music" },
                    { value: "Storytelling", label: "Storytelling" },
                    { value: "Homework Help", label: "Homework Help" },
                    { value: "Light Cooking", label: "Light Cooking" },
                  ]}
                />
              </div>

              {/* ========== preferences ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Preferences
                </label>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select your preferences"
                  className="w-full"
                  value={formData.preferences}
                  onChange={(value) => updateFormData({ preferences: value })}
                  options={[
                    { value: "pets", label: "Comfortable with pets" },
                    { value: "chores", label: "Light chores" },
                    { value: "tutoring", label: "Tutoring" },
                    { value: "special-needs", label: "Special needs care" },
                  ]}
                />
              </div>

              {/* ========== bio ========== */}
              <div className="step-fade">
                <label className="mb-2 block text-lg font-semibold text-gray-400">
                  Short bio
                </label>
                <textarea
                  rows={4}
                  placeholder="Write a short introduction about yourself"
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData({ description: e.target.value })
                  }
                  className="w-full resize-none border-b-2 border-gray-400 bg-transparent py-3 text-base text-gray-800 outline-none placeholder:text-gray-400"
                />
                {bioError && (
                  <p className="mt-1 text-sm text-red-500 font-poppins">{bioError}</p>
                )}
              </div>

              {/* ========== helper text ========== */}
              <div className="step-fade">
                <p className="text-sm text-gray-500 sm:text-base">
                  Add clear and honest details so parents can understand your
                  experience and profile better.
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
                className="flex items-center gap-2 rounded py-2 px-6 hover:bg-brandColor hover:text-white duration-200 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              >
                <FiArrowLeft />
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

export default ProfileDetailsStep;
