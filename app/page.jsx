"use client";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Baby,
  ChefHat,
  ClipboardCheck,
  SprayCan,
  ChevronDown,
  HeartHandshake,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Typewriter from "./components/Home/Typewriter";
import HeroStack from "./components/Home/HeroStack";
import { useCallback, useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import gsap from "gsap";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import { getImageUrl } from "@/app/lib/imageUtils";
import { faqData } from "./components/api/fakeApi";
import { services, serviceHref } from "@/app/lib/services";

export default function JungleZone() {
  const [latestBabysitters, setLatestBabysitters] = useState([]);
  const [loadingLatestBabysitters, setLoadingLatestBabysitters] =
    useState(false);
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");
  const [serviceSlug, setServiceSlug] = useState(services[0].slug);
  const [checkTab, setCheckTab] = useState("babysitting");
  const [ctaTab, setCtaTab] = useState("get");

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
          category: serviceSlug,
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
    [serviceSlug],
  );

  const selectedService = services.find((svc) => svc.slug === serviceSlug);
  // Auto-search 600ms after the user stops typing (or changes the service).
  useEffect(() => {
    const timer = setTimeout(
      () => fetchBabysitters(1, postcode),
      postcode.trim() ? 600 : 0,
    );
    return () => clearTimeout(timer);
  }, [postcode, fetchBabysitters]);

  return (
    <>
      <Navbar overlay />
      {/* HERO */}
      <section id="top" className="bg-white">
        <HeroStack>
          <div>
          <h1 data-hero-anim className="mt-5 font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">
            Find local babysitters, cleaners and cooks
          </h1>
          <p data-hero-anim className="mt-4 max-w-xl text-base leading-8 text-white/90 sm:text-lg lg:text-xl">
            Search by postcode and contact independent providers directly. Compare profiles and decide for yourself.
          </p>

          <form
            data-hero-anim
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex max-w-xl flex-col divide-y divide-white/25 overflow-hidden rounded-2xl border border-white/30 bg-brandColor shadow-xl shadow-black/25 focus-within:border-white sm:flex-row sm:divide-x sm:divide-y-0"
          >
            <label className="flex min-h-12 items-center gap-2 px-4 sm:w-2/5">
              <SlidersHorizontal className="h-4 w-4 flex-shrink-0 text-white" />
              <select
                value={serviceSlug}
                onChange={(e) => setServiceSlug(e.target.value)}
                aria-label="Service"
                className="w-full cursor-pointer bg-transparent py-3 text-sm font-medium text-white focus:outline-none"
              >
                {services.map((svc) => (
                  <option key={svc.slug} value={svc.slug} className="text-gray-900">
                    {svc.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-h-12 flex-1 items-center gap-2 px-4">
              <MapPin className="h-4 w-4 flex-shrink-0 text-white" />
              <input
                type="text"
                placeholder="Enter your postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/75 focus:outline-none"
              />
            </label>
          </form>
          {postcodeError && (
            <p className="mt-2 text-xs text-red-100">{postcodeError}</p>
          )}
          <Link
            href={`/babysitters?category=${serviceSlug}`}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brandColor"
          >
            Find {selectedService?.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
          </div>
        </HeroStack>
      </section>

      {/* SERVICES */}
      <section id="services" className="scroll-mt-20 pb-16 pt-8 lg:pb-20 lg:pt-10">
        <div className="container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brandColor/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brandColor">
                <span className="h-1.5 w-1.5 rounded-full bg-brandColor" />
                Our services
              </span>
              <h2 className="font-poppins text-3xl font-semibold leading-[1.1] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                <Typewriter
                  parts={[
                    { text: "Local help," },
                    { text: " whenever you need it.", className: "text-gray-400" },
                  ]}
                />
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-gray-500">
              Starting in London, Manchester and Bristol, expanding to more UK cities.
            </p>
          </div>

          <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[230px] lg:grid-cols-4">
            {services.map((svc) => {
              const { span = "", ...layout } = bentoLayout[svc.slug];
              return (
                <div key={svc.slug} className={span}>
                  <ServiceCard {...svc} {...layout} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 bg-[#07140b] py-20 text-white lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeader
                dark
                eyebrow="How it works"
                parts={[{ text: "Three steps." }, { text: " Clear service pricing.", className: "text-white/40" }]}
                sub="Find a provider, review their hourly rate, and agree service details and payment directly with them."
              />
              <a
                href="#top"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brandColor px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brandColor"
              >
                Start searching
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <ol className="divide-y divide-white/10 border-y border-white/10 lg:col-span-7">
            <StepRow n="01" icon={Search} title="Search" desc="Choose a service and enter your postcode to find independent providers near you." />
            <StepRow n="02" icon={UserCheck} title="Compare" desc="Browse profiles and message providers or request quotes. What a provider says about themselves is their own statement, and JungleZone has not checked it." />
            <StepRow n="03" icon={CalendarCheck} title="Agree details" desc="Agree the hours, service details and payment directly with the provider." />
          </ol>
        </div>
      </section>

      {/* LATEST PROVIDERS */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
            <SectionHeader
              eyebrow={selectedService?.title || "Services"}
              parts={[{ text: "Meet our latest" }, { text: ` ${selectedService?.title?.toLowerCase() || "providers"}.`, className: "text-gray-400" }]}
            />
            <Link
              href={`/babysitters?category=${serviceSlug}`}
              className="inline-flex items-center gap-2 self-start rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-brandColor hover:text-brandColor sm:self-auto"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingLatestBabysitters ? (
            <p className="text-sm text-gray-500">Loading latest providers...</p>
          ) : latestBabysitters.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latestBabysitters.map((item) => (
                <Sitter
                  key={item._id}
                  id={item._id}
                  name={item.fullName}
                  loc={item.zipCode ? `PostCode ${item.zipCode}` : "UK"}
                  rate={item.hourlyRate ? `£${item.hourlyRate}/hr` : "Contact"}
                  img={item.profilePhoto}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-3xl bg-gray-50 p-10 text-center text-sm text-gray-500">
              No providers found in this category. Try another postcode or check back later.
            </p>
          )}

          <p className="mt-8 max-w-3xl text-xs leading-6 text-gray-500">
            <strong className="font-semibold text-gray-700">Please note: </strong>
            JungleZone is an online directory and introduction service. We do not check, verify or vet any provider, employ or supervise providers, supply the services, or guarantee any job. Providers set their own hourly rates, and service payments are arranged directly between users. JungleZone charges platform access fees. Providers are independent, self-employed people or businesses, and a live profile is not approval or endorsement by JungleZone.
          </p>
        </div>
      </section>

      {/* CHECK BEFORE YOU HIRE */}
      <section id="before-you-hire" className="scroll-mt-20 bg-gray-50 py-20 lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Before you hire"
              parts={[{ text: "Check it" }, { text: " yourself.", className: "text-gray-400" }]}
              sub="JungleZone does not check, verify or vet any provider. Providers state their own experience, qualifications, DBS status and insurance, and you should confirm it before any work starts."
            />
            <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Service category">
              {checkLists.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  role="tab"
                  aria-selected={checkTab === c.slug}
                  onClick={() => setCheckTab(c.slug)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    checkTab === c.slug
                      ? "bg-brandColor text-white"
                      : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brandColor"
                  }`}
                >
                  <c.icon className="h-4 w-4" />
                  {c.title}
                </button>
              ))}
            </div>
            <p className="mt-6 text-sm font-medium italic text-gray-500">
              JungleZone publishes what providers write about themselves. It collects no documents and endorses no one.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7" role="tabpanel">
            {checkLists.find((c) => c.slug === checkTab).items.map((item) => (
              <SafetyItem key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container">
          <div className="mb-12 max-w-2xl lg:mb-16">
            <SectionHeader
              eyebrow="Support"
              parts={[{ text: "Questions?" }, { text: " Answered.", className: "text-gray-400" }]}
              sub="Everything you need to know about JungleZone, for parents and babysitters."
            />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <FaqColumn icon={HeartHandshake} title="For Parents" sub="Find childcare that fits your family's needs" faqs={faqData.parentFaqs} id="parent" />
            <FaqColumn icon={BadgeCheck} title="For Babysitters" sub="Start your childcare journey with us" faqs={faqData.babysitterFaqs} id="babysitter" />
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-3xl bg-gray-50 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h3 className="font-poppins text-xl font-semibold text-gray-900">Still have questions?</h3>
              <p className="mt-1 text-sm text-gray-500">Contact our support team and we will be happy to help.</p>
            </div>
            <a
              href="mailto:support@junglezone.uk"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brandColor"
            >
              support@junglezone.uk
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA: get a service / provide a service */}
      <section className="bg-white pb-20 lg:pb-28">
        <div className="container">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-gray-900 px-6 py-14 text-white sm:px-14 lg:py-20">
            {ctaTabs.map((t) => (
              <div
                key={t.slug}
                aria-hidden="true"
                className={`absolute inset-0 -z-20 transition-opacity duration-700 ${ctaTab === t.slug ? "opacity-100" : "opacity-0"}`}
              >
                <Image src={t.image} alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
              </div>
            ))}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07140b]/95 via-[#07140b]/70 to-transparent" />

            <div
              role="tablist"
              aria-label="Get or provide a service"
              className="inline-flex rounded-full bg-white/15 p-1 backdrop-blur"
            >
              {ctaTabs.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  role="tab"
                  aria-selected={ctaTab === t.slug}
                  onClick={() => setCtaTab(t.slug)}
                  className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition ${
                    ctaTab === t.slug ? "bg-white text-brandColor shadow" : "text-white/85 hover:text-white"
                  }`}
                >
                  {t.tab}
                </button>
              ))}
            </div>

            {ctaTabs
              .filter((t) => t.slug === ctaTab)
              .map((t) => (
                <div key={t.slug} role="tabpanel" className="mt-8 max-w-xl animate-[fadeUp_0.5s_ease-out]">
                  <h2 className="font-poppins text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                    {t.title}
                  </h2>
                  <p className="mt-4 text-base text-white/80 lg:text-lg">{t.text}</p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={t.primary.href}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-brandColor px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-brandColor"
                    >
                      {t.primary.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href={t.secondary.href}
                      className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold transition hover:bg-white hover:text-gray-900"
                    >
                      {t.secondary.label}
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// Bento placement + look for each service card (keyed by service slug).
const ctaTabs = [
  {
    slug: "get",
    tab: "Get a service",
    image: "/img/cta-get.jpg",
    title: "Need a hand? Find it near you.",
    text: "Search by postcode, compare provider-set hourly rates, then arrange the service and payment directly.",
    primary: { label: "Find a service", href: "/babysitters" },
    secondary: { label: "Check before you hire", href: "#before-you-hire" },
  },
  {
    slug: "provide",
    tab: "Provide a service",
    image: "/img/cta-provide.jpg",
    title: "Offer a service? Earn on your terms.",
    text: "Create a profile, set your hourly rate, choose your service category and get found by local customers.",
    primary: { label: "Become a provider", href: "/register" },
    secondary: { label: "How it works", href: "#how-it-works" },
  },
];

const checkLists = [
  {
    slug: "babysitting",
    title: "Babysitting",
    icon: Baby,
    items: [
      { icon: ShieldCheck, title: "Ask for ID", desc: "Ask the babysitter or nanny for original identification and confirm it matches their profile." },
      { icon: BadgeCheck, title: "Ask to see a DBS certificate", desc: "JungleZone holds no DBS data. Ask to see the original certificate yourself and check the issue date." },
      { icon: ClipboardCheck, title: "Take references", desc: "Speak to previous families and ask about experience, qualifications and right to work in the UK." },
      { icon: Users, title: "Meet before you book", desc: "Interview or meet them first. You are responsible for anyone you allow into your home." },
    ],
  },
  {
    slug: "cleaning",
    title: "Cleaning",
    icon: SprayCan,
    items: [
      { icon: ShieldCheck, title: "Ask for insurance", desc: "Providers must hold their own public liability insurance. Ask for proof before granting access." },
      { icon: ClipboardCheck, title: "Check responsibilities", desc: "Providers are responsible for COSHH duties around cleaning chemicals and for their own staff." },
      { icon: BadgeCheck, title: "Take references", desc: "Ask previous clients about reliability and quality of work." },
      { icon: Users, title: "Keys and alarm codes", desc: "Giving keys or alarm codes to a cleaner is a matter between you and them. Agree terms first." },
    ],
  },
  {
    slug: "cooking",
    title: "Cooking",
    icon: ChefHat,
    items: [
      { icon: ClipboardCheck, title: "Council registration", desc: "Anyone preparing food for others must be registered as a food business with their local council." },
      { icon: BadgeCheck, title: "Hygiene certificate and rating", desc: "Ask for a Level 2 food hygiene certificate, and a food hygiene rating if they cook from their own premises." },
      { icon: ShieldCheck, title: "Allergens", desc: "Providers must give allergen information. Tell them about any allergies and ask how they are handled." },
      { icon: Users, title: "Ask for references", desc: "Food safety and allergen accuracy are the provider's responsibility. JungleZone checks none of it." },
    ],
  },
];

const bentoLayout = {
  babysitting: { span: "sm:col-span-2 lg:row-span-2", image: "/img/service-babysitting.jpg", big: true },
  cleaning: { span: "lg:col-span-2", image: "/img/service-cleaning.jpg" },
  cooking: { span: "lg:col-span-2", image: "/img/service-cooking-home.jpg", position: "object-[center_35%]" },
};

const toneStyles = {
  light: { box: "border border-gray-200 bg-white hover:border-brandColor", icon: "text-brandColor", title: "text-gray-900", desc: "text-gray-500" },
  tint: { box: "border border-brandColor/15 bg-brandColor/10 hover:border-brandColor", icon: "text-brandColor", title: "text-gray-900", desc: "text-gray-600" },
  green: { box: "bg-brandColor hover:bg-brandColor/90", icon: "text-white", title: "text-white", desc: "text-white/85" },
  dark: { box: "bg-gray-900 hover:bg-gray-800", icon: "text-[#a7d27a]", title: "text-white", desc: "text-white/70" },
  image: { box: "bg-gray-900", icon: "text-white", title: "text-white", desc: "text-white/85" },
};

function ServiceCard({ icon: Icon, title, desc, href, status, image, big, position = "object-center", tone = "light" }) {
  const t = toneStyles[image ? "image" : tone];
  const body = (
    <>
      {image && (
        <>
          <Image src={image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className={`object-cover transition duration-700 group-hover:scale-105 ${position}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        </>
      )}
      <div className="relative flex items-start justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${image ? "bg-white/20 backdrop-blur" : "bg-white/70"} ${t.icon}`}>
          <Icon className="h-6 w-6" />
        </span>
        {href ? (
          <ArrowRight className={`h-5 w-5 transition group-hover:translate-x-1 ${image || tone === "green" || tone === "dark" ? "text-white" : "text-brandColor"}`} />
        ) : (
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase ${tone === "light" || tone === "tint" ? "bg-gray-100 text-gray-500" : "bg-white/20 text-white"}`}>{status}</span>
        )}
      </div>
      <div className="relative">
        <h3 className={`font-poppins font-semibold ${big ? "text-2xl lg:text-3xl" : "text-lg"} ${t.title}`}>{title}</h3>
        <p className={`mt-1 text-sm leading-6 ${big ? "max-w-sm" : ""} ${t.desc}`}>{desc}</p>
      </div>
    </>
  );
  const cls = `group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl p-5 transition ${t.box}`;
  return href ? <Link href={href} className={cls}>{body}</Link> : <div className={cls}>{body}</div>;
}

function SectionHeader({ eyebrow, parts, sub, dark = false }) {
  return (
    <div className="max-w-2xl">
      <span
        className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
          dark ? "bg-white/10 text-[#a7d27a]" : "bg-brandColor/10 text-brandColor"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-[#a7d27a]" : "bg-brandColor"}`} />
        {eyebrow}
      </span>
      <h2
        className={`font-poppins text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl ${
          dark ? "text-white" : "text-gray-900"
        }`}
      >
        <Typewriter parts={parts} />
      </h2>
      {sub && (
        <p className={`mt-5 max-w-lg text-base leading-7 ${dark ? "text-white/65" : "text-gray-500"}`}>{sub}</p>
      )}
    </div>
  );
}

function StepRow({ n, icon: Icon, title, desc }) {
  return (
    <li className="group flex items-start gap-5 py-8 sm:gap-8 lg:py-10">
      <span className="font-poppins text-5xl font-semibold leading-none text-white/20 transition group-hover:text-brandColor sm:text-6xl">
        {n}
      </span>
      <div className="flex-1">
        <h3 className="font-poppins text-xl font-semibold sm:text-2xl">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-7 text-white/60 sm:text-base">{desc}</p>
      </div>
      <span className="hidden h-12 w-12 flex-shrink-0 place-items-center rounded-full border border-white/15 text-[#a7d27a] transition group-hover:border-brandColor group-hover:bg-brandColor group-hover:text-white sm:grid">
        <Icon className="h-5 w-5" />
      </span>
    </li>
  );
}

function FaqColumn({ icon: Icon, title, sub, faqs, id }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brandColor/10 text-brandColor">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-poppins text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{sub}</p>
        </div>
      </div>
      <Accordion allowMultiple transition transitionTimeout={200} className="space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={`${id}-${index}`}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-brandColor/40"
            header={({ state }) => (
              <div className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4">
                <span className="text-left text-sm font-medium text-gray-900 sm:text-[15px]">{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
                    state.isEnter ? "rotate-180 text-brandColor" : "text-gray-400"
                  }`}
                />
              </div>
            )}
          >
            <div className="px-5 pb-5 text-sm leading-relaxed text-gray-600">{faq.answer}</div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function Sitter({ id, name, loc, rate, img }) {
  return (
    <Link
      href={`/babysitters/${id}`}
      className="group block overflow-hidden rounded-3xl bg-gray-50 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brandColor/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          src={getImageUrl(img) ?? "/img/user-placeholder.svg"}
          alt={name}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brandColor shadow">
          {rate}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="min-w-0">
          <div className="truncate font-poppins text-base font-semibold text-gray-900">{name}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-brandColor" />
            <span>{loc}</span>
          </div>
        </div>
        <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-white text-gray-400 transition group-hover:bg-brandColor group-hover:text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function SafetyItem({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-gray-200 transition hover:ring-brandColor/50">
      <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-brandColor/10 text-brandColor">
        <Icon className="h-5 w-5" />
      </span>
      <h4 className="font-poppins text-base font-semibold text-gray-900">{title}</h4>
      <p className="mt-1.5 text-sm leading-6 text-gray-500">{desc}</p>
    </div>
  );
}
