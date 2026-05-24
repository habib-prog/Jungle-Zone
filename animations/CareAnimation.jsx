// animations/CareAnimation.jsx
"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CareAnimation() {
  useLayoutEffect(() => {
    const section = document.querySelector("#care");
    if (!section) return;

    const imageWrap = section.querySelector("[data-care-image]");
    const heading = section.querySelector("[data-care-heading]");
    const line = section.querySelector("[data-care-line]");
    const body = section.querySelector("[data-care-body]");
    const cta = section.querySelector("[data-care-cta]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      /* IMAGE: width reveal from right (NO zoom) */
      tl.from(
        imageWrap,
        { width: 0 , opacity:0 , height:472 , duration:1 , delay:0.5  }
      )

        /* TEXT: smooth, slower, step-by-step */
        .fromTo(
          heading,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.8"
        )
        .fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4 },
          "-=0.4"
        )
        .fromTo(
          body,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          cta,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.25"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return null;
}
