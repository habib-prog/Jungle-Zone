import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { FooterItems } from "../api/fakeApi";
import { services, serviceHref } from "@/app/lib/services";

const socials = [
  { name: "Facebook", href: "https://facebook.com", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { name: "Twitter", href: "https://twitter.com", path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
  { name: "Instagram", href: "https://instagram.com", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { name: "LinkedIn", href: "https://linkedin.com", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
];

const columnTitle = "mb-5 font-poppins text-sm font-semibold uppercase tracking-widest text-brandColor";
const linkClass = "text-base text-gray-700 transition-colors duration-200 hover:text-brandColor";

const Footer = () => {
  return (
    <footer>
      {/* Brand + call to action */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container flex flex-col gap-10 py-14 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div className="max-w-xl">
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/img/logo.png"
                alt="JungleZone Logo"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-lg leading-8 text-gray-600">
              An online directory and introduction service that lets people in the UK find local providers and contact them directly.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/babysitters"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brandColor px-7 py-3.5 text-base font-semibold text-white transition hover:bg-brandColor/90"
            >
              Find a service
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register-babysitter"
              className="inline-flex items-center justify-center rounded-full border border-brandColor px-7 py-3.5 text-base font-semibold text-brandColor transition hover:bg-brandColor hover:text-white"
            >
              Become a provider
            </Link>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          <div>
            <h4 className={columnTitle}>Services</h4>
            <ul className="space-y-3">
              {services.map((svc) => (
                <li key={svc.slug}>
                  <Link href={serviceHref(svc)} className={`${linkClass} inline-flex items-center gap-2`}>
                    {svc.title}
                    {!svc.href && (
                      <span className="rounded-full bg-brandColor/10 px-2 py-0.5 text-[11px] font-semibold uppercase text-brandColor">
                        {svc.status}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {FooterItems?.map((item) => (
            <div key={item.title}>
              <h4 className={columnTitle}>{item.title}</h4>
              <ul className="space-y-3">
                {item.items.map((link) => (
                  <li key={link.name}>
                    <Link href={link.link} className={linkClass}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <h4 className={columnTitle}>Get in touch</h4>
            <a href="mailto:support@junglezone.uk" className={`${linkClass} inline-flex items-center gap-2`}>
              <Mail className="h-4 w-4 text-brandColor" />
              support@junglezone.uk
            </a>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="grid h-11 w-11 place-items-center rounded-full bg-brandColor/10 text-brandColor transition-all duration-300 hover:bg-brandColor hover:text-white"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform notice & company details */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container space-y-5 py-10 text-sm leading-7 text-gray-600">
          <p>
            <strong className="font-semibold text-gray-900">Platform Notice:</strong>{" "}
            JungleZone is an online directory and introduction service. It does not check, verify or vet any provider, does not employ, engage or supervise providers, does not supply the services itself, does not set prices or guarantee any job, and does not take payment for jobs or commission. Providers are independent, self-employed people or businesses, and anything a provider says about themselves is their own statement. Clients should carry out their own checks before hiring. Arrangements, checks and payments are the sole responsibility of the users involved.
          </p>
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <p>
                JungleZone is operated by <strong className="text-gray-900">Jungle Zone Connect Ltd</strong>, a company registered in England and Wales (Company No. [INSERT ACTUAL COMPANY NUMBER]).
              </p>
              <p>Registered office: [INSERT ACTUAL REGISTERED OFFICE ADDRESS]</p>
            </div>
            <p>&copy; {new Date().getFullYear()} JungleZone.uk. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
