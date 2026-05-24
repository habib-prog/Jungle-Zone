// components/Home/GalleryLightbox.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export default function GalleryLightbox() {
  const images = useMemo(
    () => [
      { src: "/img/location.jpg", alt: "Find babysitters by location" },
      { src: "/img/baby.jpg", alt: "Happy child moment" },
      { src: "/img/bigcare.jpg", alt: "Child-friendly care space" },
      { src: "/img/location.jpg", alt: "Safe nearby locations" },
    ],
    []
  );

  const [open, setOpen] = useState(false);

  // ✅ for open/close overlay fade
  const [overlayVisible, setOverlayVisible] = useState(false);

  // ✅ for image fade when changing slides
  const [active, setActive] = useState(0);
  const [shownIndex, setShownIndex] = useState(0);
  const [imageVisible, setImageVisible] = useState(true);

  const closeBtnRef = useRef(null);
  const intervalRef = useRef(null);
  const changeLockRef = useRef(false);

  const openLightbox = (index) => {
    setShownIndex(index);
    setActive(index);
    setOpen(true);
  };

  const closeLightbox = () => {
    setOverlayVisible(false);
    setImageVisible(false);
    window.setTimeout(() => setOpen(false), 300);
  };

  const changeTo = (nextIndex) => {
    if (changeLockRef.current) return;
    changeLockRef.current = true;

    // fade out current image
    setImageVisible(false);

    window.setTimeout(() => {
      setShownIndex(nextIndex);
      setActive(nextIndex);

      // fade in new image
      window.setTimeout(() => {
        setImageVisible(true);
        window.setTimeout(() => {
          changeLockRef.current = false;
        }, 300);
      }, 20);
    }, 200);
  };

  const next = () => changeTo((active + 1) % images.length);
  const prev = () => changeTo((active - 1 + images.length) % images.length);

  // ✅ body scroll lock + focus + overlay fade-in
  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t1 = window.setTimeout(() => setOverlayVisible(true), 10);
    const t2 = window.setTimeout(() => {
      setImageVisible(true);
      closeBtnRef.current?.focus();
    }, 50);

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = original;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // OPTIONAL: autoplay inside lightbox (2s). Remove if you don't want it.
  useEffect(() => {
    if (!open) return;

    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setActive((i) => {
        const ni = (i + 1) % images.length;
        changeTo(ni);
        return ni;
      });
    }, 2000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, images.length]);

  return (
    <section className="w-full py-12 sm:py-16" aria-label="Gallery">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((img, idx) => (
            <button
              key={`${img.src}-${idx}`}
              type="button"
              onClick={() => openLightbox(idx)}
              className="group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brandColor"
              aria-label={`Open image ${idx + 1}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={700}
                height={500}
                className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          className={[
            "fixed inset-0 z-50 flex items-center justify-center",
            "transition-opacity duration-300 ease-out",
            overlayVisible ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {/* Overlay */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute inset-0 bg-black/60"
            aria-label="Close lightbox"
          />

          {/* Modal content */}
          <div className="relative z-10 w-[92%] max-w-3xl bg-white shadow">
            {/* Close */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeLightbox}
              className="absolute right-3 top-3 rounded p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandColor"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Image area with fade transition */}
            <div className="relative w-full">
              <div
                className={[
                  "transition-opacity duration-300 ease-out",
                  imageVisible ? "opacity-100" : "opacity-0",
                ].join(" ")}
              >
                <Image
                  key={`${images[shownIndex].src}-${shownIndex}`}
                  src={images[shownIndex].src}
                  alt={images[shownIndex].alt}
                  width={1400}
                  height={900}
                  className="h-auto w-full object-cover"
                  sizes="(min-width: 1024px) 768px, 92vw"
                  priority
                />
              </div>
            </div>

            {/* Bottom controls bar */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={prev}
                  className="rounded p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandColor"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="rounded p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandColor"
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>

              <p className="font-poppis text-sm font-light text-[#555555]">
                {shownIndex + 1} / {images.length}
              </p>

              <div className="w-12" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
