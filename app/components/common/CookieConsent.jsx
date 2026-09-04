"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiCheck, FiX, FiSettings, FiShield } from "react-icons/fi";

const COOKIE_CONSENT_KEY = "junglezone_cookie_consent";

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Categories
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!saved) {
        setShowBanner(true);
      } else {
        const parsed = JSON.parse(saved);
        setPreferences({
          essential: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
        });
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (choice) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(choice));
    } catch {
      // storage unavailable
    }
    setPreferences(choice);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleRejectNonEssential = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!mounted || !showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent banner"
        className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3 max-w-3xl">
            <span className="p-2 rounded-xl bg-brandColor/10 text-brandColor shrink-0 mt-0.5">
              <FiShield className="w-5 h-5" />
            </span>
            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-900 mb-1">
                We value your privacy
              </p>
              <p>
                We use strictly essential cookies to keep you signed in and
                secure the JungleZone platform. We do not deploy advertising or
                cross-site tracking cookies. You can choose whether to allow
                non-essential cookies below. For full details, view our{" "}
                <Link
                  href="/cookies-policy"
                  className="text-brandColor font-semibold underline hover:text-brandColor/80"
                >
                  Cookies Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-brandColor font-semibold underline hover:text-brandColor/80"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
            <button
              onClick={handleRejectNonEssential}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FiSettings className="w-4 h-4" />
              Manage Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-brandColor hover:bg-brandColor/90 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-lg font-bold font-poppins text-gray-900 flex items-center gap-2">
                <FiSettings className="text-brandColor" />
                Cookie Preferences
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Customise your consent preferences for cookies on JungleZone. You
              can review which technologies operate on our platform in our{" "}
              <Link
                href="/cookies-policy"
                className="text-brandColor underline"
              >
                Cookies Policy
              </Link>
              .
            </p>

            <div className="space-y-4">
              {/* Essential */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    Strictly Essential Cookies
                  </span>
                  <span className="text-xs font-semibold text-brandColor bg-brandColor/10 px-2.5 py-0.5 rounded-full">
                    Always Active
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Required for core platform functionality, security, user
                  sign-in and session management. Cannot be switched off.
                </p>
              </div>

              {/* Analytics */}
              <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-gray-900 block mb-1">
                    Analytics &amp; Performance
                  </span>
                  <p className="text-xs text-gray-500">
                    Help us understand how visitors interact with platform
                    features to improve usability.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        analytics: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brandColor"></div>
                </label>
              </div>

              {/* Marketing */}
              <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-gray-900 block mb-1">
                    Marketing &amp; Communications
                  </span>
                  <p className="text-xs text-gray-500">
                    Used to measure the performance of promotional campaigns and
                    offers.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        marketing: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brandColor"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleRejectNonEssential}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Reject All Non-Essential
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-brandColor hover:bg-brandColor/90 rounded-lg shadow-sm cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
