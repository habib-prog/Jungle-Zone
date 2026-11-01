import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Banknote, ClipboardCheck, Users, UserRound } from "lucide-react";

const STAT_STYLES = [
  { icon: Users, iconBg: "bg-sky-50", iconColor: "text-sky-700", accent: "bg-sky-500", note: "Registered on the platform" },
  { icon: UserRound, iconBg: "bg-violet-50", iconColor: "text-violet-700", accent: "bg-violet-500", note: "Care providers on the platform" },
  { icon: ClipboardCheck, iconBg: "bg-amber-50", iconColor: "text-amber-700", accent: "bg-amber-500", note: "Applications awaiting review" },
  { icon: Banknote, iconBg: "bg-emerald-50", iconColor: "text-emerald-700", accent: "bg-emerald-500", note: "Total recorded platform revenue" },
];

const OverView = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/overview");
        const data = await res.json();
        const formattedStats = [
          { label: "Total Parents", value: data.totalParents || 0 },
          { label: "Total Babysitters", value: data.totalBabysitters || 0 },
          { label: "Pending Approvals", value: data.pendingApprovals || 0 },
          { label: "Total Revenue", value: `৳${(data.totalRevenue || 0).toLocaleString()}` },
        ];
        setStats(formattedStats);
      } catch (error) {
        toast.error(error.message || "Failed to fetch overview stats:");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading overview" aria-busy="true">
        {STAT_STYLES.map((item) => (
          <div key={item.note} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-5 h-10 w-10 rounded-xl bg-slate-100" />
            <div className="h-3 w-28 rounded bg-slate-100" />
            <div className="mt-3 h-7 w-16 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const style = STAT_STYLES[index];
          const Icon = style.icon;

          return (
            <article
              key={item.label}
              className="group relative isolate overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.025)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)] sm:p-6"
            >
              <div className={`absolute inset-y-0 left-0 w-1 ${style.accent} opacity-70 transition-opacity group-hover:opacity-100`} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium text-slate-500">{item.label}</p>
                  <p className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-slate-900">{item.value}</p>
                </div>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${style.iconBg} ${style.iconColor}`}>
                  <Icon size={20} strokeWidth={1.9} />
                </span>
              </div>
              <p className="mt-5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">{style.note}</p>
            </article>
          );
        })}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 text-xs text-slate-500">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Platform overview and account totals
      </div>
    </div>
  );
};

export default OverView;
