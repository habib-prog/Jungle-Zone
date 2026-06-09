import Link from "next/link";

// components/Home/FinalCta.jsx
export default function FinalCta() {
  return (
    <section className="w-full py-12 sm:py-16" aria-label="Final call to action">
      {/* container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-poppis text-3xl font-medium leading-9 text-[#4C494A] sm:text-4xl sm:leading-10">
            Find a Trusted Babysitter Near You
          </h2>

          <p className="mt-4 font-poppis text-base font-light leading-8 text-[#555555]">
            Search by Post code and book in minutes—safe, simple, and stress-free.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-brandColor px-6 py-3 font-poppis text-base font-medium leading-6 text-white shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brandColor focus-visible:ring-offset-2"
              aria-label="Get started"
            >
              Get Started
            </Link>

            <a
              href="#"
              className="inline-block font-daughter text-xs font-medium leading-6 text-brandColor"
              aria-label="Browse babysitters"
            >
              BROWSE BABYSITTERS
              <span className="mt-1 block h-0.5 w-24 bg-brandColor" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
