"use client";
import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, UserSearch } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    src: "/img/service-babysitting.jpg",
    label: "Babysitting",
    hireHref: "/babysitters",
    applyHref: "/register",
    video: "/videos/babysitting.mp4",
    alt: "Babysitter playing with a baby while a parent relaxes",
    position: "object-[center_30%]",
  },
  {
    src: "/img/service-cleaning.jpg",
    label: "Cleaning",
    hireHref: "/#services",
    applyHref: "/register",
    video: "/videos/cleaning.mp4",
    alt: "Cleaner mopping a living room floor",
    position: "object-center",
  },
  {
    src: "/img/service-cooking-home.jpg",
    label: "Cooking",
    hireHref: "/#services",
    applyHref: "/register",
    video: "/videos/cooking.mp4",
    alt: "Cook chopping vegetables in a home kitchen",
    position: "object-[center_35%]",
  },
];

// Long enough for each clip to actually play before the next slide arrives.
const INTERVAL = 6000;

const n = slides.length;

// Position relative to the active slide, kept in [-1, n-2] so slides always travel left.
const relPos = (i, active) => {
  let p = (i - active + n) % n;
  if (p === n - 1) p = -1;
  return p;
};

export default function HeroStack({ children }) {
  const [{ active, prev }, setIndex] = useState({ active: 0, prev: 0 });
  const [paused, setPaused] = useState(false);

  const goTo = (next) =>
    setIndex(({ active: a }) => ({ active: next, prev: a }));

  const current = slides[active];
  const videoRefs = useRef([]);

  // Only the visible slide's video plays; the others are paused and rewound.
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timers = [];
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        if (!reduceMotion) video.play().catch(() => {});
      } else {
        // Let the outgoing clip finish sliding away before rewinding it.
        timers.push(
          setTimeout(() => {
            video.pause();
            video.currentTime = 0;
          }, 1100),
        );
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [active]);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex(({ active: a }) => ({ active: (a + 1) % n, prev: a })),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[87svh] min-h-[644px] w-full overflow-hidden bg-gray-900">
        {slides.map((slide, i) => {
          const pos = relPos(i, active);
          const wasPos = relPos(i, prev);
          // A slide jumping from far left to far right must not animate across the view.
          const jump = Math.abs(pos - wasPos) > 1;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 ${jump ? "" : "transition-transform duration-1000 ease-in-out"}`}
              style={{ transform: `translateX(${pos * 100}%)` }}
              aria-hidden={pos !== 0}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover ${slide.position}`}
              />
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={slide.video}
                muted
                loop
                playsInline
                preload={i === 0 ? "auto" : "metadata"}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent sm:via-black/20" />
            </div>
          );
        })}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
          <div className="pointer-events-auto container pb-24 pt-12">
            <div className="max-w-xl">
              {children}
              <div
                key={current.label}
                className="mt-4 flex animate-[fadeUp_0.6s_ease-out] flex-col gap-3 sm:flex-row"
              >
                <Link
                  href={current.hireHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brandColor px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 ring-1 ring-white/30 transition hover:bg-white hover:text-brandColor"
                >
                  <UserSearch className="h-4 w-4" />
                  Hire {current.label}
                </Link>
                <Link
                  href={current.applyHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brandColor shadow-lg shadow-black/20 transition hover:shadow-xl"
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                  Apply to work
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${slide.label}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-brandColor" : "w-1.5 bg-white/60"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
