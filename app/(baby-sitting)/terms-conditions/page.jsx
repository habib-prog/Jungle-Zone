import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | JungleZone",
  description:
    "Terms and Conditions governing the use of the JungleZone online introduction platform.",
};

const TermsAndConditionsPage = () => {
  return (
    <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
        {/* Header */}
        <div className="mb-10 text-center border-b border-gray-100 pb-8">
          <span className="inline-block px-3 py-1 bg-brandColor/10 text-brandColor text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            Legal Agreement
          </span>
          <h1 className="text-3xl font-bold font-poppins text-gray-900 sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: September 2026
          </p>
        </div>

        {/* Platform Notice */}
        <div className="mb-8 rounded-xl border border-brandColor/30 bg-brandColor/5 p-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <strong className="font-semibold text-brandColor">
            Important Notice:{" "}
          </strong>
          JungleZone is an online introduction platform only. We do not provide
          childcare services, employ babysitters, carry out DBS or background
          checks, or guarantee the suitability of any user. Parents and
          independent babysitters are responsible for carrying out their own
          checks and making their own arrangements directly with each other.
        </div>

        {/* 14 Sections */}
        <div className="space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              1. About JungleZone
            </h2>
            <p>
              JungleZone is an online introduction and communication platform
              that enables parents, guardians and independent babysitters to
              find and connect with each other.
            </p>
            <p className="mt-2">
              JungleZone does not provide childcare services and does not
              employ, supply, manage or supervise babysitters.
            </p>
            <p className="mt-2">
              Any childcare arrangement is made directly between the parent or
              guardian and the babysitter.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              2. Our Role
            </h2>
            <p>
              JungleZone provides the technology and platform through which
              users can create profiles, search listings and communicate with
              other users.
            </p>
            <p className="mt-2">
              JungleZone is not a party to any childcare agreement or
              arrangement made between users.
            </p>
            <p className="mt-2">
              JungleZone does not determine babysitters&apos; working hours,
              rates or methods of providing childcare.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              3. No DBS or Background Verification
            </h2>
            <p>
              JungleZone does not carry out, obtain or verify DBS checks,
              criminal background checks, references, qualifications or
              employment history on behalf of users.
            </p>
            <p className="mt-2">
              JungleZone does not guarantee that information contained in a
              user&apos;s profile is accurate, complete or current.
            </p>
            <p className="mt-2">
              Users are responsible for conducting their own checks before
              entering into any childcare arrangement.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              4. Parent/Guardian Responsibilities
            </h2>
            <p>
              Parents and guardians are responsible for deciding whether a
              babysitter is suitable for their individual requirements.
            </p>
            <p className="mt-2">
              Before engaging a babysitter, parents should consider carrying out
              appropriate checks, which may include checking identification,
              references, experience, qualifications and relevant DBS
              documentation.
            </p>
            <p className="mt-2">
              Parents are responsible for interviewing, selecting and agreeing
              the terms of any childcare arrangement directly with the
              babysitter.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              5. Babysitter Responsibilities
            </h2>
            <p>
              Babysitters are responsible for ensuring that information provided
              on their profiles is accurate, truthful and up to date.
            </p>
            <p className="mt-2">
              Babysitters are responsible for complying with any legal, tax,
              insurance, registration or other obligations applicable to their
              individual circumstances.
            </p>
            <p className="mt-2">
              JungleZone does not determine the employment or tax status of
              users.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              6. Childcare Arrangements
            </h2>
            <p>
              Any childcare arrangement is entered into directly between the
              parent or guardian and the babysitter.
            </p>
            <p className="mt-2">
              JungleZone is not a party to that arrangement and does not
              supervise, direct or control the provision of childcare services.
            </p>
            <p className="mt-2">
              Users are responsible for agreeing rates, hours, duties,
              cancellations and other childcare arrangements directly with each
              other.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              7. Childcare Payments
            </h2>
            <p>
              JungleZone does not collect, hold or process payments for
              childcare services.
            </p>
            <p className="mt-2">
              Parents and babysitters agree childcare fees and payment methods
              directly with each other.
            </p>
            <p className="mt-2">
              JungleZone is not responsible for unpaid childcare fees or payment
              disputes between users.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              8. JungleZone Platform Fees
            </h2>
            <p>
              JungleZone may charge users a platform, membership or subscription
              fee for access to certain platform features.
            </p>
            <p className="mt-2">
              Platform fees are payments for access to JungleZone&apos;s online
              services and are separate from any childcare fees agreed between
              users.
            </p>
            <p className="mt-2">
              Prices, billing periods, renewal arrangements and applicable
              cancellation terms will be displayed before a user purchases a
              paid service.
            </p>
            <p className="mt-2">
              Nothing in these Terms affects any statutory consumer rights that
              cannot lawfully be excluded.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              9. No Recommendation or Guarantee
            </h2>
            <p>
              The presence of a user or profile on JungleZone does not
              constitute a recommendation, endorsement or guarantee by
              JungleZone.
            </p>
            <p className="mt-2">
              JungleZone does not guarantee the identity, suitability, conduct,
              availability, experience, qualifications or performance of any
              user unless a particular matter is expressly stated by JungleZone
              as having been independently verified.
            </p>
            <p className="mt-2">
              Users are responsible for making their own decisions when
              communicating with or engaging another user.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              10. User Conduct
            </h2>
            <p>
              Users must not provide false or misleading information,
              impersonate another person, use the platform for unlawful
              purposes, harass other users, misuse personal information, or
              upload unlawful, abusive or inappropriate content.
            </p>
            <p className="mt-2">
              JungleZone may restrict, suspend or remove accounts or content
              where reasonably necessary to protect users, operate the platform,
              comply with applicable law or enforce these Terms.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              11. Reporting Concerns
            </h2>
            <p>
              Users may report suspected misuse, inappropriate behaviour or
              concerns relating to activity on the JungleZone platform through
              our reporting or contact facilities.
            </p>
            <p className="mt-2">
              JungleZone may review reports relating to use of the platform and
              may take appropriate action regarding accounts or content.
            </p>
            <p className="mt-2">
              JungleZone does not act as an adjudicator of private childcare
              disputes between users.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              12. Limitation of Liability
            </h2>
            <p>
              JungleZone provides the platform on an &quot;as is&quot; and
              &quot;as available&quot; basis. Users participate in introductions
              and childcare arrangements entirely at their own risk.
            </p>
            <p className="mt-2 font-medium">
              Nothing in these Terms excludes or limits any liability that
              cannot lawfully be excluded or limited under applicable law,
              including liability for death or personal injury caused by
              negligence, fraudulent misrepresentation, or mandatory statutory
              consumer rights.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              13. Account Suspension and Closure
            </h2>
            <p>
              Users may close their accounts in accordance with the account
              settings or by contacting JungleZone.
            </p>
            <p className="mt-2">
              JungleZone may suspend or terminate accounts for material breaches
              of these Terms, fraud, unlawful activity, misuse of the platform
              or conduct that may reasonably create risks for users or the
              platform.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              14. Governing Law
            </h2>
            <p>These Terms are governed by the laws of England and Wales.</p>
            <p className="mt-2">
              Nothing in these Terms affects any mandatory rights a consumer may
              have under applicable law.
            </p>
          </section>

          {/* Company Details Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-1">
            <p className="font-semibold text-gray-700">
              Jungle Zone Connect Ltd
            </p>
            <p>Registered in England and Wales</p>
            <p>Company Number: [INSERT ACTUAL COMPANY NUMBER]</p>
            <p>Registered Office: [INSERT ACTUAL REGISTERED OFFICE ADDRESS]</p>
            <p>
              Support:{" "}
              <Link
                href="mailto:support@junglezone.uk"
                className="text-brandColor hover:underline"
              >
                support@junglezone.uk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditionsPage;
