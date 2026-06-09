import React from 'react'

const Page = () => {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>These Terms of Service govern your use of JungleZone, a babysitting platform connecting parents with qualified babysitters across the United Kingdom. By accessing or using our services, you agree to be bound by these terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">2. Definitions</h2>
          <p><strong>&quot;Platform&quot;</strong> means the JungleZone website and mobile application.<br/><strong>&quot;Parent&quot;</strong> means a user booking babysitting services.<br/><strong>&quot;Babysitter&quot;</strong> means a registered childcare provider offering services through the Platform.<br/><strong>&quot;Booking&quot;</strong> means a confirmed arrangement for babysitting services.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">3. Booking and Payments</h2>
          <p>All bookings are subject to availability and confirmation. Payments must be made in GBP (£) through the JungleZone payment system. Rates vary by babysitter experience, location, and duration. Parents agree to pay the full amount for completed bookings.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Babysitter Responsibilities</h2>
          <p>All babysitters on our platform are required to hold a valid DBS (Disclosure and Barring Service) check, first aid certification, and childcare qualifications where applicable. Babysitters must arrive on time and provide care in accordance with UK safeguarding standards.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Cancellations</h2>
          <p>Cancellations made more than 24 hours before the booking start time will receive a full refund. Cancellations within 24 hours may be subject to a cancellation fee of up to 50% of the booking total. Repeated late cancellations may result in account restrictions.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">6. Liability</h2>
          <p>JungleZone acts as an intermediary platform only. We are not liable for any injury, loss, or damage arising from babysitting services. All babysitters are required to hold appropriate public liability insurance. Parents should ensure their home insurance covers guest carers.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">7. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at legal@junglezone.co.uk or write to JungleZone Ltd, 123 London Road, Manchester, M1 1AA, United Kingdom.</p>
        </section>
      </div>
    </div>
  )
}

export default Page