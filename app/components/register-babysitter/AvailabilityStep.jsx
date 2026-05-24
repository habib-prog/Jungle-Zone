"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import gsap from "gsap";

const AvailabilityStep = ({ onNext, onBack, formData, updateFormData }) => {
  const sectionRef = useRef(null);

  const [availability, setAvailability] = useState(() => {
    const mapped = {};

    if (formData.availability?.length) {
      formData.availability.forEach((item) => {
        const slots = [];
        if (item.timeSlots?.morning) slots.push("Morning");
        if (item.timeSlots?.afternoon) slots.push("Afternoon");
        if (item.timeSlots?.evening) slots.push("Evening");
        if (item.timeSlots?.night) slots.push("Night");
        mapped[item.day] = slots;
      });
    }

    return mapped;
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];

  const toggleAvailability = (day, slot) => {
    setAvailability((prev) => {
      const daySlots = prev[day] || [];
      const newSlots = daySlots.includes(slot)
        ? daySlots.filter((s) => s !== slot)
        : [...daySlots, slot];

      return { ...prev, [day]: newSlots };
    });
  };

  const handleNext = () => {
    const availabilityArray = Object.entries(availability).map(
      ([day, slots]) => ({
        day,
        timeSlots: {
          morning: slots.includes("Morning"),
          afternoon: slots.includes("Afternoon"),
          evening: slots.includes("Evening"),
          night: slots.includes("Night"),
        },
      })
    );

    updateFormData({ availability: availabilityArray });
    onNext();
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".step-fade", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(".mascot-bounce", {
        scale: 0.9,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.7)",
        delay: 0.2,
      });

      gsap.from(".availability-card", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power2.out",
        delay: 0.15,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6 sm:py-6"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
        <div className="flex flex-1 flex-col justify-between">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-8 sm:py-10">
            <div className="step-fade mb-10 flex flex-col items-center justify-center gap-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-6">
              <div className="mascot-bounce flex h-32 w-24 items-center justify-center rounded-full bg-amber-100 text-amber-600 sm:h-36 sm:w-28">
                <span className="text-5xl">⏰</span>
              </div>

              <div className="mascot-bounce rounded-full bg-cyan-50 px-8 py-6 text-center shadow-sm sm:px-10 sm:py-8">
                <h3 className="text-xl font-medium text-gray-800 sm:text-2xl">
                  When are you available?
                </h3>
              </div>
            </div>

            <div className="step-fade mb-8">
              <p className="text-center text-sm text-gray-500 sm:text-base">
                Choose the days and time slots when you are usually available
                for babysitting.
              </p>
            </div>

            <div className="space-y-4">
              <div className="step-fade hidden grid-cols-5 gap-4 rounded-2xl bg-white p-4 shadow-sm md:grid">
                <div className="text-base font-semibold text-gray-700">Day</div>
                {timeSlots.map((slot) => (
                  <div
                    key={slot}
                    className="text-center text-base font-semibold text-gray-700"
                  >
                    {slot}
                  </div>
                ))}
              </div>

              {days.map((day) => (
                <div
                  key={day}
                  className="availability-card rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="mb-4 md:hidden">
                    <h4 className="text-lg font-semibold text-gray-800">{day}</h4>
                  </div>

                  <div className="hidden items-center gap-4 md:grid md:grid-cols-5">
                    <div className="text-base font-semibold text-gray-800">
                      {day}
                    </div>

                    {timeSlots.map((slot) => (
                      <label
                        key={slot}
                        className="flex cursor-pointer items-center justify-center"
                      >
                        <input
                          type="checkbox"
                          checked={availability[day]?.includes(slot) || false}
                          onChange={() => toggleAvailability(day, slot)}
                          className="h-5 w-5 rounded border-gray-300 accent-cyan-600"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:hidden">
                    {timeSlots.map((slot) => (
                      <label
                        key={slot}
                        className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {slot}
                        </span>
                        <input
                          type="checkbox"
                          checked={availability[day]?.includes(slot) || false}
                          onChange={() => toggleAvailability(day, slot)}
                          className="h-5 w-5 rounded border-gray-300 accent-cyan-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="step-fade mt-6">
              <p className="text-sm text-gray-500 sm:text-base">
                You can update your availability later from your profile if your
                schedule changes.
              </p>
            </div>
          </div>

          <div className="step-fade sticky bottom-0 mt-8 bg-cyan-50 px-4 py-4 sm:px-6">
            <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-lg font-medium text-cyan-700 underline underline-offset-4 transition hover:text-cyan-800"
              >
                <FiArrowLeft />
                Back
              </button>

              <Button
                type="primary"
                size="large"
                onClick={handleNext}
                className="flex h-12 items-center gap-2 rounded-full px-6"
              >
                Next
                <FiArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilityStep;