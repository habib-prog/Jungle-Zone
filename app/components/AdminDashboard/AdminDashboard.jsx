"use client";

import { useState } from "react";
import AdminSidebarButton from "../common/AdminSidebarButton";
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
import { Menu, X, ChevronRight, ShieldCheck } from "lucide-react";
import ManageBlogs from "./ManageBlogs";
import Approvals from "./Approvals";

const NAV_GROUPS = [
  {
    title: "WORKSPACE",
    items: [{ label: "Overview", key: "overview" }, { label: "Reports", key: "reports" }],
  },
  {
    title: "PLATFORM",
    items: [
      { label: "Blogs", key: "blogs" },
      { label: "Users", key: "parents" },
      { label: "Providers", key: "sitters" },
      { label: "Approvals", key: "approvals" },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { label: "Pricing", key: "subscription" },
      { label: "Payments", key: "payments" },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      { label: "Add Admin", key: "addAdmin" },
      { label: "Admins", key: "admins" },
      { label: "Activity", key: "activity" },
    ],
  },
];

const TAB_DETAILS = {
  overview: ["Overview", "Your platform at a glance"],
  reports: ["Reports", "Review platform performance"],
  blogs: ["Blogs", "Manage your published content"],
  parents: ["Users", "Manage user accounts and their services"],
  sitters: ["Providers", "Manage babysitter accounts"],
  approvals: ["Approvals", "Review provider applications"],
  subscription: ["Pricing", "Manage subscription plans and service rates"],
  payments: ["Payments", "Review payment activity"],
  addAdmin: ["Add Admin", "Invite a new administrator"],
  admins: ["Admins", "Manage administrator access"],
  activity: ["Activity", "Recent changes across your platform"],
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [title, subtitle] = TAB_DETAILS[activeTab] || ["Dashboard", "Manage your platform"];

  const handleTabChange = (key) => {
    setActiveTab(key);
    setMobileOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <OverView />;
      case "blogs": return <ManageBlogs />;
      case "parents": return <AllParents />;
      case "sitters": return <AllBabySitters />;
      case "approvals": return <Approvals />;
      case "subscription": return <SubscriptionPlans />;
      case "payments": return <PaymentHistory />;
      case "addAdmin": return <AddAdmin />;
      case "admins": return <AllAdmins />;
      case "activity": return <AllActivity />;
      default:
        return (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            <p className="text-lg">{title} section is ready for your real data.</p>
          </div>
        );
    }
  };

  const sidebarContent = (
    <>
      <Link href="/" className="mb-9 inline-flex items-center px-5 pt-7" aria-label="JungleZone home">
        <img loading="lazy" src={logo.src} alt="JungleZone" className="h-auto w-36" />
      </Link>
      <div className="mx-4 mb-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <ShieldCheck size={19} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-800">Admin workspace</p>
          <p className="mt-0.5 text-[11px] text-slate-500">JungleZone platform</p>
        </div>
      </div>
      <nav aria-label="Admin navigation" className="flex-1 space-y-6 overflow-y-auto px-3 pb-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.14em] text-slate-400">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <AdminSidebarButton
                  key={item.key}
                  label={item.label}
                  active={activeTab === item.key}
                  onClick={() => handleTabChange(item.key)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-100 px-5 py-4 text-[11px] text-slate-400">JungleZone Admin <span className="float-right">v1.0</span></div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900 md:flex">
      <aside className="hidden w-[258px] shrink-0 flex-col border-r border-slate-200/80 bg-white md:flex">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-slate-950/40" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] max-w-[86%] flex-col border-r border-slate-200 bg-white shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 z-10 rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close menu"><X size={19} /></button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur md:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden" aria-label="Open menu"><Menu size={19} /></button>
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <span>Admin</span><ChevronRight size={14} />
            </div>
            <span className="truncate text-sm font-semibold text-slate-800">{title}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-2 pr-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">JZ</span>
            <span className="hidden text-xs font-medium text-slate-600 sm:inline">Administrator</span>
          </div>
        </header>

        <section className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-9 md:py-8">
          <div className="mb-6">
            <h1 className="text-[25px] font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <div className="[&>div]:min-w-0">{renderContent()}</div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
