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
  const [latestBabysitters, setLatestBabysitters] = useState([]);
  const [loadingLatestBabysitters, setLoadingLatestBabysitters] =
    useState(false);
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated hero header entrance
      const headerTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2,
      });
      headerTl.from("[data-hero-anim]", {
        opacity: 0,
        y: 28,
        filter: "blur(8px)",
        duration: 0.8,
        stagger: 0.12,
      });
    });

    return () => ctx.revert();
  }, []);

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
      <section className="relative overflow-hidden pt-16 pb-6 sm:pt-20 sm:pb-10 lg:min-h-[640px] lg:py-24">
        {/* Static Background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/img/frontPageImg.jpg"
            alt="Hero background"
            fill
            priority
            className="object-cover"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
        </div>
        {/* Blurred backdrop for content legibility */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.2)_45%,rgba(255,255,255,0.95)_100%)]" />

        <div className="container relative z-10 flex flex-col items-center justify-center gap-6 px-4 py-6 sm:px-6 md:py-8 lg:grid lg:grid-cols-[1.08fr_0.92f r] lg:gap-16 lg:py-0">
          <div className="max-w-lg">
            <div data-hero-anim className="mt-6 sm:mt-4 mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-poppins text-xs font-semibold uppercase text-white shadow-lg backdrop-blur-md">
              <Search className="h-4 w-4 text-brandColor" />
              Online Introduction Platform
            </div>

            <h1 data-hero-anim className="mb-4 max-w-3xl font-poppins text-[clamp(2rem,9vw,4.5rem)] font-bold leading-[1.05] text-white lg:mb-6">
              Find Local Babysitters,
              <br />
              <span className="bg-gradient-to-r from-brandColor to-[#a7d27a] bg-clip-text text-transparent">All in One Place</span>
            </h1>

            <p data-hero-anim className="mb-6 max-w-xl font-poppins text-sm leading-7 text-white/85 sm:text-base lg:mb-7 lg:text-lg lg:leading-8">
              JungleZone is an online introduction platform that helps parents and independent babysitters find and connect with each other. Browse profiles, compare information and connect directly with babysitters in your area.
            </p>

            <div data-hero-anim className="mb-4 flex flex-col gap-3 sm:flex-row">
              <Link href={"/babysitters"} className="w-full sm:w-auto">
                <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brandColor px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-brandColor/90 lg:px-8">
                  Browse Babysitters
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href={"/register-babysitter"} className="w-full sm:w-auto">
                <button className="w-full cursor-pointer rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:text-gray-900 lg:px-8">
                  Join as a Babysitter
                </button>
              </Link>
            </div>

            <div data-hero-anim className="mb-6 rounded-2xl border border-white/15 bg-black/30 p-3.5 text-xs text-white/90 backdrop-blur-md max-w-xl">
              <strong className="font-semibold text-brandColor">Platform Disclaimer: </strong>
              JungleZone is an introduction platform only. We do not provide childcare services, employ babysitters, carry out DBS or background checks, or guarantee the suitability of any user.
            </div>

            <div data-hero-anim className="grid max-w-xl grid-cols-1 gap-3 text-white sm:grid-cols-3">
              <HeroMetric icon={HeartHandshake} label="Direct Connections" />
              <HeroMetric icon={Clock3} label="Direct Arrangements" />
              <HeroMetric icon={Search} label="Fast Local Search" />
            </div>
          </div>

          {/* RIGHT SIDE CARDS */}
          <div className="relative w-full min-w-0 overflow-hidden rounded-3xl border border-white/25 bg-white/10 p-3.5 shadow-2xl shadow-black/30 backdrop-blur-3xl sm:p-5 lg:p-6">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase text-brandColor">
                  Featured sitters
                </div>
                <p className="mt-1 text-sm text-white/70">
                  Search by postcode or view latest babysitter profiles.
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

      {/* HOW JUNGLEZONE WORKS */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-10 lg:mb-14">
            <div className="text-xs tracking-widest text-brandColor uppercase mb-2 font-semibold">
              Platform Introduction
            </div>

            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-gray-900">How JungleZone Works</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <ValueCard
              icon={HeartHandshake}
              title="Simple Connections"
              desc="Find and connect with independent babysitters in your area."
            />
            <ValueCard
              icon={Search}
              title="Choice"
              desc="Browse profiles and decide for yourself who may be suitable for your family's needs."
            />
            <ValueCard
              icon={Clock3}
              title="Direct Arrangements"
              desc="Parents and babysitters agree childcare arrangements, rates and payments directly with each other."
            />
          </div>
        </div>
      </section>

      {/* MAKE AN INFORMED CHOICE */}
      <section className="py-16 lg:py-24 bg-brandColor/5">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 lg:mb-14">
            <div className="text-xs tracking-widest text-brandColor uppercase mb-2 font-semibold">
              Parent Guidance
            </div>

            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-gray-900">
              Make an Informed Choice
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              JungleZone provides an online platform for introductions only. We encourage parents and guardians to carry out their own checks before engaging a babysitter.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <SafetyItem
              title="Check Identity"
              desc="Ask the babysitter to provide appropriate identification."
            />

            <SafetyItem
              title="Check DBS Information"
              desc="Where relevant to you, ask to see the babysitter's current DBS certificate or other appropriate evidence."
            />

            <SafetyItem
              title="Check References & Experience"
              desc="Consider checking references, qualifications and previous childcare experience."
            />

            <SafetyItem
              title="Meet Before Engaging"
              desc="Parents should consider interviewing or meeting a babysitter before making their own childcare arrangement."
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500 font-medium italic">
              JungleZone does not conduct or verify these checks on behalf of users.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-10 lg:mb-16">
            <div className="text-xs tracking-widest text-brandColor uppercase mb-2 font-semibold">
              Support
            </div>
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Everything you need to know about JungleZone — for parents and
              babysitters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Parents FAQ */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brandColor/15 text-brandColor">
                  <HeartHandshake className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    For Parents
                  </h3>
                  <p className="text-xs text-gray-500">
                    Find childcare that fits your family&apos;s needs
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Accordion allowMultiple transition transitionTimeout={200}>
                  {faqData.parentFaqs.map((faq, index) => (
                    <AccordionItem
                      key={`parent-${index}`}
                      header={
                        <div className="w-full flex justify-between items-center gap-3 px-4 sm:px-5 py-4 cursor-pointer hover:bg-brandColor/5 transition-colors duration-200">
                          <span className="text-sm sm:text-[15px] font-medium text-gray-800 text-left">
                            {faq.question}
                          </span>
                          <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400 acc-caret transition-transform duration-200" />
                        </div>
                      }
                    >
                      <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* Babysitter FAQ */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brandColor/15 text-brandColor">
                  <BadgeCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    For Babysitters
                  </h3>
                  <p className="text-xs text-gray-500">
                    Start your childcare journey with us
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Accordion allowMultiple transition transitionTimeout={200}>
                  {faqData.babysitterFaqs.map((faq, index) => (
                    <AccordionItem
                      key={`babysitter-${index}`}
                      header={
                        <div className="w-full flex justify-between items-center gap-3 px-4 sm:px-5 py-4 cursor-pointer hover:bg-brandColor/5 transition-colors duration-200">
                          <span className="text-sm sm:text-[15px] font-medium text-gray-800 text-left">
                            {faq.question}
                          </span>
                          <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400 acc-caret transition-transform duration-200" />
                        </div>
                      }
                    >
                      <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>

          {/* Still have questions CTA */}
          <div className="mt-12 lg:mt-16 mx-auto max-w-xl rounded-2xl border border-brandColor/20 bg-white p-6 sm:p-8 text-center shadow-sm">
            <h3 className="text-xl sm:text-2xl font-poppins font-bold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Contact our support team and we will be happy to help.
            </p>
            <a
              href="mailto:support@junglezone.uk"
              className="inline-flex items-center gap-2 rounded-full bg-brandColor px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brandColor/90"
            >
              support@junglezone.uk
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brandColor"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="container relative text-white px-4">
          <h2 className="text-3xl lg:text-5xl font-serif mb-4 lg:mb-6">
            Ready to Connect with Local Babysitters?
          </h2>

          <p className="mb-8 lg:mb-10 text-white/80 text-base lg:text-lg max-w-2xl mx-auto">
            Discover independent babysitters in your area, review profiles, and agree arrangements directly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 lg:gap-4">
            <Link href={"/babysitters"}>
              <button className="cursor-pointer px-6 lg:px-8 py-3 lg:py-4 bg-white text-brandColor font-semibold rounded-full shadow-lg hover:scale-105 transition w-full sm:w-auto">
                Browse Babysitters
              </button>
            </Link>
            <Link href={"/register-babysitter"}>
              <button className="cursor-pointer px-6 lg:px-8 py-3 lg:py-4 border border-white font-semibold rounded-full hover:bg-white hover:text-brandColor transition w-full sm:w-auto">
                Join as a Babysitter
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
        <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs">
          Active Profile
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
