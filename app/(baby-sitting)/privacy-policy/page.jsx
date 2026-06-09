import React from 'react'

const Page = () => {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>JungleZone is committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. This policy explains how we collect, use, and protect your information when using our babysitting platform.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">2. Data Controller</h2>
          <p>JungleZone Ltd is the data controller for all personal data processed through our platform. Our registered address is 123 London Road, Manchester, M1 1AA, United Kingdom. Our Data Protection Officer can be contacted at dpo@junglezone.co.uk.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">3. Information We Collect</h2>
          <p>We collect personal information such as your name, address, email, phone number, payment details, and, for babysitters, DBS certificates, first aid certificates, childcare qualifications, and references. We also collect usage data to improve our services.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">4. How We Use Your Data</h2>
          <p>Your data is used to facilitate bookings, process payments, verify babysitter credentials, communicate updates, and comply with our legal obligations under UK law. We will never sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Legal Basis for Processing</h2>
          <p>We process your data under the following lawful bases: contract performance (to provide babysitting services), legal obligation (DBS checks, safeguarding), and legitimate interest (to improve our platform and prevent fraud). Consent is obtained where required by UK GDPR.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">6. Data Sharing</h2>
          <p>Personal data is shared only with relevant parties to complete a booking, including parents, babysitters, and authorised service providers (such as payment processors). All third parties are required to comply with data protection laws.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
          <p>We retain your personal data for as long as necessary to provide services and comply with legal obligations. Inactive accounts are deleted after 3 years. DBS records are retained in line with Ofsted and Disclosure &amp; Barring Service guidance.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">8. Your Rights</h2>
          <p>Under UK GDPR, you have the right to access, correct, restrict, or erase your personal data, to object to processing, and to data portability. To exercise these rights, please contact privacy@junglezone.co.uk.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p>For privacy-related queries, please contact our Data Protection Officer at dpo@junglezone.co.uk or write to JungleZone Ltd, 123 London Road, Manchester, M1 1AA, United Kingdom. You also have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO).</p>
        </section>
      </div>
    </div>
  )
}

export default Page