import React from 'react'

const Page = () => {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Cookies Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help provide a better user experience and enable certain functionalities. This policy applies to cookies used on the JungleZone babysitting platform, operated in the United Kingdom.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Cookies</h2>
          <p>We use cookies to keep you logged in, remember your booking preferences, analyse site traffic, and personalise content. All cookies used on JungleZone comply with the Privacy and Electronic Communications Regulations 2003 (PECR) and UK GDPR.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">3. Types of Cookies We Use</h2>
          <p><strong>Essential cookies:</strong> Required for the platform to function, such as authentication and security.<br/><strong>Analytical cookies:</strong> Help us understand how visitors interact with our site so we can improve performance.<br/><strong>Functional cookies:</strong> Remember your preferences and settings for a personalised experience.<br/><strong>Marketing cookies:</strong> Used to deliver relevant advertising based on your interests.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Third-Party Cookies</h2>
          <p>Some cookies are placed by third-party services, such as payment processors (Stripe, PayPal), analytics providers (Google Analytics), and mapping services (Google Maps) to assist with location-based babysitter searches across the UK.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Managing Cookies</h2>
          <p>You can manage or disable cookies through your browser settings. Please note that disabling essential cookies may affect the functionality of the JungleZone platform. For more information, visit the ICO&apos;s cookie guidance or your browser&apos;s help centre.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">6. Updates to This Policy</h2>
          <p>We may update this Cookies Policy from time to time to reflect changes in legislation or our use of cookies. We will notify users of any significant changes through the platform or by email.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
          <p>For questions about our use of cookies, please contact us at privacy@junglezone.co.uk or write to JungleZone Ltd, 123 London Road, Manchester, M1 1AA, United Kingdom.</p>
        </section>
      </div>
    </div>
  )
}

export default Page