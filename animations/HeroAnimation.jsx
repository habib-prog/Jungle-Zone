"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

export default function HeroAnimation() {
  useLayoutEffect(() => {
    const hero = document.querySelector("#hero");
    if (!hero) return;

    const bg = hero.querySelector("[data-hero-bg]");
    const card = hero.querySelector("[data-hero-card]");
    const text = hero.querySelector("[data-hero-text]");
    const visual = hero.querySelector("[data-hero-visual]");

    if (!bg || !card || !text || !visual) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        bg,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.9 }
      )
        .fromTo(
          card,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          text,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          visual,
          { opacity: 0, x: 40, scale: 0.9 },
          { opacity: 1, x: 0, scale: 1, duration: 0.7 },
          "-=0.6"
        );
    }, hero);

    return () => ctx.revert();
  }, []);

  return null;
}
