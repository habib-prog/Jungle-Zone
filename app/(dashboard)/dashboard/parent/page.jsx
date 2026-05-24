"use client";

import logo from "../../../../public/img/logo.png";
import Link from "next/link";
import { VscLayout } from "react-icons/vsc";
import { useState } from "react";
import DashboardSection from "@/app/components/ParentDashboard/DashboardSection";
import SubscriptionSection from "@/app/components/ParentDashboard/SubscriptionSection";
import ProfileSection from "@/app/components/ParentDashboard/ProfileSection";
import { ReceiptIcon, User } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const page = () => {
    const { logout } = useAuth();
    const sideNav_items = [
        { key: "dashboard", icon: VscLayout, label: "Dashboard", component: <DashboardSection /> },
        { key: "subscription", icon: ReceiptIcon, label: "Subscription", component: <SubscriptionSection /> },
        { key: "profile", icon: User, label: "Profile", component: <ProfileSection /> }
    ];

    const [active, setActive] = useState("dashboard");

    const currentComponent = sideNav_items.find((item) => item.key === active)?.component;

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-60 bg-white border-r border-gray-200 min-h-screen p-3">
                <Link href="/" className="w-30 inline-block mb-10">
                    <img loading="lazy" src={logo.src} alt="logo" />
                </Link>

                <div className="space-y-2">
                    {sideNav_items?.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActive(item.key)}
                            className={`cursor-pointer w-full py-1 rounded-sm text-white text-lg font-medium font-poppins text-center flex justify-center gap-2 items-center transition-opacity
                ${active === item.key ? "bg-brandColor opacity-100" : "bg-brandColor opacity-50 hover:opacity-75"}`}
                        >
                            {<item.icon />} {item.label}
                        </button>
                    ))}
                    <button
                        onClick={logout}
                        className={`cursor-pointer w-full py-1 rounded-sm text-white text-lg font-medium font-poppins text-center flex justify-center gap-2 items-center transition-opacity
                bg-brandColor opacity-50 hover:opacity-75`}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content — renders whichever section is active */}
            <main className="flex-1 min-h-screen bg-gray-100">
                {currentComponent}
            </main>
        </div>
    );
};

export default page;