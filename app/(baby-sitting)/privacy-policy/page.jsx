import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | JungleZone",
  description:
    "Privacy Policy explaining how personal data is processed by Jungle Zone Connect Ltd.",
};

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
        <div className="border-b border-gray-100 pb-6 mb-8 text-center">
          <span className="inline-block px-3 py-1 bg-brandColor/10 text-brandColor text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            Privacy &amp; Data Protection
          </span>
          <h1 className="text-3xl font-bold font-poppins text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: September 2026
          </p>
        </div>

        <div className="space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
          {/* 1. Introduction & Data Controller */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              1. Data Controller
            </h2>
            <p>
              <strong>Jungle Zone Connect Ltd</strong> is the data controller
              for personal data processed through JungleZone (&quot;we&quot;,
              &quot;us&quot;, &quot;our&quot;).
            </p>
            <p className="mt-2">
              We collect and use personal information only as necessary to
              operate and improve the JungleZone online platform, manage user
              accounts, facilitate communication between users, provide paid
              platform features, maintain security and comply with applicable
              legal obligations.
            </p>
          </section>

          {/* 2. Nature of Platform */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              2. Nature of Our Introduction Service
            </h2>
            <p>
              JungleZone operates strictly as an online technology platform
              facilitating introductions between parents/guardians and
              independent babysitters. JungleZone does not provide childcare
              services, does not employ or supply babysitters, and is not a
              party to childcare contracts between users.
            </p>
          </section>

          {/* 3. Information We Collect */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              3. Information We Collect
            </h2>
            <p>
              We may collect information such as your name, email address,
              telephone number, account details, profile information,
              approximate location or postcode, communications made through the
              platform, subscription/payment information relating to JungleZone
              fees, technical information and information you voluntarily
              provide.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              <strong>DBS and Background Checks Notice:</strong> JungleZone does
              not require or process DBS certificates for the purpose of
              verifying babysitters unless we expressly introduce such a service
              and update this Privacy Policy accordingly. JungleZone does not
              independently obtain, verify or hold DBS checks, First Aid
              certificates, references or childcare qualifications on behalf of
              users.
            </div>
          </section>

          {/* 4. Purpose and Legal Basis */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              4. How We Use Personal Data &amp; Legal Basis
            </h2>
            <p>
              We process personal data in compliance with UK GDPR and the Data
              Protection Act 2018 under the following lawful bases:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>
                <strong>Contract Performance:</strong> To provide access to the
                platform, administer user accounts, provide subscription
                features, and facilitate messaging between registered parents
                and babysitters.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> To maintain platform
                security, prevent abuse and fraud, investigate reported
                concerns, and improve our services.
              </li>
              <li>
                <strong>Legal Obligation:</strong> To maintain accounting
                records and comply with applicable statutory requirements under
                UK law.
              </li>
              <li>
                <strong>Consent:</strong> Where you opt in to receive optional
                marketing communications from JungleZone. You can withdraw your
                consent at any time.
              </li>
            </ul>
          </section>

          {/* 5. Payments for Childcare vs Platform Fees */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              5. Financial Data &amp; Payments
            </h2>
            <p>
              Where you purchase paid platform features or subscriptions from
              JungleZone, payments are processed securely by our third-party
              payment provider (Stripe). JungleZone does not store full credit
              or debit card numbers on its servers.
            </p>
            <p className="mt-2">
              JungleZone does not collect, hold, or process payments for
              childcare services. Any childcare fees are agreed and settled
              directly between the parent and the independent babysitter.
            </p>
          </section>

          {/* 6. Data Sharing */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              6. Sharing of Personal Data
            </h2>
            <p>
              We share personal information only where necessary to provide our
              introduction services:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>
                <strong>Between Users:</strong> When users interact or when
                contact details are unlocked pursuant to active platform
                subscriptions.
              </li>
              <li>
                <strong>Service Providers:</strong> Trusted technical partners
                providing database hosting, payment processing, email delivery,
                and platform infrastructure under strict confidentiality and
                data protection agreements.
              </li>
              <li>
                <strong>Legal &amp; Regulatory Authorities:</strong> Where
                required by applicable law, court order, or regulatory request.
              </li>
            </ul>
            <p className="mt-2">
              We do not sell personal information to third parties.
            </p>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              7. Data Retention
            </h2>
            <p>
              We retain personal information only for as long as necessary to
              fulfil the purposes outlined in this policy, maintain active
              accounts, resolve disputes, and comply with UK statutory
              obligations (such as tax and accounting record-keeping). When an
              account is closed, personal data is securely deleted or
              anonymised, subject to legal retention periods.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              8. Your Statutory Data Protection Rights
            </h2>
            <p>
              Under UK GDPR, you have rights including the right to access,
              rectify, or request erasure of your personal data, restrict or
              object to certain processing, and data portability. You also have
              the right to lodge a complaint with the UK Information
              Commissioner&apos;s Office (ICO) at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brandColor hover:underline"
              >
                ico.org.uk
              </a>
              .
            </p>
          </section>

          {/* 9. Contact */}
          <section>
            <h2 className="text-xl font-bold font-poppins text-gray-900 mb-3">
              9. Contact for Privacy &amp; Data Protection Enquiries
            </h2>
            <p>
              For privacy and data protection enquiries, please contact:{" "}
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

export default PrivacyPolicyPage;
