"use client";

import React from "react";
import { VscLayout } from "react-icons/vsc";
import { ReceiptIcon, User } from "lucide-react";

import BabySitterDashboardSection from "@/app/components/BabySitterDashboard/BabySitterDashboardSection";
import BabySitterProfile from "@/app/components/BabySitterDashboard/BabySitterProfile";
import SubscriptionSection from "@/app/components/BabySitterDashboard/SubscriptionSection";
import DashboardLayout from "@/app/components/DashboardLayout";

const page = () => {
  const sideNav_items = [
    { key: "dashboard", icon: VscLayout, label: "Dashboard", component: <BabySitterDashboardSection /> },
    { key: "profile", icon: User, label: "Profile", component: <BabySitterProfile /> },
    { key: "subscription", icon: ReceiptIcon, label: "Subscription", component: <SubscriptionSection /> }
  ];

  return (
    <DashboardLayout items={sideNav_items} title="Babysitter Dashboard" />
  );
};

export default page;
