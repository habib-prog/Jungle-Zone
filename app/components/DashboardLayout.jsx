"use client";

import { useState } from "react";
import logo from "../../public/img/logo.png";
import Link from "next/link";
import { VscLayout } from "react-icons/vsc";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { useAuth } from "@/app/context/AuthContext";

const DashboardLayout = ({ items, title }) => {
  const { logout } = useAuth();
  const [active, setActive] = useState(items[0]?.key);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentComponent = items.find((item) => item.key === active)?.component;

  const handleNav = (key) => {
    setActive(key);
    setSidebarOpen(false);
  };

  const navButtons = (
    <div className="space-y-2">
      {items?.map((item) => (
        <button
          key={item.key}
          onClick={() => handleNav(item.key)}
          className={`cursor-pointer w-full py-2 rounded-sm text-white text-base sm:text-lg font-medium font-poppins text-center flex justify-center gap-2 items-center transition-opacity
          ${active === item.key ? "bg-brandColor opacity-100" : "bg-brandColor opacity-50 hover:opacity-75"}`}
        >
          {<item.icon />} {item.label}
        </button>
      ))}
      <button
        onClick={() => {
          setSidebarOpen(false);
          logout();
        }}
        className="cursor-pointer w-full py-2 rounded-sm text-white text-base sm:text-lg font-medium font-poppins text-center flex justify-center gap-2 items-center transition-opacity bg-brandColor opacity-50 hover:opacity-75"
      >
        Logout
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:bg-white md:border-r md:border-gray-200 md:p-3">
        <Link href="/" className="inline-block mb-10">
          <img loading="lazy" src={logo.src} alt="logo" className="h-10 w-auto" />
        </Link>
        {navButtons}
      </aside>

      {/* Mobile Sidebar (overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-60 bg-white border-r border-gray-200 p-3 overflow-y-auto">
            <div className="flex items-center justify-between mb-10">
              <Link href="/" onClick={() => setSidebarOpen(false)}>
                <img loading="lazy" src={logo.src} alt="logo" className="h-10 w-auto" />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-600"
                aria-label="Close menu"
              >
                <RxCross2 className="w-5 h-5" />
              </button>
            </div>
            {navButtons}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-700"
            aria-label="Open menu"
          >
            <RxHamburgerMenu className="w-6 h-6" />
          </button>
          <span className="text-sm font-semibold font-poppins text-gray-800">
            {title}
          </span>
          <span className="w-6" />
        </div>

        <div className="flex-1 min-w-0">{currentComponent}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
