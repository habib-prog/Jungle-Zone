// components/Home/BabysittersLove.jsx
import Image from "next/image";

export default function BabysittersLove() {
  return (
    <section className="w-full py-12 sm:py-16" aria-label="Babysitters who love what they do">
      {/* container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left Image */}
          <figure className="relative w-full rounded-2xl overflow-hidden">
            <Image
              src="/img/babysitter.jpg"
              alt="Professional babysitter caring for a child"
              width={1200}
              height={760}
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 55vw, 100vw"
              loading="lazy"
            />

            {/* Play icon (visual only, no JS) */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-white shadow">
                <span className="sr-only">Watch story</span>
                <span className="ml-1 block h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-brandColor" />
              </div>
            </div>
          </figure>

          {/* Right Content */}
          <div>
            <h2 className="font-poppis text-4xl font-medium leading-10 text-[#4C494A]">
              BABYSITTERS <br className="hidden sm:block" />
              LOVE WHAT THEY DO
            </h2>

            <div className="mt-4 h-1 w-10 bg-brandColor" />

            <p className="mt-6 max-w-xl font-poppis text-base font-light leading-8 text-[#555555]">
              Caring babysitters who create safe, happy, and nurturing moments for every child.
            </p>

            <a
              href="#"
              className="mt-6 inline-block font-daughter text-xs font-medium leading-6 text-brandColor"
              aria-label="Read more about our babysitters"
            >
              READ MORE
              <span className="mt-1 block h-0.5 w-20 bg-brandColor" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
