"use client";

import React from "react";
import { Button } from "antd";
import { FiCreditCard } from "react-icons/fi";
import gsap from "gsap";

const BillingOffers = () => {
  // GSAP Animation with improved opacity and more stylish entrance
  React.useEffect(() => {
    gsap.from(".billing-info", {
      opacity: 1,
      y: 30,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-4xl flex flex-col items-center justify-center">
        {/* Billing Offers Card */}
        <div className="billing-info bg-white shadow-xl rounded-2xl p-8 sm:p-12 w-full max-w-lg">
          {/* Offer Details */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-semibold text-gray-900">
              Start Your Free Trial for 3 Months
            </h3>
            <p className="text-sm text-gray-500 sm:text-base mt-4">
              Enjoy a 3-month free trial with full access to all features. After
              the trial, cancel anytime and pay only $10 per month as a service
              charge.
            </p>
          </div>

          {/* Billing Info Button */}
          <div className="flex justify-center mt-6">
            <Button
              type="primary"
              size="large"
              className="flex items-center gap-2 rounded-full px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-all"
            >
              <FiCreditCard />
              Add Billing Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BillingOffers;