"use client";
import Image from "next/image";
import Link from "next/link";
import { MdLogout } from "react-icons/md";
import { useAuth } from "@/app/context/AuthContext";
import Res_Navbar from "./Res_Navbar";
import { navItems } from "../api/fakeApi";

const Navbar = () => {
  const { user, isLoggedIn, isLoading, logout, loginLocal } = useAuth();

  const dashboardLink =
    user?.role === "sitter" ? "/dashboard/babySitter" : "/dashboard/parent";

  return (
    <>
      <nav
        id="Navbar"
        className="py-4  w-full z-10 bg-white/80 backdrop:blur-[20px] hidden lg:block"
      >
        <div className="container">
          <div className=" flex justify-between items-center">
            {/* logo and nav items */}
            <div className="flex gap-5 items-center flex-wrap">
              <Link href={"/"}>
                <Image
                  width={100}
                  height={50}
                  src={"/img/logo.png"}
                  alt="logo"
                />
              </Link>
            </div>
            {/* ------------------- menu items */}
            <ul className="flex gap-15 items-center  ">
              {navItems?.map((item, i) => (
                <li key={i}>
                  <Link
                    className="  font-poppins font-medium text-[13px] tracking-widest uppercase text-[#4c494a] duration-500 hover:text-brandColor  "
                    href={item.navLink}
                  >
                    {item.navText}
                  </Link>
                </li>
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
                        src={`/api/${user.image}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h2 className="text-lg font-medium font-poppins text-gray-700">
                    {user.name}
                  </h2>
                </Link>
                <button onClick={logout} className="cursor-pointer">
                  <MdLogout />
                </button>
              </div>
            ) : (
              <div className="flex gap-3 items-center">
                <Link
                  href="/login"
                  className="py-1 px-5 border-2 border-brandColor rounded-xs text-sm font-medium font-poppins text-brandColor"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="py-1 px-5 border-2 border-brandColor bg-brandColor rounded-xs text-sm font-medium font-poppins text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav >
      <Res_Navbar navItems={navItems} />
    </>
  );
};

export default Navbar;
