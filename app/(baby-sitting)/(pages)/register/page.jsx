"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/navigation";

const Page = () => {
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 40,
    });
  }, []);

  const Card = ({ id, title, desc }) => {
    const active = role === id;
    return (
      <button
        type="button"
        onClick={() => setRole(id)}
        className={`relative w-full max-w-105 rounded-2xl border p-6 md:p-7 text-left
          transition-all duration-200 select-none shadow-sm hover:shadow-md active:scale-[0.9]
          ${
            active
              ? "border-brandColor bg-brandColor/10 shadow-md"
              : "border-gray-200 bg-white"
          }`}
      >
        <div
          className={`absolute right-5 top-5 h-6 w-6 rounded-full border-[3px]
            flex items-center justify-center
            ${active ? "border-brandColor" : "border-gray-300"}`}
        >
          <div
            className={`h-3 w-3 rounded-full transition-all duration-200
              ${active ? "bg-brandColor scale-100" : "bg-transparent scale-75"}`}
          />
        </div>

        <h2 className="font-poppins text-xl md:text-2xl font-medium text-gray-800 leading-snug">
          {title}
        </h2>

        <div
          className={`mt-5 h-0.5 w-14 rounded-full transition-all duration-200
            ${active ? "bg-brandColor" : "bg-gray-200"}`}
        />
      </button>
    );
  };

  const isDisabled = !role;

  const handleNext = () => {
    if (!role) return;

    if (["babysitting", "cleaning", "cooking"].includes(role)) router.push(`/register-babysitter?category=${role}`);
    if (role === "parent") router.push("/register-parent");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center" data-aos="fade-up" data-aos-once="true">
          <h1 className="font-poppins text-2xl md:text-3xl font-semibold text-gray-900">
            How would you like to sign up?
          </h1>
          <p className="mt-2 font-nunito text-gray-600">
            Choose what you want to do on JungleZone.
          </p>
        </div>

        <div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          data-aos="fade-up"
          data-aos-delay="120"
          data-aos-once="true"
        >
          <Card id="babysitting" title="I'm a babysitter or nanny" desc="Create a profile and connect with families looking for childcare." />
          <Card id="cleaning" title="I'm a cleaner" desc="Create a profile and connect with people looking for cleaning services." />
          <Card id="cooking" title="I'm a cook or chef" desc="Create a profile and connect with people looking for cooking services." />
          <Card
            id="parent"
            title="I'm looking for a service"
            desc="Find local providers and contact them directly."
          />
        </div>

        {/* Section 16 Site-Wide Platform Disclaimer */}
        <div
          className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="150"
          data-aos-once="true"
        >
          <p className="font-bold uppercase tracking-wide mb-1 text-[11px] text-amber-900">
            Platform Notice
          </p>
          <p>
            JungleZone is an online introduction platform that enables
            clients and independent service providers to discover and connect
            with each other. JungleZone does not provide the services, employ
            providers, or check or verify provider claims. Arrangements, checks,
            and any payments made outside JungleZone checkout are the
            responsibility of the users involved. Hourly service payments are
            arranged directly between the service taker and provider.
          </p>
        </div>

        {/* Next button bottom-right */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            disabled={isDisabled}
            className={`font-poppins rounded-xl px-6 py-3 text-sm md:text-base transition-all duration-200 cursor-pointer
              ${
                isDisabled
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-brandColor text-white hover:brightness-95 active:scale-[0.98]"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
