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

    if (!bg || !card || !text) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        bg,
        { opacity: 1 },
        { opacity: 0, duration: 0.7 }
      )
        .fromTo(
          card,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7 },
          "-=0.2"
        )
        .fromTo(
          text,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 , delay:0.5 }
        );
    }, hero);

    return () => ctx.revert();
  }, []);

  return null;
}
