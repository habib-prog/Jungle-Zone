import React from "react";
import Link from "next/link";
import { HeartHandshake, Search, Clock3, Shield } from "lucide-react";

export const metadata = {
  title: "About Us | JungleZone",
  description:
    "About JungleZone - UK online introduction platform connecting parents and independent babysitters.",
};

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-brandColor/10 via-white to-brandColor/5 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="inline-block px-4 py-1.5 bg-brandColor/10 text-brandColor text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
            Introduction Platform
          </span>
          <h1 className="font-poppins text-4xl sm:text-5xl font-bold text-[#4c494a] mb-6">
            About JungleZone
          </h1>
          <p className="font-poppins text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            JungleZone is a UK online introduction platform created to make it
            easier for parents and independent babysitters to discover and
            connect with each other.
          </p>
        </div>
      </section>

      {/* Main Core Principles Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 sm:p-12 space-y-6 text-gray-700 leading-relaxed">
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-gray-900">
              Our Role &amp; Purpose
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Our platform provides tools that allow users to create profiles,
              search for babysitters and communicate directly.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              JungleZone does not provide childcare services, employ or supply
              babysitters, or make childcare arrangements on behalf of users.
              Parents and babysitters remain responsible for deciding whether
              they wish to enter into an arrangement with each other.
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brandColor/20 shadow-xs mt-6">
              <h3 className="font-poppins font-semibold text-brandColor text-base mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Platform Disclaimer
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                JungleZone is an online introduction platform. We do not provide
                childcare services, employ babysitters, carry out DBS or
                background checks, or guarantee the suitability of users.
                Parents and babysitters are responsible for carrying out their
                own checks and making their own arrangements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How the Platform Operates */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl font-bold text-[#4c494a] mb-3">
              How the Service Operates
            </h2>
            <p className="font-poppins text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Clear, transparent tools empowering families and independent
              carers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brandColor/10 text-brandColor flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">
                Local Discovery
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Parents enter their postcode to find independent babysitters
                nearby and review self-published profile details.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brandColor/10 text-brandColor flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">
                Direct Communication
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Users communicate directly to ask questions, check references,
                interview each other, and review relevant credentials.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brandColor/10 text-brandColor flex items-center justify-center mb-4">
                <Clock3 className="w-6 h-6" />
              </div>
              <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">
                Direct Agreements
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rates, hours, and payments are agreed and transacted directly
                between parents and babysitters with no childcare commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brandColor text-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="font-poppins text-3xl font-bold mb-4">
            Connect with Your Community
          </h2>
          <p className="font-poppins text-white/90 text-base sm:text-lg mb-8 leading-relaxed">
            Whether you are looking for local babysitting support or an
            independent babysitter seeking opportunities, JungleZone makes
            introduction simple.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/babysitters"
              className="px-8 py-3.5 bg-white text-brandColor font-semibold rounded-full hover:bg-gray-100 transition-all text-sm sm:text-base shadow-lg"
            >
              Browse Babysitters
            </Link>
            <Link
              href="/register-babysitter"
              className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all text-sm sm:text-base"
            >
              Join as a Babysitter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
