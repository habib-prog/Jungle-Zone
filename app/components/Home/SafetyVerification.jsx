export default function SafetyVerification() {
  const items = [
    {
      title: "Detailed Profiles",
      desc: "Review experience, availability, and self-declared credentials directly on babysitter profiles.",
    },
    {
      title: "Direct Inquiries",
      desc: "Ask to see original DBS certificates, identification, and references before engaging care.",
    },
    {
      title: "Community Feedback",
      desc: "Transparent reviews help parents and sitters connect with confidence.",
    },
    {
      title: "Direct Arrangements",
      desc: "Review each provider's own hourly rate and agree availability, service details and payment directly with them.",
    },
  ];

  return (
    <section
      className="w-full bg-gray-50 py-12 sm:py-16"
      aria-label="Safety and Informed Choices"
    >
      {/* container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-poppis text-3xl font-medium leading-9 text-[#4C494A] sm:text-4xl sm:leading-10">
            Make an Informed Choice
          </h2>

          <p className="mt-4 font-poppis text-base font-light leading-8 text-[#555555]">
            JungleZone gives you the tools to discover local childcare, review
            profiles, and conduct your own safety checks.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title}>
              <h3 className="font-poppis text-lg font-medium leading-7 text-[#4C494A]">
                {item.title}
              </h3>

              <p className="mt-2 font-poppis text-sm font-light leading-6 text-[#555555]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
