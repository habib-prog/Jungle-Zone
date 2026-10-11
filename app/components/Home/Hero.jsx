import HeroAnimation from "@/animations/HeroAnimation";
import Link from "next/link";
import { FaArrowRight, FaShieldAlt, FaStar } from "react-icons/fa";

export default function Hero() {
  return (
    <>
      <HeroAnimation />
      <section
        id="hero"
        className="relative w-full overflow-hidden bg-gradient-to-br from-[#f3f9ec] via-white to-[#eaf4df]"
        aria-label="Hero section"
      >
        {/* Decorative blobs */}
        <div
          data-hero-bg
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brandColor/20 blur-3xl"
        />
        <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[#a7d27a]/30 blur-3xl" />

        <div className="container relative mx-auto flex min-h-screen flex-col items-center gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-0">
          {/* Text column */}
          <div data-hero-card className="w-full max-w-xl lg:flex-1">
            <div
              data-hero-text
              className="inline-flex items-center gap-2 rounded-full bg-brandColor/10 px-4 py-1.5 font-poppins text-xs font-semibold uppercase tracking-widest text-brandColor"
            >
              <FaShieldAlt className="text-brandColor" />
              Local childcare introductions
            </div>

            <h1 className="mt-6 font-poppins text-4xl font-bold leading-tight text-[#2f3a22] sm:text-5xl lg:text-6xl">
              There is a place for you{" "}
              <span className="text-brandColor">at Peggi Kindergarten</span>
            </h1>

            <p className="mt-6 max-w-lg font-poppins text-base font-light leading-8 text-[#555555] sm:text-lg">
              Nurturing little explorers in a safe, playful, and loving
              environment — where every child grows with confidence, curiosity,
              and joy.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brandColor px-7 py-3.5 font-poppins text-base font-semibold text-white shadow-lg shadow-brandColor/30 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#558a28] focus:outline-none focus-visible:ring-2 focus-visible:ring-brandColor focus-visible:ring-offset-2"
                aria-label="Enroll now"
              >
                Enroll Now
                <FaArrowRight />
              </Link>

              <Link
                href="/"
                className="inline-block font-daughter text-sm font-medium uppercase tracking-widest text-brandColor"
              >
                <span className="border-b-2 border-brandColor pb-1">
                  Read more
                </span>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {["#fcd34d", "#a7d27a", "#629d2f", "#f9a8d4"].map((c) => (
                  <span
                    key={c}
                    className="h-10 w-10 rounded-full border-2 border-white"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 font-poppins text-sm text-[#555555]">
                <span className="flex items-center gap-1 font-semibold text-[#2f3a22]">
                  <FaStar className="text-[#fbbf24]" /> 4.9
                </span>
                from 500+ happy families
              </div>
            </div>
          </div>

          {/* Visual column */}
          <div
            data-hero-visual
            className="relative w-full max-w-lg lg:flex-1"
          >
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-brandColor to-[#a7d27a] shadow-2xl shadow-brandColor/30" />
              <div className="absolute inset-4 overflow-hidden rounded-[2rem] bg-white/20 ring-1 ring-white/40 backdrop-blur-sm" />
              <img
                src="/img/banner1.jpg"
                alt="Happy children at Peggi Kindergarten"
                className="absolute inset-4 rounded-[2rem] object-cover shadow-lg"
              />
              <div className="absolute -bottom-5 left-1/2 w-11/12 -translate-x-1/2 rounded-2xl bg-white p-4 shadow-xl">
                <p className="text-center font-poppins text-sm font-medium text-[#2f3a22]">
                  🌿 Play. Learn. Grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
