"use client";
import { useEffect, useRef, useState } from "react";

// Types `parts` out character by character once scrolled into view.
// The full text is rendered invisibly underneath so the layout never jumps.
export default function Typewriter({ parts, speed = 45, className = "" }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const total = parts.reduce((sum, p) => sum + p.text.length, 0);
  const done = count >= total;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setCount(total);
        }
        setStarted(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [total]);

  useEffect(() => {
    if (!started || count >= total) return;
    const id = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(id);
  }, [started, count, total, speed]);

  const label = parts.map((p) => p.text).join("");

  return (
    <span ref={ref} className={`relative block ${className}`} aria-label={label}>
      <span className="invisible" aria-hidden="true">
        {parts.map((p, i) => (
          <span key={i} className={p.className}>
            {p.text}
          </span>
        ))}
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {parts.map((p, i) => {
          const offset = parts
            .slice(0, i)
            .reduce((sum, prev) => sum + prev.text.length, 0);
          const shown = Math.max(0, Math.min(p.text.length, count - offset));
          return (
            <span key={i} className={p.className}>
              {p.text.slice(0, shown)}
            </span>
          );
        })}
        <span
          className={`ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-brandColor ${done ? "animate-pulse" : ""}`}
        />
      </span>
    </span>
  );
}
