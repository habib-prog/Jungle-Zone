"use client";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Clock3,
  HeartHandshake,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import Image from "next/image";
import gsap from "gsap";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import { getImageUrl } from "@/app/lib/imageUtils";
import { faqData } from "./components/api/fakeApi";

export default function JungleZone() {
  const heroImages = [
    "/img/frontPageImg.jpg",
    "/img/frontPageImg2.jpg",
    "/img/frontPageImg3.jpg",
  ];

  const [latestBabysitters, setLatestBabysitters] = useState([]);
  const [loadingLatestBabysitters, setLoadingLatestBabysitters] =
    useState(false);
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");

  useEffect(() => {
    const container = document.querySelector(".hero-slider-container");
    if (!container) return;

    const totalSlides = heroImages.length + 1; // including clone

    const tl = gsap.timeline({ repeat: -1 });

    // Set initial position
    gsap.set(container, { x: 0 });
    gsap.set(".hero-bg-image img", { scale: 1.04 });

    const zoomTween = gsap.to(".hero-bg-image img", {
      scale: 1.12,
      duration: 18,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Wait on first image, then slide through each subsequent image with wait
    tl.to({}, { duration: 4 });

    for (let i = 1; i < totalSlides; i++) {
      tl.to(container, {
        x: `-${i * 100}%`,
        duration: 5,
        ease: "power2.inOut",
      });
      if (i < totalSlides - 1) {
        tl.to({}, { duration: 4 });
      }
    }

    // Reset to start instantly for seamless loop
    tl.set(container, { x: 0 });

    return () => {
      tl.kill();
      zoomTween.kill();
    };
  }, [heroImages.length]);

  const fetchBabysitters = useCallback(
    async (page = 1, searchPostcode = "") => {
      try {
        setLoadingLatestBabysitters(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: "3",
        });

        if (searchPostcode.trim()) {
          params.set("zipCode", searchPostcode.trim());
        }

        const res = await fetch(`/api/babysitters/latest?${params.toString()}`);
        const result = await res.json();

        if (res.ok) {
          setLatestBabysitters(result.data || []);
          setPostcodeError("");
        } else {
          setPostcodeError(
            result.error || "Failed to fetch latest babysitters",
          );
          setLatestBabysitters([]);
        }
      } catch (error) {
        setPostcodeError(error.message || "Failed to fetch latest babysitters");
        setLatestBabysitters([]);
      } finally {
        setLoadingLatestBabysitters(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchBabysitters(1);
  }, [fetchBabysitters]);

  const handleSearch = () => {
    const normalizedPostcode = postcode.trim();

    if (!normalizedPostcode) {
      setPostcodeError("Please enter a postcode.");
      return;
    }

    setPostcodeError("");
    fetchBabysitters(1, normalizedPostcode);
  };

  return (
    <>
      <Navbar />
      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-14 lg:min-h-[720px] lg:py-32">
        {/* Sliding Background Images */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="hero-slider-container flex h-full will-change-transform">
            {heroImages.map((img, index) => (
              <div
                key={index}
                className="hero-bg-image w-full h-full flex-shrink-0 relative"
              >
                <Image
                  src={img}
                  alt={`Hero background ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover will-change-transform"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
              </div>
            ))}
            {/* Clone first image for seamless loop */}
            <div className="hero-bg-image w-full h-full flex-shrink-0 relative">
              <Image
                src={heroImages[0]}
                alt="Hero background 1"
                fill
                className="object-cover will-change-transform"
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.08)_45%,rgba(255,255,255,0.95)_100%)]" />

        <div className="container relative z-10 grid grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase text-white shadow-lg backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-brandColor" />
              Verified childcare network
            </div>

            <h1 className="mb-4 max-w-3xl text-[clamp(2.35rem,10vw,4.5rem)] font-semibold leading-[1.04] text-white lg:mb-6">
              Find trusted childcare
              <br />
              <span className="text-brandColor">close to home</span>
            </h1>

            <p className="mb-7 max-w-xl text-sm leading-7 text-white/85 sm:text-base lg:mb-9 lg:text-lg lg:leading-8">
              Browse approved babysitters, compare local rates, and choose care
              with confidence. Built for families who want safety, clarity, and
              a calmer way to find help nearby.
            </p>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <Link href={"/register"} className="w-full sm:w-auto">
                <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brandColor px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-brandColor/90 lg:px-8">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href={"/babysitters"} className="w-full sm:w-auto">
                <button className="w-full cursor-pointer rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:text-gray-900 lg:px-8">
                  Browse Babysitters
                </button>
              </Link>
            </div>

            <div className="grid max-w-xl grid-cols-1 gap-3 text-white sm:grid-cols-3">
              <HeroMetric icon={ShieldCheck} label="DBS checked" />
              <HeroMetric icon={BadgeCheck} label="Identity verified" />
              <HeroMetric icon={Clock3} label="Fast local search" />
            </div>
          </div>

          {/* RIGHT SIDE CARDS */}
          <div className="relative w-full min-w-0 overflow-hidden rounded-3xl border border-white/20 bg-white/[0.16] p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-5 lg:p-6">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase text-brandColor">
                  Featured sitters
                </div>
                <p className="mt-1 text-sm text-white/70">
                  Search by postcode or view latest approved profiles.
                </p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-white">
                <Search className="h-5 w-5" />
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div className="mb-2 flex flex-col gap-2 sm:flex-row lg:mb-3">
                <label className="flex min-h-12 flex-1 items-center gap-2 rounded-2xl border border-white/15 bg-black/20 px-4 text-white shadow-inner shadow-black/10">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-brandColor" />
                  <input
                    type="text"
                    placeholder="Enter postcode..."
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/45 focus:outline-none lg:text-base"
                  />
                </label>
                <button
                  type="submit"
                  className="min-h-12 rounded-2xl bg-brandColor px-5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-brandColor/90 whitespace-nowrap"
                >
                  Search
                </button>
              </div>
              {postcodeError && (
                <p className="text-red-200 text-xs mb-3">{postcodeError}</p>
              )}
            </form>

            <div className="flex flex-col gap-3">
              {loadingLatestBabysitters ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/80">
                  Loading latest sitters...
                </div>
              ) : latestBabysitters.length > 0 ? (
                latestBabysitters.map((item) => (
                  <Sitter
                    key={item._id}
                    id={item._id}
                    name={item.fullName}
                    loc={item.zipCode ? `PostCode ${item.zipCode}` : "UK"}
                    rate={
                      item.hourlyRate ? `£${item.hourlyRate}/hr` : "Contact"
                    }
                    img={item.profilePhoto}
                  />
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-sm text-white/80">
                  No Sitters Found. Try expanding your search or check back
                  later for new sitters joining JungleZone.
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/80">
              <span>Need more options?</span>
              <Link
                href="/babysitters"
                className="inline-flex items-center gap-1 font-semibold text-brandColor"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="container relative z-10 mt-10 hidden items-center gap-3 px-4 sm:px-6 lg:flex">
          <span className="h-px w-16 bg-white/35" />
          <span className="h-2 w-8 rounded-full bg-brandColor" />
          <span className="h-2 w-2 rounded-full bg-white/45" />
          <span className="h-2 w-2 rounded-full bg-white/45" />
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-10 lg:mb-14">
            <div className="text-xs tracking-widest text-brandColor uppercase mb-2">
              Our Promise
            </div>

            <h2 className="text-3xl lg:text-4xl">What We Stand For</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <ValueCard
              icon={ShieldCheck}
              title="Trust"
              desc="Every babysitter is identity-verified and DBS-checked."
            />
            <ValueCard
              icon={HeartHandshake}
              title="Care"
              desc="Personalized childcare tailored to your family's needs."
            />
            <ValueCard
              icon={Clock3}
              title="Reliability"
              desc="Dependable sitters who show up on time."
            />
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="py-16 lg:py-24 bg-brandColor/5">
        <div className="container">
          <div className="text-center mb-10 lg:mb-14">
            <div className="text-xs tracking-widest text-brandColor uppercase mb-2">
              Safety First
            </div>

            <h2 className="text-3xl lg:text-4xl">
              Your Child&apos;s Safety is Our Priority
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <SafetyItem
              title="Verified Profiles"
              desc="Every babysitter completes identity verification."
            />

            <SafetyItem
              title="DBS Background Checks"
              desc="All sitters pass official UK screenings."
            />

            <SafetyItem
              title="Ratings & Reviews"
              desc="Honest feedback from real families."
            />

            <SafetyItem
              title="Secure Messaging"
              desc="Encrypted communication platform."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-serif text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mt-2">
              Everything you need to know about JungleZone — for parents and
              babysitters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Parents FAQ */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  For Parents
                </h3>
                <p className="text-gray-500">
                  Find childcare that fits your family&apos;s needs
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded overflow-hidden">
                <Accordion allowMultiple transition transitionTimeout={200}>
                  {faqData.parentFaqs.map((faq, index) => (
                    <AccordionItem
                      key={`parent-${index}`}
                      header={
                        <div className="w-full flex justify-between items-center gap-2 px-6 py-5 cursor-pointer hover:bg-brandColor/20 duration-200">
                          <span className="text-sm lg:text-[16px] font-medium text-gray-800">
                            {faq.question}
                          </span>
                          <ChevronDown className="text-gray-400 acc-caret" />
                        </div>
                      }
                    >
                      <div className="px-6 pb-3 text-xs lg:text-sm text-gray-600 border-t border-gray-100 leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* Babysitter FAQ */}
            <div>
              <div className="text-center mb-8">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  For Babysitters
                </h3>
                <p className="text-gray-500">
                  Start your childcare journey with us
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded overflow-hidden">
                <Accordion allowMultiple transition transitionTimeout={200}>
                  {faqData.babysitterFaqs.map((faq, index) => (
                    <AccordionItem
                      key={`babysitter-${index}`}
                      header={
                        <div className="min-w-full flex justify-between items-center gap-2 px-6 py-5 cursor-pointer hover:bg-brandColor/20 duration-200">
                          <span className="text-sm lg:text-[16px] font-medium text-gray-800">
                            {faq.question}
                          </span>
                          <ChevronDown className="text-gray-400 acc-caret" />
                        </div>
                      }
                    >
                      <div className="px-6 pb-3 text-xs lg:text-sm text-gray-600 border-t border-gray-100 leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-5 space-y-3">
          <h3 className="text-3xl text-brandColor font-bold">
            Still have questions?
          </h3>
          <p>Contact our support team and we will be happy to help.</p>
          <p className="text-brandColor text-bold text-lg">
            support@junglezone.uk | junglezone.uk
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brandColor"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="container relative text-white px-4">
          <h2 className="text-3xl lg:text-5xl font-serif mb-4 lg:mb-6">
            Ready to Find Your Perfect Babysitter?
          </h2>

          <p className="mb-8 lg:mb-10 text-white/80 text-base lg:text-lg">
            Join thousands of UK families who trust JungleZone
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 lg:gap-4">
            <Link href={"/register"}>
              <button className="cursor-pointer px-6 lg:px-8 py-3 lg:py-4 bg-white text-brandColor rounded-full shadow-lg hover:scale-105 transition w-full sm:w-auto">
                Create Free Account
              </button>
            </Link>
            <Link href={"/babysitters"}>
              <button className="cursor-pointer px-6 lg:px-8 py-3 lg:py-4 border border-white rounded-full hover:bg-white hover:text-brandColor transition w-full sm:w-auto">
                Browse Babysitters
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Stat({ num, label }) {
  return (
    <div>
      <div className="text-2xl lg:text-3xl text-brandColor font-semibold">
        {num}
      </div>
      <div className="text-xs lg:text-sm text-white">{label}</div>
    </div>
  );
}

function StatBig({ num, label }) {
  return (
    <div>
      <div className="text-3xl lg:text-4xl text-brandColor">{num}</div>
      <div className="text-xs lg:text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function HeroMetric({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-sm font-medium shadow-lg shadow-black/10 backdrop-blur-md">
      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-brandColor/20 text-brandColor">
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </div>
  );
}

function Sitter({ id, name, loc, rate, img }) {
  return (
    <Link
      href={`/babysitters/${id}`}
      className="group flex cursor-pointer flex-col items-start justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 p-3.5 shadow-sm backdrop-blur-2xl transition hover:-translate-y-1 hover:border-brandColor/70 hover:bg-white/15 hover:shadow-xl sm:flex-row sm:items-center lg:p-4"
    >
      <div className="flex min-w-0 items-center gap-3 lg:gap-4">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-white/20 ring-1 ring-white/20 lg:h-14 lg:w-14">
          <img
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            src={getImageUrl(img) ?? "/img/user-placeholder.svg"}
            alt={name}
          />
        </div>
        <div className="min-w-0 text-white">
          <div className="truncate text-sm font-semibold lg:text-base">
            {name}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-white/70">
            <MapPin className="h-3.5 w-3.5 text-brandColor" />
            <span>{loc}</span>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-col sm:items-end">
        <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-800">
          <ShieldCheck className="h-3.5 w-3.5 text-brandColor" />
          DBS Checked
        </div>
        <div className="text-sm font-semibold text-white">{rate}</div>
      </div>
    </Link>
  );
}

function ValueCard({ icon: Icon, title, desc }) {
  return (
    <div className="group border bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:border-brandColor/40 hover:shadow-2xl md:p-8">
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brandColor/15 text-brandColor transition group-hover:bg-brandColor group-hover:text-white">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm md:text-base">{desc}</p>
    </div>
  );
}

function SafetyItem({ title, desc }) {
  return (
    <div className="bg-white p-5 md:p-7 rounded-2xl md:rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition border flex gap-3 md:gap-4">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-brandColor/20 rounded-lg md:rounded-xl flex-shrink-0"></div>
      <div>
        <h4 className="font-semibold mb-1 text-sm md:text-base">{title}</h4>
        <p className="text-gray-500 text-xs md:text-sm">{desc}</p>
      </div>
    </div>
  );
}
