import { useEffect, useState } from "react";
import { toast } from "sonner"; 

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
    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats?.map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border">
                        <p className="text-gray-500 text-sm">{item.label}</p>
                        <p className="text-2xl font-bold mt-2">{item.value}</p>
                    </div>
                ))}
            </div>

            {/*  */}
        </div>
    )
}

export default OverView