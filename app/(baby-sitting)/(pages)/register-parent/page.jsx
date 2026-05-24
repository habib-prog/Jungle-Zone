"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Checkbox } from "antd";
import gsap from "gsap";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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

  // ========== error states ==========
  const showEmailError =
    form.email.trim().length > 0 && !isEmailValid(form.email.trim());

  const showPassError =
    form.password.trim().length > 0 && form.password.trim().length < 6;

  // ========== submit ==========
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!isFormValid) return;

      const res = await fetch("/api/register/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if(res.ok){
        router.push("/login")
      }
    } catch (error) {
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
            {/* ========== form ========== */}
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
                  className={`h-14 pl-3 w-full border-b-2 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 ${showEmailError ? "border-red-400" : "border-gray-400"
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
                  className={`h-14 pl-3 w-full border-b-2 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 ${showPassError ? "border-red-400" : "border-gray-400"
                    }`}
                />
                {showPassError && (
                  <p className="mt-2 text-sm text-red-500">
                    Password must be at least 6 characters.
                  </p>
                )}
              </div>

              {/* ========== terms and conditions ========== */}
              <div className="register-animate pt-2">
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                >
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link
                      href="/terms&conditions"
                      className="font-medium text-gray-800 underline underline-offset-4"
                    >
                      Terms & Conditions
                    </Link>
                  </span>
                </Checkbox>
              </div>

              {/* ========== submit button ========== */}
              <div className="register-animate pt-2">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`h-12 w-full rounded-full text-base font-medium transition ${isFormValid
                    ? "bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer"
                    : "cursor-not-allowed bg-gray-200 text-gray-500 pointer-events-none"
                    }`}
                >
                  Continue
                </button>
              </div>
              <h2 className="text-center text-base font-bold  font-poppins text-black">Or</h2>

              {/* ========== google Register button ========== */}

              <button
                type="submit"
                className={`h-12 w-full rounded-full text-white font-medium transition bg-black flex justify-center items-center gap-3 cursor-pointer`}
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <Image width={30} height={30} src={"/img/googlelogo.png"} alt="google image" />{" "}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
