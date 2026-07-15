"use client";
import { useState } from "react";
import AdminSidebarButton from "../common/AdminSidebarButton"
import OverView from "./OverView";
import AllBabySitters from "./AllBabySitters";
import AllParents from "./AllParents";
import AddAdmin from "./AddAdmin";
import AllAdmins from "./AllAdmins";
import AllActivity from "./AllActivity";
import Link from "next/link";
import logo from "../../../public/img/logo.png";
import SubscriptionPlans from "./SubscriptionPlans";
import PaymentHistory from "./PaymentHistory";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", key: "overview" },
  { label: "Parents", key: "parents" },
  { label: "Babysitters", key: "sitters" },
  { label: "Subscription Plans", key: "subscription" },
  { label: "Payments", key: "payments" },
  { label: "Reports", key: "reports" },
  { label: "Add Admin", key: "addAdmin" },
  { label: "Admins", key: "admins" },
  { label: "Activity", key: "activity" },
];

const AdminDashboard = () => {

    const [activeTab, setActiveTab] = useState("overview");
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleTabChange = (key) => {
        setActiveTab(key);
        setMobileOpen(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return <OverView />;
            case "parents":
                return <AllParents />;
            case "sitters":
                return <AllBabySitters />;
            case "subscription":
                return <SubscriptionPlans />;
            case "payments":
                return <PaymentHistory />;
            case "addAdmin":
                return <AddAdmin />;
            case "admins":
                return <AllAdmins />;
            case "activity":
                return <AllActivity />;
            default:
                return (
                    <div className="bg-white p-10 rounded-xl border text-center text-gray-500">
                        <p className="text-lg">{activeTab} section UI is ready for your real data.</p>
                        <p className="text-sm mt-2">Connect this to your backend API and you&apos;re golden 🚀</p>
                    </div>
                );
        }
    };

    const SidebarContent = (
        <>
            <Link href="/" className="inline-block m-6 md:m-8">
                <img loading="lazy" src={logo.src} alt="logo" className="w-28 md:w-30" />
            </Link>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                    <AdminSidebarButton
                        key={item.key}
                        label={item.label}
                        active={activeTab === item.key}
                        onClick={() => handleTabChange(item.key)}
                    />
                ))}
            </nav>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                {SidebarContent}
            </aside>

            {/* Mobile Sidebar Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 h-full w-64 bg-white border-r flex flex-col max-w-[80%]">
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="absolute right-3 top-4 text-gray-500 hover:text-gray-800 cursor-pointer"
                            aria-label="Close menu"
                        >
                            <X size={22} />
                        </button>
                        {SidebarContent}
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 md:p-8">
                {/* Mobile Top Bar */}
                <div className="flex items-center gap-3 mb-4 md:hidden">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-lg border bg-white text-gray-700 cursor-pointer"
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                    <span className="font-semibold capitalize text-lg">{activeTab}</span>
                </div>

                <div className="mb-6 hidden md:block">
                    <h1 className="text-2xl font-semibold capitalize">{activeTab}</h1>
                    <p className="text-gray-500 text-sm">Admin dashboard for babysitter platform</p>
                </div>

                {renderContent()}
            </main>
        </div>
    )
}
export default AdminDashboard
