"use client";
import { useState } from "react";
import AdminSidebarButton from "../common/AdminSidebarButton"
import OverView from "./OverView";
import AllBabySitters from "./AllBabySitters";
import AllParents from "./AllParents";
import Link from "next/link";
import logo from "../../../public/img/logo.png";
import SubscriptionPlans from "./SubscriptionPlans";

const AdminDashboard = () => {

    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                {/* logo and nav items */}
                <Link href="/" className="w-30 inline-block m-8">
                    <img loading="lazy" src={logo.src} alt="logo" />
                </Link>

                <nav className="flex-1 px-4 space-y-2">
                    <AdminSidebarButton label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                    <AdminSidebarButton label="Parents" active={activeTab === "parents"} onClick={() => setActiveTab("parents")} />
                    <AdminSidebarButton label="Babysitters" active={activeTab === "sitters"} onClick={() => setActiveTab("sitters")} />
                    <AdminSidebarButton label="Subscription Plans" active={activeTab === "subscription"} onClick={() => setActiveTab("subscription")} />
                    <AdminSidebarButton label="Reports" active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
                </nav>
            </aside>


            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold capitalize">{activeTab}</h1>
                    <p className="text-gray-500 text-sm">Admin dashboard for babysitter platform</p>
                </div>

                {/* Overview */}
                {activeTab === "overview" && (
                    <OverView />
                )}

                {/* Parents */}
                {activeTab === "parents" && (
                    <AllParents />
                )}

                {/* Babysitters */}
                {activeTab === "sitters" && (
                    <AllBabySitters />
                )}

                {/* Subscription Plans */}
                {activeTab === "subscription" && (
                    <SubscriptionPlans />
                )}

                {/* Placeholder for other tabs */}
                {!["sitters", "parents", "overview", "subscription"].includes(activeTab) && (
                    <div className="bg-white p-10 rounded-xl border text-center text-gray-500">
                        <p className="text-lg">{activeTab} section UI is ready for your real data.</p>
                        <p className="text-sm mt-2">Connect this to your backend API and you're golden 🚀</p>
                    </div>
                )}
            </main>
        </div>
    )
}
export default AdminDashboard