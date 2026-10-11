"use client";
import Link from "next/link";
import { Fragment, useState } from "react";
import { List, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { MdLogout } from "react-icons/md";
import { getImageUrl } from "@/app/lib/imageUtils";
import { normalizeRole } from "@/app/lib/roleUtils";
import { services, serviceHref } from "@/app/lib/services";

const Res_Navbar = ({ navItems, transparent = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const { user, isLoggedIn, isLoading, logout, loginLocal } = useAuth();

    const dashboardLink =
        normalizeRole(user?.role) === "babysitter" ? "/dashboard/babySitter" : "/dashboard/parent";

    return (
        <nav className={`lg:hidden py-4 px-6 flex justify-between items-center fixed w-full z-999 transition-colors duration-300 ${transparent ? "bg-transparent" : "backdrop-blur-2xl shadow-md bg-white/90"}`}>
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
            <button
                className={`focus:outline-none ${transparent ? "text-white" : "text-gray-700 hover:text-blue-600"}`}
                onClick={toggleMenu}
            >
                <List />
            </button>
            {isOpen && (
                <div
                    className="fixed inset-0 h-dvh bg-black/60 backdrop-blur-sm z-20"
                    onClick={toggleMenu}
                ></div>
            )}
            <div className={`shadow-lg fixed top-0 right-0 w-2/3 h-dvh z-30 duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                <div className="bg-white h-dvh flex flex-col">
                    <div className="flex justify-end py-4 px-6">
                        <button
                            className="text-gray-700 hover:text-blue-600 focus:outline-none"
                            onClick={toggleMenu}
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <ul className="flex-1 space-y-2 overflow-y-auto px-6">
                        {/* Navigation Links */}
                        {
                            navItems?.map((item, i) => (
                                <Fragment key={i}>
                                    <li className="py-2">
                                        <Link
                                            href={item.navLink}
                                            onClick={toggleMenu}
                                            className="text-gray-700">
                                            {item.navText}
                                        </Link>
                                    </li>
                                    {i === 0 && (
                        <li className="py-2">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-brandColor">Services</div>
                            <ul className="space-y-1 border-l border-gray-200 pl-3">
                                {services.map((svc) => (
                                    <li key={svc.slug}>
                                        <Link
                                            href={serviceHref(svc)}
                                            onClick={toggleMenu}
                                            className="flex items-center gap-2 py-1 text-sm text-gray-700">
                                            <svc.icon className="h-4 w-4 text-brandColor" />
                                            {svc.title}
                                            {!svc.href && <span className="text-[10px] uppercase text-gray-400">{svc.status}</span>}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                                    )}
                                </Fragment>
                            ))
                        }
                    </ul>

                    {/* ------------ profile */}
                    <div className="border-t border-gray-200 p-6">
                        {/* Auth section */}
                        {isLoading ? (
                            <div className="w-24 h-8 bg-gray-100 rounded animate-pulse" />

                        ) : isLoggedIn ? (
                            <div className="flex gap-3 items-center justify-between">
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
                                    <h2 className="text-lg font-medium font-poppins text-gray-700">
                                        {user.name}
                                    </h2>
                                </Link>
                                <button onClick={logout} className="cursor-pointer">
                                    <MdLogout />
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 ">
                                <Link
                                    href="/login"
                                    onClick={toggleMenu}
                                    className="rounded-full border border-gray-300 px-5 py-2.5 text-base font-semibold font-poppins text-gray-800 text-center"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={toggleMenu}
                                    className="rounded-full bg-brandColor px-5 py-2.5 text-base font-semibold font-poppins text-white text-center"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Res_Navbar;
