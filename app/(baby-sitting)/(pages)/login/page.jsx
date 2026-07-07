"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import logo from "../../../../public/img/logo.png";
import loginImage from "../../../../public/img/loginImage.png";
import Image from "next/image";
import { signIn } from "next-auth/react";

import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

const page = () => {
  const { loginLocal, refreshUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  const isFormValid = useMemo(() => {
    return form.email.trim() !== "" && form.password.trim() !== "";
  }, [form.email, form.password]);

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        loginLocal(data);
        refreshUser();

        // Redirect based on user role
        const role = data.account?.role;
        let redirectUrl = "/";

        if (role === "sitter" || role === "babysitter") {
          redirectUrl = "/dashboard/babySitter";
        } else if (role === "admin") {
          redirectUrl = "/dashboard/admin";
        } else if (role === "parent") {
          redirectUrl = "/dashboard/parent";
        }

        router.push(redirectUrl);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section
      id="login"
      className="min-h-screen bg-white p-5 flex justify-center items-center"
    >
      <div className="overflow-hidden mt-20 lg:mt-0" data-aos="zoom-in">
        <Link href="#" className="logo inline-flex" data-aos="fade-down">
          <Image className="w-50 h-auto" src={logo} alt="junglezone" priority />
        </Link>

        <div className="h-full flex-1 flex flex-col lg:flex-row gap-8 lg:gap-24 items-center justify-center lg:justify-between mt-6 lg:mt-0">
          <div
            className="w-full max-w-150 lg:max-w-none lg:w-150 flex justify-center lg:justify-start"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <Image
              className="h-auto max-w-100"
              src={loginImage}
              alt="login image"
              priority
            />
          </div>

          {/* -------- login form  */}
          <div
            className="w-full max-w-105 lg:max-w-none lg:w-auto"
            data-aos="fade-left"
            data-aos-delay="150"
          >
            <h2
              className="text-2xl font-semibold font-poppins text-gray-500"
              data-aos="fade-up"
            >
              <span className="text-brandColor">Welcome</span> back!
            </h2>

            <h2
              className="max-w-62.5 text-xl font-bold font-poppins text-gray-600 mt-3"
              data-aos="fade-up"
              data-aos-delay="80"
            >
              Sign in to your account
            </h2>

            <form
              onSubmit={handleLogin}
              data-aos="fade-up"
              data-aos-delay="140"
            >
              {/* email field */}
              <h2 className="text-sm font-bold font-poppins text-gray-600 mt-5 mb-2">
                Email
              </h2>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="mymail@gmail.com"
                className="w-full lg:w-100 pl-2 bg-[#589b2c21] border border-brandColor h-10 rounded-sm outline-none"
                type="text"
                data-aos="fade-up"
                data-aos-delay="180"
              />

              {/* password field */}
              <h2 className="text-sm font-bold font-poppins text-gray-600 mt-5 mb-2">
                Password
              </h2>
              <input
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="************"
                className="w-full lg:w-100 pl-2 bg-[#589b2c21] border border-brandColor h-10 rounded-sm outline-none"
                type="password"
                data-aos="fade-up"
                data-aos-delay="220"
              />

              <p
                className="text-sm font-bold font-poppins text-black mt-5"
                data-aos="fade-up"
                data-aos-delay="260"
              >
                Forget password?
              </p>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`py-2 w-full lg:w-100 mt-7 rounded-[5px] text-white text-lg font-semibold font-poppins transition 
                    ${
                      isFormValid
                        ? "bg-brandColor cursor-pointer"
                        : "bg-brandColor/50 cursor-not-allowed opacity-60"
                    }`}
              >
                Login
              </button>
            </form>

            <h2 className="text-center text-base font-bold  font-poppins text-black my-3">
              Or
            </h2>

            {/* ========== google Register button ========== */}

            <button
              type="button"
              className={`h-12 w-full rounded-full text-white font-medium transition bg-black hover:bg-black/70 duration-200 flex justify-center items-center gap-3 cursor-pointer`}
              onClick={() =>
                signIn("google", { callbackUrl: "/dashboard/parent" })
              }
            >
              <Image
                width={30}
                height={30}
                src={"/img/googlelogo.png"}
                alt="google image"
              />{" "}
              Sign in With Google
            </button>

            <p
              className="text-sm font-medium text-black font-poppins mt-2"
              data-aos="fade-up"
              data-aos-delay="340"
            >
              {" "}
              Don't have an account?{" "}
              <Link
                className="font-semibold text-brandColor"
                href={"/register"}
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
