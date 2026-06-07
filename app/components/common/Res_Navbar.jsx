"use client";
import Link from "next/link";
import { useState } from "react";
import { List, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { MdLogout } from "react-icons/md";
import { getImageUrl } from "@/app/lib/imageUtils";

const Res_Navbar = ({ navItems }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const { user, isLoggedIn, isLoading, logout, loginLocal } = useAuth();

    const dashboardLink =
        user?.role === "sitter" ? "/dashboard/babySitter" : "/dashboard/parent";

    return (
        <nav className="lg:hidden backdrop-blur-2xl shadow-md py-4 px-6 flex justify-between items-center fixed w-full bg-white/80 z-999">
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
            <button
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
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

                    <ul className="flex-1 space-y-2 px-6">
                        {/* Navigation Links */}
                        {
                            navItems?.map((item, i) => (
                                <li key={i} className="py-2">
                                    <Link
                                        href={item.navLink}
                                        onClick={toggleMenu}
                                        className="text-gray-700">
                                        {item.navText}
                                    </Link>
                                </li>
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
                                    className="py-1 px-5 border-2 border-brandColor rounded-xs text-xl font-medium font-poppins text-brandColor text-center"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={toggleMenu}
                                    className="py-1 px-5 border-2 border-brandColor bg-brandColor rounded-xs text-xl font-medium font-poppins text-white text-center"
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