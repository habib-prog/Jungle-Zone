"use client";

import { VscLayout } from "react-icons/vsc";
import { ReceiptIcon, User } from "lucide-react";
import DashboardSection from "@/app/components/ParentDashboard/DashboardSection";
import SubscriptionSection from "@/app/components/ParentDashboard/SubscriptionSection";
import ProfileSection from "@/app/components/ParentDashboard/ProfileSection";
import DashboardLayout from "@/app/components/DashboardLayout";

const page = () => {
  const sideNav_items = [
    { key: "dashboard", icon: VscLayout, label: "Dashboard", component: <DashboardSection /> },
    { key: "subscription", icon: ReceiptIcon, label: "Subscription", component: <SubscriptionSection /> },
    { key: "profile", icon: User, label: "Profile", component: <ProfileSection /> }
  ];

  return (
    <DashboardLayout items={sideNav_items} title="Parent Dashboard" />
  );
};

export default page;
