import {
  Activity,
  BadgeCheck,
  BookOpenText,
  CreditCard,
  LayoutDashboard,
  Users,
  UserRoundCog,
  UserRoundPlus,
  WalletCards,
} from "lucide-react";

const ICONS = {
  Overview: LayoutDashboard,
  Blogs: BookOpenText,
  Parents: Users,
  Providers: UserRoundCog,
  Approvals: BadgeCheck,
  "Subscription Plans": WalletCards,
  Pricing: WalletCards,
  Payments: CreditCard,
  Reports: Activity,
  "Add Admin": UserRoundPlus,
  Admins: UserRoundCog,
  Activity,
};

const AdminSidebarButton = ({ label, active, onClick }) => {
  const Icon = ICONS[label] || LayoutDashboard;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-medium transition-colors ${
        active
          ? "bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-950/5"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={17} strokeWidth={active ? 2.2 : 1.8} className={active ? "text-emerald-700" : "text-slate-400 group-hover:text-slate-600"} />
      <span className="flex-1">{label}</span>
      {active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
    </button>
  );
};

export default AdminSidebarButton;
