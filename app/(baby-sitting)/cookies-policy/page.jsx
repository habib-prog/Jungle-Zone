import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Cookies Policy | JungleZone",
  description:
    "Information about how cookies and local storage are used on JungleZone.",
};

const CookiesPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
        <div className="border-b border-gray-100 pb-6 mb-8 text-center">
          <span className="inline-block px-3 py-1 bg-brandColor/10 text-brandColor text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            Policy &amp; Compliance
          </span>
          <h1 className="text-3xl font-bold font-poppins text-gray-900 sm:text-4xl">
            Cookies Policy
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: September 2026
          </p>
        </div>

        <div className="space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
          {/* 1. What Are Cookies */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              1. What Are Cookies and Local Storage?
            </h2>
            <p>
              Cookies are small data files placed on your device by websites you
              visit. Similar technologies include local storage, which stores
              information in your web browser. They are widely used to allow
              websites to function properly, remember user preferences, and
              maintain account security.
            </p>
          </section>

          {/* 2. How JungleZone Uses Cookies */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              2. How We Use Cookies on JungleZone
            </h2>
            <p>
              JungleZone operates with transparency regarding the technology we
              deploy. Under the Privacy and Electronic Communications
              Regulations (PECR) and UK GDPR, we provide clear information about
              the technologies operating on our website.
            </p>
          </section>

          {/* 3. Audit of Technologies Actually Used */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              3. Technologies Actually Operating on This Website
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden text-sm">
                <thead className="bg-gray-50 text-gray-800 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Name / Identifier</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-3 font-mono text-xs font-semibold text-brandColor">
                      token
                    </td>
                    <td className="p-3">Strictly Essential</td>
                    <td className="p-3">JungleZone</td>
                    <td className="p-3">
                      Maintains your authenticated session when you log into
                      your parent or babysitter account.
                    </td>
                    <td className="p-3">Session / 7 days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs font-semibold text-brandColor">
                      cookie_consent
                    </td>
                    <td className="p-3">Strictly Essential</td>
                    <td className="p-3">JungleZone (Local Storage)</td>
                    <td className="p-3">
                      Records your cookie preferences and choice on our consent
                      banner.
                    </td>
                    <td className="p-3">Persistent (1 year)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              * Note: JungleZone does not deploy third-party advertising
              cookies, behavioural cross-site tracking, or unconsented analytics
              cookies.
            </p>
          </section>

          {/* 4. Strictly Essential vs Optional */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              4. Strictly Essential vs Non-Essential Technologies
            </h2>
            <p>
              <strong>Strictly Essential:</strong> These cookies are necessary
              for the basic operation and security of the JungleZone platform,
              including user authentication and secure sign-in. Because they are
              strictly necessary to deliver the service requested by you, they
              do not require prior consent under PECR.
            </p>
            <p className="mt-2">
              <strong>Non-Essential (Analytics &amp; Marketing):</strong> Any
              non-essential analytical or marketing cookies will only be
              activated if you explicitly grant consent through our cookie
              consent banner. You may update or withdraw your consent at any
              time.
            </p>
          </section>

          {/* 5. Managing Your Preferences */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              5. Managing Cookies in Your Browser
            </h2>
            <p>
              In addition to our on-site cookie banner, you can manage or block
              cookies through your browser settings (such as in Chrome, Safari,
              Firefox, or Edge). Please note that disabling strictly essential
              cookies will prevent you from logging into your JungleZone
              account.
            </p>
          </section>

          {/* 6. Contact */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              6. Contact Us
            </h2>
            <p>
              For questions regarding our use of cookies or privacy practices,
              please contact:{" "}
              <Link
                href="mailto:support@junglezone.uk"
                className="text-brandColor font-semibold hover:underline"
              >
                support@junglezone.uk
              </Link>
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700">
                Jungle Zone Connect Ltd
              </p>
              <p>Registered in England and Wales</p>
              <p>Company Number: [INSERT ACTUAL COMPANY NUMBER]</p>
              <p>
                Registered Office: [INSERT ACTUAL REGISTERED OFFICE ADDRESS]
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
