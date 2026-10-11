"use client";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdLogout } from "react-icons/md";
import { useAuth } from "@/app/context/AuthContext";
import { getImageUrl } from "@/app/lib/imageUtils";
import Res_Navbar from "./Res_Navbar";
import { navItems } from "../api/fakeApi";
import { normalizeRole } from "@/app/lib/roleUtils";
import { services, serviceHref } from "@/app/lib/services";
import { ArrowRight, ChevronDown } from "lucide-react";

const Navbar = ({ overlay = false }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // Transparent over the hero until the page is scrolled.
  const transparent = overlay && !scrolled;
  const { user, isLoggedIn, isLoading, logout, loginLocal } = useAuth();

  const dashboardLink =
    normalizeRole(user?.role) === "babysitter" ? "/dashboard/babySitter" : "/dashboard/parent";

  const servicesMenu = (
              <li className="group relative">
                <button
                  type="button"
                  className={`flex cursor-pointer items-center gap-1 leading-normal font-poppins font-medium text-[13px] tracking-widest uppercase duration-500 hover:text-brandColor ${transparent ? "text-white" : "text-[#4c494a]"}`}
                  aria-haspopup="true"
                >
                  Services
                  <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full z-50 w-[520px] -translate-x-1/2 pt-4 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="grid grid-cols-2 gap-1 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl">
                    {services.map((svc) => (
                      <Link
                        key={svc.slug}
                        href={serviceHref(svc)}
                        className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-brandColor/5"
                      >
                        <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-brandColor/10 text-brandColor">
                          <svc.icon className="h-4 w-4" />
                        </span>
                        <span className="normal-case tracking-normal">
                          <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                            {svc.title}
                            {!svc.href && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
                                {svc.status}
                              </span>
                            )}
                          </span>
                          <span className="block text-xs leading-5 text-gray-500">{svc.desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
  );

  return (
    <>
      <nav
        id="Navbar"
        className={`py-4 w-full z-50 hidden lg:block transition-colors duration-300 ${
          overlay ? "fixed top-0 inset-x-0" : "bg-white/80"
        } ${overlay && scrolled ? "bg-white shadow-md" : ""}`}
      >
        <div className="mx-auto w-full max-w-[1600px] px-[10px]">
          <div className=" flex justify-between items-center">
            {/* logo and nav items */}
            <div className="flex gap-5 items-center flex-wrap">
              <Link href={"/"}>
                <Image
                  width={100}
                  height={50}
                  src={"/img/logo.png"}
                  alt="logo"
                  className={transparent ? "brightness-0 invert" : ""}
                />
              </Link>
            </div>
            {/* ------------------- menu items */}
            <ul className="flex gap-10 items-center  ">
              {navItems?.map((item, i) => (
                <Fragment key={i}>
                  <li>
                    <Link
                      className={`leading-normal font-poppins font-medium text-[13px] tracking-widest uppercase duration-500 hover:text-brandColor ${transparent ? "text-white" : "text-[#4c494a]"}`}
                      href={item.navLink}
                    >
                      {item.navText}
                    </Link>
                  </li>
                  {i === 0 && servicesMenu}
                </Fragment>
              ))}
            </ul>
            {/* ------------ profile */}
            {/* Auth section */}
            {isLoading ? (
              // Prevents flicker — shows nothing while session loads
              <div className="w-24 h-8 bg-gray-100 rounded animate-pulse" />

            ) : isLoggedIn ? (
              <div className="flex gap-3 items-center">
                <Link href={dashboardLink} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    {user.image && (
                      <img
                        loading="lazy"
                        src={getImageUrl(user.image) ?? "/img/user-placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h2 className={`text-lg font-medium font-poppins ${transparent ? "text-white" : "text-gray-700"}`}>
                    {user.name}
                  </h2>
                </Link>
                <button onClick={logout} className={`cursor-pointer ${transparent ? "text-white" : ""}`}>
                  <MdLogout />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`rounded-full px-5 py-2 text-sm font-semibold font-poppins transition ${
                    transparent
                      ? "text-white hover:bg-white/15"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold font-poppins shadow-sm transition hover:-translate-y-0.5 ${
                    transparent
                      ? "bg-white text-brandColor hover:bg-gray-100"
                      : "bg-brandColor text-white hover:bg-brandColor/90"
                  }`}
                >
                  Sign Up
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav >
      <Res_Navbar navItems={navItems} transparent={transparent} />
    </>
  );
};

export default Navbar;
