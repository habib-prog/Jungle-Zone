"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox } from "antd";
import { FiArrowLeft, FiCheckCircle, FiEdit2, FiClock } from "react-icons/fi";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ReviewSubmitStep = ({ onBack, goToStep, formData }) => {
  const sectionRef = useRef(null);
  const router = useRouter();

  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ========== otp / approval state ==========
  const [step, setStep] = useState("review"); // "review" | "otp" | "done"
  const [regEmail, setRegEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [approvalWaitHours, setApprovalWaitHours] = useState(72);

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

  if (!formData) {
    return null;
  }

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

      const payload = new FormData();
      payload.append("profilePhoto", formData.profilePhoto);
      payload.append("fullName", formData.fullName || "");
      payload.append("email", formData.email || "");
      payload.append("phoneNumber", formData.phoneNumber || "");
      payload.append("password", formData.password || "");
      payload.append("age", formData.age || "");
      payload.append("gender", formData.gender || "");
      payload.append("location", formData.location || "");
      payload.append("zipCode", formData.zipCode || "");
      payload.append("description", formData.description || "");
      payload.append(
        "certifications",
        Array.isArray(formData.certifications)
          ? formData.certifications.join(",")
          : formData.certifications || "",
      );
      payload.append("educationLevel", formData.educationLevel || "");
      payload.append(
        "preferredBabysittingLocation",
        formData.preferredBabysittingLocation || "",
      );
      payload.append("languages", formData.languages?.join(",") || "");
      payload.append("yearsOfExperience", formData.yearsOfExperience || "");
      payload.append("hourlyRate", formData.hourlyRate || "");
      payload.append(
        "comfortableWithAgeGroup",
        formData.comfortableWithAgeGroup?.join(",") || "",
      );
      payload.append("skills", formData.skills?.join(",") || "");
      payload.append(
        "availability",
        JSON.stringify(formData.availability || []),
      );
      payload.append(
        "verificationDocs",
        formData.verificationDocs?.join(",") || "",
      );
      payload.append("preferences", formData.preferences?.join(",") || "");

      const response = await fetch("/api/babysitters/register", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Registration failed");
      } else if (response.ok && result.requiresVerification) {
        setRegEmail(result.email || formData.email || "");
        setOtp("");
        setOtpError("");
        setStep("otp");
        toast.success("Verification code sent to your email");
      } else if (response.ok) {
        toast.success(
          "Registration successful. Your sitter account is pending approval and may take up to 72 hours.",
        );
        router.push("/login?pendingApproval=true");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ========== verify otp ==========
  const onVerify = async (e) => {
    e.preventDefault();
    setOtpError("");
    if (otp.trim().length < 4) {
      setOtpError("Please enter the 6-digit code");
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch("/api/babysitters/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      setApprovalWaitHours(data.approvalWaitHours || 72);
      setStep("done");
      toast.success("Verification successful!");
    } catch (err) {
      setOtpError(err.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  // ========== resend otp ==========
  const onResend = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/babysitters/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend");
      toast.success("A new code has been sent");
      setOtp("");
    } catch (err) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6 sm:py-6"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
        <div className="flex flex-1 flex-col justify-between">
          {step === "done" ? (
            <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center py-16 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
                <FiCheckCircle className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Your email is verified
              </h3>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-amber-50 px-5 py-4 text-amber-800">
                <FiClock className="text-2xl" />
                <p className="text-left text-sm">
                  Your sitter account is now pending admin approval. This usually
                  takes up to <strong>{approvalWaitHours} hours</strong>. We&apos;ll
                  notify you by email once you&apos;re approved.
                </p>
              </div>
              <button
                onClick={() => router.push("/login?pendingApproval=true")}
                className="mt-8 rounded-full bg-brandColor px-8 py-3 text-white transition hover:bg-brandColor/80"
              >
                Go to login
              </button>
            </div>
          ) : step === "otp" ? (
            <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center py-10">
              <div className="step-fade mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                  🔐
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Verify your email
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  We&apos;ve sent a 6-digit code to{" "}
                  <span className="font-medium text-gray-700">{regEmail}</span>.
                  Enter it below to continue.
                </p>
              </div>

              <form onSubmit={onVerify} className="step-fade w-full space-y-6">
                <input
                  name="otp"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="h-14 w-full rounded-xl border-2 border-gray-300 bg-white px-4 text-center text-2xl tracking-[0.5em] text-gray-800 outline-none focus:border-brandColor"
                />
                {otpError && (
                  <p className="text-center text-sm text-red-500">{otpError}</p>
                )}

                <button
                  type="submit"
                  disabled={verifying}
                  className="h-12 w-full rounded-full bg-brandColor text-base font-medium text-white transition hover:bg-brandColor/80 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {verifying ? "Verifying..." : "Verify email"}
                </button>

                <div className="text-center text-sm text-gray-500">
                  Didn&apos;t get the code?{" "}
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={resending}
                    className="font-medium text-brandColor underline underline-offset-4 disabled:opacity-50"
                  >
                    {resending ? "Sending..." : "Resend code"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
          <>
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
                      : formData.profilePhoto ||
                        "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-gray-400">Profile photo</p>
                  <p className="mt-1 text-base text-gray-800">
                    {formData.profilePhoto
                      ? "Uploaded successfully"
                      : "Not uploaded"}
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
                    Post Code
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
                  {formData.verificationDocs.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FiCheckCircle className="text-green-500" />
                      <p className="text-base text-gray-800">{doc}</p>
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
          </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSubmitStep;
