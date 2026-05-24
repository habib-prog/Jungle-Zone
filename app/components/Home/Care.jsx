// components/Home/Care.jsx
import CareAnimation from "@/animations/CareAnimation";
import Image from "next/image";

export default function Care() {
  return (
    <>
    <CareAnimation/>
      <section id="care" className="w-full py-12 sm:py-16">
  <div className="container mx-auto grid grid-cols-1 items-center gap-10 lg:grid-cols-2">

    {/* LEFT TEXT */}
    <div>
      <h2 data-care-heading className="font-poppis text-4xl font-medium leading-10 text-[#4C494A]">
        PRESCHOOL OF THE ARTS <br className="hidden sm:block" />
        AND EDUCATION
      </h2>

      <div
        data-care-line
        className="mt-4 h-1 w-10 bg-brandColor"
      />

      <p
        data-care-body
        className="mt-6 max-w-lg font-poppis text-base font-light leading-8 text-[#555555]"
      >
        Trusted babysitters bringing safe routines, learning, and happy playtime daily.
      </p>

      <a
        data-care-cta
        href="#"
        className="mt-6 inline-block font-daughter text-xs font-medium leading-6 text-brandColor"
      >
        VIEW GALLERY
        <span className="mt-1 block h-0.5 w-20 bg-brandColor" />
      </a>
    </div>

    {/* RIGHT IMAGE */}
    <div data-care-image className="overflow-hidden lg:w-192.5 lg:h-118">
      <img
        src="/img/bigcare.jpg"
        alt="Care"
        className="h-auto w-full object-cover"
      />
    </div>

  </div>
</section>

    </>
  );
}
