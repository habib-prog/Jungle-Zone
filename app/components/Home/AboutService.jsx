// components/Home/AboutService.jsx
"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

export default function AboutService() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
      offset: 80,
    });
  }, []);

  const services = [
    {
      title: "Trust",
      desc: "Verified sitters you can rely on for every booking, every time.",
      img: "/img/trust.png",
      aos: "fade-up",
      delay: 0,
    },
    {
      title: "Care",
      desc: "Warm, attentive childcare tailored to your child’s routine and needs.",
      img: "/img/care.png",
      aos: "fade-up",
      delay: 150,
    },
    {
      title: "Joy",
      desc: "Playful activities that keep kids happy, safe, and engaged.",
      img: "/img/joy.png",
      aos: "fade-up",
      delay: 300,
    },
  ];

  return (
    <section className="w-full py-10 sm:py-14" aria-label="About Service">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {services.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4"
              data-aos={item.aos}
              data-aos-delay={item.delay}
            >
              <div className="shrink-0">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                  priority={false}
                />
              </div>

              <div>
                <h3 className="font-poppis text-2xl font-medium leading-7 tracking-wide text-gray-900">
                  {item.title.toUpperCase()}
                </h3>
                <p className="mt-2 font-poppis text-sm font-light leading-6 text-gray-600">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
