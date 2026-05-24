
export default function SafetyVerification() {
  const items = [
    {
      title: "Verified Profiles",
      desc: "Every babysitter completes identity verification before accepting jobs.",
    },
    {
      title: "Background Checks",
      desc: "We help parents connect with sitters who pass safety screenings.",
    },
    {
      title: "Ratings & Reviews",
      desc: "Honest feedback from real families builds trust and transparency.",
    },
    {
      title: "Secure Communication",
      desc: "Message and coordinate safely through our trusted platform.",
    },
  ];

  return (
    <section
      className="w-full bg-gray-50 py-12 sm:py-16"
      aria-label="Safety and verification"
    >
      {/* container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-poppis text-3xl font-medium leading-9 text-[#4C494A] sm:text-4xl sm:leading-10">
            Safety Comes First
          </h2>

          <p className="mt-4 font-poppis text-base font-light leading-8 text-[#555555]">
            We focus on trust, transparency, and peace of mind for every family.
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
