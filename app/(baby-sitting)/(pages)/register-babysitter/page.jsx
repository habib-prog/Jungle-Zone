"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BasicAccountStep from "@/app/components/register-babysitter/BasicAccountStep";
import ProfileDetailsStep from "@/app/components/register-babysitter/ProfileDetailsStep";
import AvailabilityStep from "@/app/components/register-babysitter/AvailabilityStep";
import VerificationStep from "@/app/components/register-babysitter/VerificationStep";
import ReviewSubmitStep from "@/app/components/register-babysitter/ReviewSubmitStep";

const Page = () => {
  const pageRef = useRef(null);

  // ========== step state ==========
  const [current, setCurrent] = useState(0);

  // ========== form data state ==========
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    profilePhoto: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    location: "",
    zipCode: "",
    description: "",
    certifications: [],
    educationLevel: "",
    preferredBabysittingLocation: "At Parent's",
    languages: [],
    yearsOfExperience: "",
    hourlyRate: "",
    comfortableWithAgeGroup: [],
    skills: [],
    availability: [],
    verificationDocs: []
  });

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // ========== step headings ==========
  const stepsHeaiding = [
    {
      title: "Basic Info",
    },
    {
      title: "Profile Details",
    },
    {
      title: "Availability",
    },
    {
      title: "Verification",
    },
    {
      title: "Review & Submit",
    },
  ];

  // ========== progress calculation ==========
  const totalSteps = stepsHeaiding.length;
  const progressWidth = `${((current + 1) / totalSteps) * 100}%`;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".register-page-animate", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);
  console.log(formData)
  return (
    <section
      ref={pageRef}
      className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6 sm:py-6"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
        {/* ========== progress ========== */}
        <div className="register-page-animate mt-4">
          <div className="h-3 w-full overflow-hidden rounded-full bg-rose-100">
            <div
              className="h-full rounded-full bg-rose-300 transition-all duration-500"
              style={{ width: progressWidth }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 sm:text-sm">
            <span>
              Step {current + 1} of {totalSteps}
            </span>
            <span>{stepsHeaiding[current]?.title}</span>
          </div>
        </div>

        {/* ========== step content ========== */}
        <div className="flex-1">
          {/* ========== step 1 ==========
              next -> go to step 2
              back -> disabled (first step)
          */}
          {current === 0 && (
            <BasicAccountStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrent((prev) => prev + 1)}
              onBack={() => {}}
            />
          )}

          {/* ========== step 2 ==========
              next -> go to step 3
              back -> go to step 1
          */}
          {current === 1 && (
            <ProfileDetailsStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrent((prev) => prev + 1)}
              onBack={() => setCurrent((prev) => prev - 1)}
            />
          )}

          {/* ========== step 3 ==========
              next -> finish
              back -> go to step 2
          */}
          {current === 2 && (
            <AvailabilityStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrent((prev) => prev + 1)}
              onBack={() => setCurrent((prev) => prev - 1)}
            />
          )}
           {/* ========== step 4 ==========
               next -> finish
               back -> go to step 2
           */}
           {current === 3 && (
             <VerificationStep
               formData={formData}
               updateFormData={updateFormData}
               onNext={() => setCurrent((prev) => prev + 1)}
               onBack={() => setCurrent((prev) => prev - 1)}
             />
           )}
          {/* {current === 4 && (
            <BillingOffers
              onNext={() => setCurrent((prev) => prev + 1)}
              onBack={() => setCurrent((prev) => prev - 1)}
            />
          )} */}
          {/* ========== step 6 ==========
              next -> finish
              back -> go to step 2
          */}
          {current === 4 && (
            <ReviewSubmitStep
              formData={formData}
              onBack={() => setCurrent((prev) => prev - 1)}
              goToStep={(stepIndex) => setCurrent(stepIndex)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;