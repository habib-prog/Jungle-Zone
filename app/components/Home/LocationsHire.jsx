// components/Home/LocationsHire.jsx
import Image from "next/image";

export default function LocationsHire() {
  const cards = [
    {
      title: "Find by Zip Code",
      desc: "Search trusted babysitters near you and compare profiles in minutes.",
      img: "/img/location.jpg",
      alt: "Neighborhood playground location",
      cta: "VIEW MORE",
      href: "#",
    },
    {
      title: "Hire Your Babysitter",
      desc: "Book confidently with verified sitters and flexible scheduling options.",
      img: "/img/baby.jpg",
      alt: "Happy child enjoying snack",
      cta: "VIEW MORE",
      href: "#",
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16" aria-label="Locations and Hiring">
      {/* container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {cards.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-2"
            >
              {/* Image */}
              <figure className="w-full">
                <Image
                  src={item.img}
                  alt={item.alt}
                  width={520}
                  height={520}
                  className="h-auto w-full object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  loading="lazy"
                />
              </figure>

              {/* Content */}
              <div>
                <h3 className="font-poppis text-2xl font-medium leading-7 text-[#4C494A]">
                  {item.title.toUpperCase()}
                </h3>

                <p className="mt-3 max-w-xs font-poppis text-sm font-light leading-6 text-[#555555]">
                  {item.desc}
                </p>

                <a
                  href={item.href}
                  className="mt-5 inline-block font-daughter text-xs font-medium leading-6 text-brandColor"
                  aria-label={`${item.cta} - ${item.title}`}
                >
                  {item.cta}
                  <span className="mt-1 block h-0.5 w-20 bg-brandColor" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
