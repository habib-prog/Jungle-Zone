"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Checkbox } from "antd";
import gsap from "gsap";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
  const sectionRef = useRef(null);
  const router = useRouter();

  // ========== form state ==========
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    postCode: "",
    password: "",
  });

  // ========== terms state ==========
  const [agree, setAgree] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ========== otp state ==========
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [regEmail, setRegEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".register-animate", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(".register-bounce", {
        scale: 0.9,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.7)",
        delay: 0.15,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ========== input change ==========
  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ========== email validation ==========
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

  // ========== form validation ==========
  const isFormValid = useMemo(() => {
    const fullNameOk = form.fullName.trim().length > 0;
    const emailOk = isEmailValid(form.email.trim());
    const postCodeOk = form.postCode.trim().length > 0;
    const passwordOk = form.password.trim().length >= 6;

    return fullNameOk && emailOk && postCodeOk && passwordOk && agree;
  }, [form, agree]);

  const showEmailError =
    form.email.trim().length > 0 && !isEmailValid(form.email.trim());

  const showPassError =
    form.password.trim().length > 0 && form.password.trim().length < 6;

  // ========== submit ==========
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setSubmitError("");
      if (!isFormValid) return;

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        postCode: form.postCode.trim(),
        password: form.password,
      };

      const res = await fetch("/api/register/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.requiresVerification) {
        setRegEmail(data.email);
        setStep("otp");
        setOtp("");
        setOtpError("");
        toast.success("Verification code sent to your email");
        return;
      }

      if (res.ok) {
        router.push("/login");
        return;
      }

      setSubmitError(data?.message || "Registration failed");
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
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
      const res = await fetch("/api/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      toast.success("Verification successful! You can now log in.");
      router.push("/login");
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
      const res = await fetch("/api/register/resend-otp", {
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
      className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
        {/* ========== content area ========== */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="mx-auto flex w-full max-w-2xl flex-col justify-center py-8 sm:py-10">
            {step === "otp" ? (
              <form onSubmit={onVerify} className="space-y-7">
                <div className="register-animate text-center">
                  <div className="register-bounce mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                    🔐
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Verify your email
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    We&apos;ve sent a 6-digit code to{" "}
                    <span className="font-medium text-gray-700">
                      {regEmail}
                    </span>
                    . Enter it below to activate your account.
                  </p>
                </div>

                <div className="register-animate">
                  <label className="mb-2 block text-lg font-semibold text-gray-400">
                    Verification code
                  </label>
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
                    <p className="mt-2 text-sm text-red-500">{otpError}</p>
                  )}
                </div>

                <div className="register-animate pt-2">
                  <button
                    type="submit"
                    disabled={verifying}
                    className="h-12 w-full rounded-full bg-cyan-600 text-base font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    {verifying ? "Verifying..." : "Verify email"}
                  </button>
                </div>

                <div className="register-animate text-center text-sm text-gray-500">
                  Didn&apos;t get the code?{" "}
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={resending}
                    className="font-medium text-cyan-700 underline underline-offset-4 disabled:opacity-50"
                  >
                    {resending ? "Sending..." : "Resend code"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={onSubmit} className="space-y-7">
                {/* ========== user name ========== */}
                <div className="register-animate">
                  <label className="mb-2 block text-lg font-semibold text-gray-400">
                    User name
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={onChange}
                    type="text"
                    placeholder="Enter your full name"
                    className="h-14 pl-3 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* ========== email ========== */}
                <div className="register-animate">
                  <label className="mb-2 block text-lg font-semibold text-gray-400">
                    Email address
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    type="email"
                    placeholder="Enter your email address"
                    className={`h-14 pl-3 w-full border-b-2 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 ${
                      showEmailError ? "border-red-400" : "border-gray-400"
                    }`}
                  />
                  {showEmailError && (
                    <p className="mt-2 text-sm text-red-500">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>

                {/* ========== post code ========== */}
                <div className="register-animate">
                  <label className="mb-2 block text-lg font-semibold text-gray-400">
                    Post code
                  </label>
                  <input
                    name="postCode"
                    value={form.postCode}
                    onChange={onChange}
                    type="text"
                    placeholder="Enter your post code"
                    className="h-14 pl-3 w-full border-b-2 border-gray-400 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* ========== password ========== */}
                <div className="register-animate">
                  <label className="mb-2 block text-lg font-semibold text-gray-400">
                    Password
                  </label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    type="password"
                    placeholder="At least 6 characters"
                    className={`h-14 pl-3 w-full border-b-2 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 ${
                      showPassError ? "border-red-400" : "border-gray-400"
                    }`}
                  />
                  {showPassError && (
                    <p className="mt-2 text-sm text-red-500">
                      Password must be at least 6 characters.
                    </p>
                  )}
                </div>

                {/* ========== platform disclaimer ========== */}
                <div className="register-animate rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950 leading-relaxed">
                  <p className="font-bold uppercase tracking-wide mb-1 text-[11px] text-amber-900">
                    Platform Disclaimer
                  </p>
                  <p>
                    JungleZone is an online introduction platform that enables
                    parents/guardians and independent babysitters to discover
                    and connect with each other. JungleZone does not provide
                    childcare services, does not employ or supply babysitters,
                    does not carry out DBS or background checks, does not verify
                    references or qualifications, and does not supervise
                    childcare arrangements. All childcare arrangements, checks,
                    and payments made outside JungleZone checkout are the
                    responsibility of the users involved. Hourly service payments are arranged directly with the provider. Your JungleZone platform access fee is separate.
                  </p>
                </div>

                {/* ========== terms and conditions ========== */}
                <div className="register-animate space-y-3 pt-1">
                  <div>
                    <label className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-cyan-600 border-gray-300 focus:ring-cyan-500 shrink-0"
                        required
                      />
                      <span>
                        I agree to the{" "}
                        <Link
                          href="/terms-conditions"
                          className="font-semibold text-cyan-700 underline underline-offset-4"
                        >
                          Terms &amp; Conditions
                        </Link>{" "}
                        and acknowledge that JungleZone is an introduction
                        platform and does not provide childcare services or
                        carry out DBS/background checks.{" "}
                        <span className="text-red-500 font-semibold">
                          (Mandatory)
                        </span>
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-cyan-600 border-gray-300 focus:ring-cyan-500 shrink-0"
                      />
                      <span>
                        I agree to receive marketing communications from
                        JungleZone.{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* ========== submit button ========== */}
                <div className="register-animate pt-2">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`h-12 w-full rounded-full text-base font-medium transition ${
                      isFormValid
                        ? "bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer"
                        : "cursor-not-allowed bg-gray-200 text-gray-500 pointer-events-none"
                    }`}
                  >
                    Continue
                  </button>
                  {submitError && (
                    <p className="mt-3 text-sm text-red-500">{submitError}</p>
                  )}
                </div>
                <h2 className="text-center text-base font-bold  font-poppins text-black">
                  Or
                </h2>

                {/* ========== google Register button ========== */}

                <button
                  type="button"
                  className={`h-12 w-full rounded-full text-white font-medium transition bg-black flex justify-center items-center gap-3 cursor-pointer`}
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                >
                  <Image
                    width={30}
                    height={30}
                    src={"/img/googlelogo.png"}
                    alt="google image"
                  />{" "}
                  Continue With Google
                </button>

                {/* ========== login text ========== */}
                <div className="register-animate pt-2 text-center">
                  <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-gray-800 underline underline-offset-4"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
