import HeroAnimation from "@/animations/HeroAnimation";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <HeroAnimation />
      <section
        id="hero"
        className="relative h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/banner1.jpg')" }}
        aria-label="Hero section"
      >
        {/* White overlay (NOT blocking by default) */}
        <div data-hero-bg className="absolute inset-0 bg-white opacity-0" />

        {/* Card */}
        <div data-hero-card className="absolute bottom-20 left-20 origin-left">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
            <div data-hero-text>
              <h2 className="font-poppis text-2xl font-medium uppercase leading-snug tracking-widest text-gray-700 sm:text-3xl lg:text-4xl">
                There is a place for you <br className="hidden sm:block" />
                at Peggi Kindergarten
              </h2>

              <Link
                href="/"
                className="mt-6 inline-block font-daughter text-xs font-medium uppercase tracking-widest text-brandColor"
              >
                <span className="border-b-2 border-brandColor pb-1">
                  Read more
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
