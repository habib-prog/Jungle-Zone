"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FiShare2,
  FiHeart,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiAward,
  FiBookOpen,
  FiGlobe,
  FiTruck,
  FiSmile,
  FiHome,
  FiUser,
  FiClock,
} from "react-icons/fi";
import gsap from "gsap";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

const Page = () => {
  const sectionRef = useRef(null);
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [viewer, setViewer] = useState({
    isLoggedIn: false,
    role: null,
    hasActiveSubscription: false,
    canSeeContact: false,
  });
  const [contactRevealed, setContactRevealed] = useState(false);

  const moreBabysitters = [];

  const formatDate = (date) => {
    if (!date) return "Unmentioned";
    const dateValue = date?.$date ? new Date(date.$date) : new Date(date);
    return dateValue.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const formatUpdatedDate = (date) => {
    if (!date) return "Unmentioned";
    const dateValue = date?.$date ? new Date(date.$date) : new Date(date);
    return `Updated: ${dateValue.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
  };

  const buildAvailability = (dbAvailability = []) => {
    if (!dbAvailability.length) return [];

    const orderedDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const getDayData = (dayName) =>
      dbAvailability.find((item) => item.day === dayName) || {};

    return [
      {
        label: "Morning",
        values: orderedDays.map((day) => !!getDayData(day)?.timeSlots?.morning),
      },
      {
        label: "Afternoon",
        values: orderedDays.map(
          (day) => !!getDayData(day)?.timeSlots?.afternoon,
        ),
      },
      {
        label: "Evening",
        values: orderedDays.map((day) => !!getDayData(day)?.timeSlots?.evening),
      },
      {
        label: "Night",
        values: orderedDays.map((day) => !!getDayData(day)?.timeSlots?.night),
      },
    ];
  };

  const textOrUnmentioned = (value) => {
    if (value === null || value === undefined || value === "")
      return "Unmentioned";
    return value;
  };

  const arrayOrUnmentioned = (value) => {
    if (!Array.isArray(value) || value.length === 0) return ["Unmentioned"];
    return value;
  };

  useEffect(() => {
    const fetchSitter = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/babysitters/baby_sitter_info/${id}`);
        const result = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            toast.error(result.error || "Please log in to use this facility");
            router.push(`/login?redirect=${encodeURIComponent(`/babysitters/${id}`)}`);
            return;
          }

          if (res.status === 403) {
            toast.error(
              result.error ||
              "Your free trial or subscription has expired. Please subscribe to continue.",
            );
            router.push("/pricing");
            return;
          }

          throw new Error(result.error || "Failed to fetch babysitter");
        }

        const db = result.data;
        const viewerData = result.viewer || {
          isLoggedIn: false,
          role: null,
          hasActiveSubscription: false,
          canSeeContact: false,
        };

        setViewer(viewerData);
        setContactRevealed(viewerData.canSeeContact);

        // Show all available fields
        const mergedProfile = {
          name: textOrUnmentioned(db.fullName),
          email: textOrUnmentioned(db.email),
          phone: textOrUnmentioned(db.phoneNumber),
          gender: textOrUnmentioned(db.gender),
          role: db.location ? `Babysitter in ${db.location}` : "Unmentioned",
          age: db.age ?? "Unmentioned",
          zipCode: db.zipCode ?? "Unmentioned",
          rate: db.hourlyRate ? `£ ${db.hourlyRate}/hr` : "Unmentioned",
          image: db.profilePhoto ? db.profilePhoto : "Unmentioned",
          activity: db.lastActivity?.$date || db.lastActivity
            ? `Last activity: ${new Date(db.lastActivity?.$date || db.lastActivity).toLocaleDateString()}`
            : "Recently active",
          intro: textOrUnmentioned(db.description),
          certifications: arrayOrUnmentioned(db.certifications),
          characteristics: arrayOrUnmentioned(db.characteristics),
          experience: db.yearsOfExperience
            ? `${db.yearsOfExperience} years`
            : "Unmentioned",
          ages: arrayOrUnmentioned(db.comfortableWithAgeGroup),
          educationLevel: textOrUnmentioned(db.educationLevel),
          educationDetails: textOrUnmentioned(db.educationDetails),
          superpowers: arrayOrUnmentioned(db.skills),
          comfortableWith: arrayOrUnmentioned(db.comfortableWithAgeGroup),
          location: textOrUnmentioned(db.location),
          updated: formatUpdatedDate(db.updatedAt),
          memberSince: formatDate(db.createdAt),
          lastActivity: db.lastActivity?.$date || db.lastActivity
            ? new Date(db.lastActivity?.$date || db.lastActivity).toLocaleDateString()
            : "Unmentioned",
          mapLink: textOrUnmentioned(db.mapLink),
          preferredBabysittingLocation: textOrUnmentioned(db.preferredBabysittingLocation),
          governmentIdVerified: db.governmentIdVerified,
          emailVerified: db.emailVerified,
          googleAccountVerified: db.googleAccountVerified,
          isFavorite: db.isFavorite,
          isApproved: db.isApproved,
          subscription: textOrUnmentioned(db.subscription),
          about: [
            {
              label: "Driver's license",
              value:
                db.driverLicense === null || db.driverLicense === undefined
                  ? "Unmentioned"
                  : db.driverLicense
                    ? "Yes"
                    : "No",
              icon: <FiAward />,
            },
            {
              label: "Car",
              value:
                db.hasCar === null || db.hasCar === undefined
                  ? "Unmentioned"
                  : db.hasCar
                    ? "Yes"
                    : "No",
              icon: <FiTruck />,
            },
            {
              label: "Has children",
              value:
                db.hasChildren === null || db.hasChildren === undefined
                  ? "Unmentioned"
                  : db.hasChildren
                    ? "Yes"
                    : "No",
              icon: <FiSmile />,
            },
            {
              label: "Smoker",
              value:
                db.isSmoker === null || db.isSmoker === undefined
                  ? "Unmentioned"
                  : db.isSmoker
                    ? "Yes"
                    : "No",
              icon: <FiUser />,
            },
            {
              label: "Preferred babysitting location",
              value: textOrUnmentioned(db.preferredBabysittingLocation),
              icon: <FiHome />,
            },
            {
              label: "Languages",
              value:
                Array.isArray(db.languages) && db.languages.length > 0
                  ? db.languages.join(", ")
                  : "Unmentioned",
              icon: <FiGlobe />,
            },
            ...(Array.isArray(db.verificationDocs)
              ? db.verificationDocs.map((doc, i) => ({
                label: `Verification Doc ${i + 1}`,
                value: doc,
                icon: <FiAward className="text-brandColor" />,
              }))
              : []),
          ],
          verifications: [
            db.governmentIdVerified ? "Government ID" : null,
            db.emailVerified ? "Email address" : null,
            db.googleAccountVerified ? "Google account" : null,
          ].filter(Boolean),
        };

        setProfile(mergedProfile);
        setAvailability(buildAvailability(db.availability || []));
      } catch (error) {
        toast.error(error.message || "Failed to load babysitter profile");
        setProfile(null);
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSitter();
  }, [id, router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".profile-hero-animate", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".profile-card-animate", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.from(".profile-side-animate", {
        x: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-cyan-50 flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="min-h-screen bg-cyan-50 flex items-center justify-center">
        <p className="text-lg text-gray-500">No babysitter found</p>
      </section>
    );
  }

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <section ref={sectionRef} className="min-h-screen bg-gray-50">
      {/* =============================
               top information 
    =============================== */}
      <div className="border-b border-brandColor/20 bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="profile-hero-animate mb-4 break-words text-xs text-gray-500 sm:mb-6 sm:text-sm">
            Babysits / Babysitter wanted / Babysitter / {profile.name}
          </div>

          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:text-left">
            <div className="profile-hero-animate flex w-full min-w-0 flex-col items-center gap-5 md:flex-row">
              <img
                loading="lazy"
                src={
                  profile.image !== "Unmentioned"
                    ? profile.image
                    : "https://via.placeholder.com/300?text=No+Image"
                }
                alt={profile.name}
                className="h-24 w-24 flex-shrink-0 rounded-full object-cover shadow-sm ring-4 ring-brandColor/10 sm:h-32 sm:w-32"
              />

              <div className="min-w-0">
                <div className="flex flex-col items-center gap-2 md:items-start">
                  <div className="flex max-w-full items-center gap-2">
                    <h1 className="min-w-0 break-words text-2xl font-semibold text-gray-800 sm:text-3xl">
                      {profile.name}
                    </h1>
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brandColor text-xs text-white">
                      ✓
                    </span>
                  </div>

                  <p className="break-words text-sm font-medium text-gray-500 sm:text-base">
                    {profile.role}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-6 md:justify-start">
                  <div>
                    <p className="text-xs text-gray-400 sm:text-sm">Age</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                      {profile.age}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 sm:text-sm">
                      Hourly rate
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                      {profile.rate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================
          all details about baby stter 
        ============================ */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full rounded-3xl bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="min-w-0 order-2 lg:order-1">

              <div className="profile-card-animate flex flex-col gap-5 border-b border-gray-200 pb-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                    <FiClock />
                    {profile.activity}
                  </p>

                  <p className="text-sm leading-7 text-gray-600 sm:text-base">
                    {profile.intro}
                  </p>

                  <div className="mt-5">
                    <p className="mb-3 text-sm font-semibold text-gray-500">
                      Characteristics
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.characteristics.map((item, idx) => (
                        <span
                          key={item + idx}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Show all extra fields */}
                  <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                    <div className="min-w-0 break-words rounded-2xl bg-gray-50 p-3">
                      <span className="font-semibold text-gray-500">Gender:</span> {profile.gender}
                    </div>
                    <div className="min-w-0 break-words rounded-2xl bg-gray-50 p-3">
                      <span className="font-semibold text-gray-500">Certifications:</span> {profile.certifications}
                    </div>
                    <div className="min-w-0 break-words rounded-2xl bg-gray-50 p-3">
                      <span className="font-semibold text-gray-500">Subscription:</span> {profile.subscription}
                    </div>
                    <div className="min-w-0 break-words rounded-2xl bg-gray-50 p-3">
                      <span className="font-semibold text-gray-500">Is Approved:</span> {profile.isApproved ? "Yes" : "No"}
                    </div>
                    <div className="min-w-0 break-words rounded-2xl bg-gray-50 p-3 sm:col-span-2">
                      <span className="font-semibold text-gray-500">Is Favorite:</span> {profile.isFavorite ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 xl:w-64">
                  <div className="mb-2 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-cyan-700">
                      Contact Information
                    </p>
                    <p className="mt-2 text-base font-semibold text-gray-800 break-all">
                      {contactRevealed ? `${profile.phone} • ${profile.email}` : "Hidden"}
                    </p>
                    {!contactRevealed && (
                      <div className="mt-3 space-y-2 text-sm text-gray-500">
                        <p>
                          {!viewer.isLoggedIn
                            ? "Please register or log in to reveal contact details."
                            : viewer.hasActiveSubscription
                              ? "Click the button to reveal the babysitter's contact details."
                              : "Subscribe to reveal this babysitter's contact details."
                          }
                        </p>
                        <button
                          onClick={() => {
                            if (!isLoggedIn) {
                              router.push("/register-parent");
                              return;
                            }

                            if (!viewer.hasActiveSubscription) {
                              router.push("/pricing");
                              return;
                            }

                            setContactRevealed(true);
                          }}
                          className="w-full cursor-pointer rounded-full bg-brandColor px-4 py-3 text-sm font-medium text-white transition hover:bg-brandColor/80"
                        >
                          {!isLoggedIn
                            ? "Register to Reveal"
                            : viewer.hasActiveSubscription
                              ? "Click to Reveal"
                              : "Subscribe to Reveal"
                          }
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-card-animate space-y-5 border-b border-gray-200 py-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-cyan-600">
                    <FiBriefcase />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Experience
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {profile.experience}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-cyan-600">
                    <FiUser />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Experience with age(s)
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {profile.ages.join(" • ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-rose-400">
                    <FiCheckCircle />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Government ID
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {profile.verifications.includes("Government ID")
                        ? `${profile.name} successfully provided a government ID.`
                        : "Unmentioned"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="profile-card-animate border-b border-gray-200 py-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Education and Certifications
                </h3>

                <div className="mt-5 space-y-3">
                  <div className="flex flex-col gap-3 rounded-2xl bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <FiBookOpen className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">
                        Education level
                      </span>
                    </div>

                    <span className="break-words text-left text-sm font-medium text-gray-700 sm:text-right">
                      {profile.educationLevel}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 rounded-2xl bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <FiBookOpen className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">
                        Education details
                      </span>
                    </div>

                    <span className="break-words text-left text-sm font-medium text-gray-700 sm:text-right">
                      {profile.educationDetails}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 rounded-2xl bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <FiBookOpen className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">
                        Certifications
                      </span>
                    </div>
                    <span className="break-words text-left text-sm font-medium text-gray-700 sm:text-right">
                      {profile.certifications.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-card-animate border-b border-gray-200 py-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      My babysitting superpowers
                    </h3>

                    <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                      <div className="space-y-4">
                        {profile.superpowers.map((item) => (
                          <div
                            key={item}
                            className="flex min-w-0 items-center gap-3 break-words text-sm font-medium text-gray-600"
                          >
                            <FiAward className="text-brandColor" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      I&apos;m comfortable with
                    </h3>

                    <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                      <div className="space-y-4">
                        {profile.comfortableWith.map((item) => (
                          <div
                            key={item}
                            className="flex min-w-0 items-center gap-3 break-words text-sm font-medium text-gray-600"
                          >
                            <FiCheckCircle className="text-brandColor" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-card-animate border-b border-gray-200 py-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Location
                </h3>
                <div className="mt-3 text-sm text-gray-500 font-bold">
                  <p className="mt-3 text-sm text-gray-500 font-medium">
                    📍 {profile.location || "Unknown location"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Post Code: {profile.zipCode || "N/A"}
                  </p>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
                  {profile.mapLink !== "Unmentioned" ? (
                    <iframe
                      src={
                        profile.mapLink
                          .replace("/maps", "/maps/embed")
                          .includes("output=embed")
                          ? profile.mapLink
                          : `${profile.mapLink}${profile.mapLink.includes("?") ? "&" : "?"}output=embed`
                      }
                      className="h-72 w-full border-0 sm:h-80"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center bg-gray-100 text-gray-400 sm:h-80">
                      <div className="text-center">
                        <FiMapPin className="mx-auto text-4xl" />
                        <p className="mt-3 text-sm font-medium">Unmentioned</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="profile-card-animate border-b border-gray-200 py-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Verifications
                    </h3>

                    <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                      <div className="space-y-4">
                        {profile.verifications.length > 0 ? (
                          profile.verifications.map((item) => (
                            <div
                              key={item}
                              className="flex items-center justify-between gap-4"
                            >
                              <span className="min-w-0 break-words text-sm font-medium text-gray-600">
                                {item}
                              </span>
                              <FiCheckCircle className="flex-shrink-0 text-cyan-600" />
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-600">Unmentioned</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Activities
                    </h3>

                    <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-gray-600">
                            Member since
                          </span>
                          <span className="text-right text-sm text-gray-500">
                            {profile.memberSince}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-gray-600">
                            Last activity
                          </span>
                          <span className="text-right text-sm text-gray-500">
                            {profile.lastActivity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-card-animate py-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Discover other options nearby
                </h3>

                {moreBabysitters.length > 0 ? (
                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {moreBabysitters.map((item) => (
                      <div
                        key={item.name}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                      >
                        <img
                          loading="lazy"
                          src={item.image}
                          alt={item.name}
                          className="h-28 w-full object-cover"
                        />

                        <div className="p-3 text-center">
                          <p className="text-sm font-semibold text-gray-700">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-gray-500">Unmentioned</p>
                )}
              </div>
            </div>

            <aside className="min-w-0 order-1 space-y-6 lg:order-2 lg:sticky lg:top-24 lg:self-start">
              <div className="profile-side-animate w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <h3 className="text-xl font-semibold text-gray-800">
                  Availability
                </h3>

                <div className="mt-4 sm:mt-5">
                  {/* Mobile: Column-based (days as rows, time slots as columns) */}
                  <div className="block sm:hidden">
                    <div className="space-y-2 overflow-x-auto pb-1">
                      {/* Time slot headers */}
                      <div className="grid grid-cols-5 gap-1">
                        <div className="text-[10px] font-semibold text-gray-400">Day</div>
                        <div className="text-[10px] font-semibold text-gray-400 text-center">Morning</div>
                        <div className="text-[10px] font-semibold text-gray-400 text-center">Afternoon</div>
                        <div className="text-[10px] font-semibold text-gray-400 text-center">Evening</div>
                        <div className="text-[10px] font-semibold text-gray-400 text-center">Night</div>
                      </div>

                      {/* Each day as a row */}
                      {days.map((day, dayIndex) => (
                        <div key={day} className="grid min-w-72 grid-cols-5 gap-1 items-center">
                          <span className="text-xs font-medium text-gray-600">{day}</span>
                          {availability.map((row) => {
                            const active = row.values[dayIndex];
                            return (
                              <div
                                key={`${day}-${row.label}`}
                                className={`mx-auto flex h-5 w-5 items-center justify-center rounded-full ${active
                                  ? "bg-brandColor"
                                  : "border border-gray-300 bg-gray-100"
                                  }`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop: Row-based (time slots as rows, days as columns) */}
                  <div className="hidden overflow-x-auto sm:block">
                    <div className="mb-4 grid min-w-80 grid-cols-8 items-center gap-2">
                      <div className="max-w-20" />
                      {days.map((day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-semibold text-gray-400"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {availability.map((row) => (
                        <div
                          key={row.label}
                          className="grid min-w-80 grid-cols-8 items-center gap-2"
                        >
                          <span className="w-20 text-sm font-medium text-gray-500">
                            {row.label}
                          </span>

                          {row.values.map((active, index) => (
                            <div
                              key={`${row.label}-${index}`}
                              className={`mx-auto h-3.5 w-3.5 rounded-full ${active
                                ? "bg-brandColor"
                                : "border border-gray-300 bg-gray-100"
                                }`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 sm:mt-5 flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <FiCalendar />
                    {profile.updated}
                  </p>
                </div>
              </div>

              <div className="profile-side-animate rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                <h3 className="text-2xl font-semibold text-gray-800">
                  About me
                </h3>

                <div className="mt-5 space-y-4">
                  {profile.about.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-1 text-gray-400">{item.icon}</span>
                        <span className="min-w-0 break-words text-sm font-medium text-gray-500">
                          {item.label}
                        </span>
                      </div>

                      <span className="max-w-[45%] break-words text-right text-sm font-medium text-gray-700">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
