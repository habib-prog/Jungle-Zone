"use client";
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import Image from 'next/image';
import gsap from 'gsap';
import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';
import { getImageUrl } from '@/app/lib/imageUtils';
import { faqData } from './components/api/fakeApi';

export default function JungleZone() {
  const heroImages = [
    "/img/frontPageImg.jpg",
    "/img/frontPageImg2.jpg",
    "/img/frontPageImg3.jpg"
  ];

  const [latestBabysitters, setLatestBabysitters] = useState([]);
  const [loadingLatestBabysitters, setLoadingLatestBabysitters] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");

  useEffect(() => {
    const container = document.querySelector('.hero-slider-container');
    if (!container) return;

    const totalSlides = heroImages.length + 1; // including clone

    const tl = gsap.timeline({ repeat: -1 });

    // Set initial position
    gsap.set(container, { x: 0 });

    // Wait on first image, then slide through each subsequent image with wait
    tl.to({}, { duration: 2 });

    for (let i = 1; i < totalSlides; i++) {
      tl.to(container, {
        x: `-${i * 100}%`,
        duration: 3,
        ease: 'none',
      });
      if (i < totalSlides - 1) {
        tl.to({}, { duration: 2 }); 
      }
    }

    // Reset to start instantly for seamless loop
    tl.set(container, { x: 0 });

    return () => tl.kill();
  }, []);

  const fetchBabysitters = useCallback(async (page = 1, searchPostcode = "") => {
    try {
      setLoadingLatestBabysitters(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "3",
      });

      if (searchPostcode.trim()) {
        params.set("zipCode", searchPostcode.trim());
      }

      const res = await fetch(`/api/babysitters/findBabySitters?${params.toString()}`);
      const result = await res.json();

      if (res.ok) {
        setLatestBabysitters(result.data || []);
        setPostcodeError("");
      } else {
        setPostcodeError(result.error || "Failed to fetch latest babysitters");
        setLatestBabysitters([]);
      }
    } catch (error) {
      setPostcodeError(error.message || "Failed to fetch latest babysitters");
      setLatestBabysitters([]);
    } finally {
      setLoadingLatestBabysitters(false);
    }
  }, []);

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
      <section className="pt-30 pb-10 lg:py-30 relative overflow-hidden">
        {/* Sliding Background Images */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="hero-slider-container flex h-full">
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
                  className="object-cover"
                  quality={80}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))}
            {/* Clone first image for seamless loop */}
            <div className="hero-bg-image w-full h-full flex-shrink-0 relative">
              <Image
                src={heroImages[0]}
                alt="Hero background 1"
                fill
                className="object-cover"
                quality={80}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </div>
        </div>

        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
          <div>
            <h1 className="text-4xl lg:text-6xl leading-tight mb-4 lg:mb-6 text-white">
              Trusted Childcare,
              <br />
              <span className="text-brandColor italic">
                Close to Home
              </span>
            </h1>

            <p className="text-white max-w-lg mb-6 lg:mb-8 text-base lg:text-lg">
              Connect with DBS-checked, verified babysitters near you. Safe,
              reliable childcare — Every sitter is DBS-checked and identity-verified. So you can relax.<br />
              Trusted by families in London, Manchester, Bristol.
            </p>

            <div className="flex flex-col lg:flex-row gap-4 mb-8 lg:mb-10">
              <Link href={"/register"}>
                <button className="px-6 lg:px-8 py-3 lg:py-4 text-white bg-brandColor rounded-full shadow-lg hover:scale-105 transition w-full sm:w-auto cursor-pointer">
                  Get Started
                </button>
              </Link>
              <Link href={"/babysitters"}>
                <button className="px-6 lg:px-8 py-3 lg:py-4 text-white bg-black/70 hover:bg-brandColor rounded-full shadow-lg transition w-full sm:w-auto cursor-pointer">
                  Browse Babysitters
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE CARDS */}
          <div className="relative p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-brandColor/50 backdrop-blur-lg bg-black/20 shadow-lg">
            <div className="text-xs uppercase text-brandColor mb-3">
              Find a sitter near you
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="flex items-stretch gap-2 mb-2 lg:mb-3">
                <input
                  type="text"
                  placeholder="Enter postcode..."
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="w-full px-4 py-2 lg:py-2 border border-white rounded-lg focus:outline-none text-white text-sm lg:text-base"
                />
                <button type="submit" className="px-4 lg:px-5 py-2 text-white bg-brandColor rounded-lg shadow hover:scale-105 transition whitespace-nowrap">
                  Search
                </button>
              </div>
              {postcodeError && (
                <p className="text-red-200 text-xs mb-3">
                  {postcodeError}
                </p>
              )}
            </form>

            <div className="flex flex-col gap-3">
              {loadingLatestBabysitters ? (
                <div className="text-white">Loading latest sitters...</div>
              ) : latestBabysitters.length > 0 ? (
                latestBabysitters.map((item) => (
                  <Sitter
                    key={item._id}
                    name={item.fullName}
                    loc={item.zipCode ? `PostCode ${item.zipCode}` : "UK"}
                    rate={item.hourlyRate ? `£${item.hourlyRate}/hr` : "Contact"}
                    img={item.profilePhoto}
                  />
                ))
              ) : (
                <p className="text-center text-white">
                  No Sitters Found. Try expanding your search or check back later for new sitters joining JungleZone.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-10 lg:mb-14">
            <div className="text-xs tracking-widest text-brandColor uppercase mb-2">
              Our Promise
            </div>

            <h2 className="text-3xl lg:text-4xl">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <ValueCard
              title="Trust"
              desc="Every babysitter is identity-verified and DBS-checked."
            />
            <ValueCard
              title="Care"
              desc="Personalized childcare tailored to your family's needs."
            />
            <ValueCard
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
              Your Child's Safety is Our Priority
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
              Everything you need to know about JungleZone — for parents and babysitters.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            {/* Parents FAQ */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">For Parents</h3>
                <p className="text-gray-500">Find childcare that fits your family's needs</p>
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
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">For Babysitters</h3>
                <p className="text-gray-500">Start your childcare journey with us</p>
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

        <div className='text-center mt-5 space-y-3'>
          <h3 className='text-3xl text-brandColor font-bold'>Still have questions?</h3>
          <p>Contact our support team and we will be happy to help.</p>
          <p className='text-brandColor text-bold text-lg'>support@junglezone.uk | junglezone.uk</p>
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
            <Link href={'/register'}>
              <button className="cursor-pointer px-6 lg:px-8 py-3 lg:py-4 bg-white text-brandColor rounded-full shadow-lg hover:scale-105 transition w-full sm:w-auto">
                Create Free Account
              </button>
            </Link>
            <Link href={'/babysitters'}>
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
      <div className="text-2xl lg:text-3xl text-brandColor font-semibold">{num}</div>
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

function Sitter({ name, loc, rate, img }) {
  return (
    <div className=" backdrop-blur-2xl bg-black/20 border border-brandColor cursor-pointer rounded-xl p-3 lg:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition gap-3 sm:gap-0">
      <div className="flex items-center gap-3 lg:gap-4">
        <img
          loading='lazy'
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-white"
          src={getImageUrl(img) ?? "/img/user-placeholder.svg"}
          alt="image" />
        <div className='text-white'>
          <div className="font-medium text-sm lg:text-base">{name}</div>
          <div className="text-xs">{loc}</div>
        </div>
      </div>

      <div className="text-right flex sm:block items-center gap-2 sm:gap-0">
        <div className="text-xs bg-brandColor text-white px-2 py-1 rounded-full whitespace-nowrap">
          DBS Checked
        </div>
        <div className="text-sm text-white mt-1 sm:mt-1">{rate}</div>
      </div>
    </div>
  );
}

function ValueCard({ title, desc }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition border">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-brandColor/20 rounded-xl md:rounded-2xl mb-4 md:mb-6"></div>
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
