"use client";
import { useAuth } from '@/app/context/AuthContext';
import { Rate, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { getImageUrl } from '@/app/lib/imageUtils';

const DashboardSection = () => { 
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [ongoingDeals, setOngoingDeals] = useState([]);
    const [dealHistory, setDealHistory] = useState([]);

    useEffect(() => {
        fetch("/api/parent/profile")
            .then(r => r.json())
            .then(data => {
                if (data.parent) setProfile(data.parent);
            });
    }, []);

    const stats = {
        totalDeals:    profile?.totalDeals    ?? 0,
        totalSpent:    profile?.totalSpent    ?? 0,
        ongoingDeals:  ongoingDeals.length,
        wallet:        profile?.wallet        ?? 0,
    };

    const getStatusColor = (status) => {
        if (status === "completed") return "green";
        if (status === "ongoing")   return "blue";
        if (status === "cancelled") return "red";
    };

    const getStatusText = (status) =>
        status.charAt(0).toUpperCase() + status.slice(1);

    const avatarSrc = getImageUrl(profile?.picture || authUser?.image) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || authUser?.name || "U")}&background=random`;

    return (
        <section className="flex-1 min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gray-100 border-b border-gray-200">
                <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-4 xl:py-6 flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl xl:text-3xl font-semibold font-poppins text-gray-800">
                            Parent Dashboard
                        </h1>
                        <p className="text-sm xl:text-base text-gray-500 font-poppins">
                            Overview of your bookings & spending
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-6 xl:py-10">
                {/* TOP GRID */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 xl:gap-7">
                    {/* Profile Card */}
                    <section className="xl:col-span-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="p-5 sm:p-6 xl:p-8 xl:min-h-80">
                            <div className="flex items-start gap-4 xl:gap-5">
                                <div className="w-16 h-16 sm:w-18 sm:h-18 xl:w-20 xl:h-20 rounded-full overflow-hidden border-4 border-brandColor bg-gray-100 shrink-0">
                                    {profile ? (
                                        <img className="w-full h-full object-cover" src={avatarSrc} alt="profile" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    {profile ? (
                                        <>
                                            <h2 className="text-lg sm:text-xl xl:text-2xl font-semibold font-poppins text-gray-800 truncate">
                                                {profile.fullName || authUser?.name}
                                            </h2>
                                            <p className="text-sm xl:text-base text-gray-500 font-poppins truncate">
                                                {profile.email}
                                            </p>
                                            <p className="text-sm xl:text-base text-gray-500 font-poppins">
                                                {profile.phone || "—"}
                                            </p>
                                        </>
                                    ) : (
                                        <div className="space-y-2 mt-1">
                                            <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
                                            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                                            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 xl:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-5">
                                <div className="rounded-md border border-gray-200 bg-white p-4 xl:p-6">
                                    <p className="text-xs xl:text-sm text-gray-500 font-poppins">Total Deals</p>
                                    <p className="text-xl xl:text-3xl font-semibold font-poppins text-gray-800 mt-2">
                                        {stats.totalDeals}
                                    </p>
                                </div>
                                <div className="rounded-md border border-gray-200 bg-white p-4 xl:p-6">
                                    <p className="text-xs xl:text-sm text-gray-500 font-poppins">Ongoing Bookings</p>
                                    <p className="text-xl xl:text-3xl font-semibold font-poppins text-gray-800 mt-2">
                                        {stats.ongoingDeals}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right: 2x2 Cards */}
                    <section className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-7">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-8 flex flex-col justify-between">
                            <div>
                                <p className="text-sm xl:text-base text-gray-500 font-poppins">Total Spent</p>
                                <div className="flex items-end justify-between gap-3">
                                    <p className="text-2xl xl:text-3xl font-semibold font-poppins text-gray-800">
                                        ${stats.totalSpent.toLocaleString()}
                                    </p>
                                    <span className="text-xs xl:text-sm text-gray-400 font-poppins">lifetime</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm xl:text-base text-gray-500 font-poppins">Wallet</p>
                                <div className="mt-3">
                                    <p className="text-2xl xl:text-3xl font-semibold font-poppins text-gray-800">
                                        ${stats.wallet.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-8 flex flex-col justify-between">
                            <div>
                                <p className="text-sm xl:text-base text-gray-500 font-poppins">Total Deals</p>
                                <p className="text-2xl xl:text-3xl font-semibold font-poppins text-gray-800">
                                    {stats.totalDeals}
                                </p>
                                <p className="text-xs xl:text-sm text-gray-400 font-poppins mt-2">With different sitters</p>
                            </div>
                            <div>
                                <p className="text-sm xl:text-base text-gray-500 font-poppins">Ongoing Bookings</p>
                                <p className="text-2xl xl:text-3xl font-semibold font-poppins text-gray-800">
                                    {stats.ongoingDeals}
                                </p>
                                <p className="text-xs xl:text-sm text-gray-400 font-poppins mt-2">Active bookings</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ONGOING DEALS */}
                <section className="mt-6 xl:mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 sm:px-6 xl:px-8 py-4 xl:py-5 flex items-center justify-between border-b border-gray-100">
                        <h3 className="text-base xl:text-lg font-semibold font-poppins text-gray-800">Ongoing Bookings</h3>
                        <span className="text-sm xl:text-base text-gray-500 font-poppins">{ongoingDeals.length} active</span>
                    </div>

                    {ongoingDeals.length === 0 ? (
                        <div className="px-6 py-10 text-center text-gray-400 font-poppins text-sm">
                            No ongoing bookings
                        </div>
                    ) : (
                        <>
                            {/* Desktop */}
                            <div className="hidden lg:block">
                                <div className="grid grid-cols-12 gap-2 px-6 xl:px-8 py-3 bg-gray-50 text-xs xl:text-sm font-medium text-gray-600">
                                    <div className="col-span-1">Sitter</div>
                                    <div className="col-span-2">Name</div>
                                    <div className="col-span-2">Schedule</div>
                                    <div className="col-span-2">Duration</div>
                                    <div className="col-span-2">Price</div>
                                    <div className="col-span-3">Status</div>
                                </div>
                                {ongoingDeals.map((deal, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 px-6 xl:px-8 py-5 xl:py-6 border-t border-gray-100 items-center">
                                        <div className="col-span-1">
                                            <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full overflow-hidden bg-gray-100">
                                                <img className="w-full h-full object-cover" src={deal.sitterImg} alt={deal.sitterName} />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm xl:text-base font-medium text-gray-800 font-poppins">{deal.sitterName}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm xl:text-base text-gray-600 font-poppins">{deal.date}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm xl:text-base text-gray-600 font-poppins">{deal.duration}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm xl:text-base font-semibold text-gray-800 font-poppins">{deal.price}</p>
                                        </div>
                                        <div className="col-span-3">
                                            <Tag color={getStatusColor(deal.status)}>{getStatusText(deal.status)}</Tag>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile */}
                            <div className="lg:hidden border-t border-gray-100 p-4 space-y-3">
                                {ongoingDeals.map((deal, idx) => (
                                    <div key={idx} className="rounded-lg border border-gray-200 p-4 bg-white">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                                <img className="w-full h-full object-cover" src={deal.sitterImg} alt={deal.sitterName} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold font-poppins text-gray-800 truncate">{deal.sitterName}</p>
                                                <p className="text-xs text-gray-500 font-poppins">{deal.date}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 font-poppins">Duration</span>
                                                <p className="text-sm font-medium text-gray-800 font-poppins">{deal.duration}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 font-poppins">Price</span>
                                                <p className="text-sm font-semibold text-gray-800 font-poppins">{deal.price}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 font-poppins">Status</span>
                                                <Tag color={getStatusColor(deal.status)}>{getStatusText(deal.status)}</Tag>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* DEAL HISTORY */}
                <section className="mt-6 xl:mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 sm:px-6 xl:px-8 py-4 xl:py-5 flex items-center justify-between border-b border-gray-100">
                        <h3 className="text-base xl:text-lg font-semibold font-poppins text-gray-800">Booking History</h3>
                        <span className="text-sm xl:text-base text-gray-500 font-poppins">{dealHistory.length} total</span>
                    </div>

                    {dealHistory.length === 0 ? (
                        <div className="px-6 py-10 text-center text-gray-400 font-poppins text-sm">
                            No booking history yet
                        </div>
                    ) : (
                        <>
                            {/* Desktop */}
                            <div className="hidden lg:block">
                                <div className="grid grid-cols-12 gap-2 px-6 xl:px-8 py-3 bg-gray-50 text-xs xl:text-sm font-medium text-gray-600">
                                    <div className="col-span-1">Sitter</div>
                                    <div className="col-span-3">Name</div>
                                    <div className="col-span-2">Date</div>
                                    <div className="col-span-2">Price</div>
                                    <div className="col-span-2">Rating</div>
                                    <div className="col-span-2">Status</div>
                                </div>
                                {dealHistory.map((deal, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 px-6 xl:px-8 py-5 xl:py-6 border-t border-gray-100 items-center">
                                        <div className="col-span-1">
                                            <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full overflow-hidden bg-gray-100">
                                                <img className="w-full h-full object-cover" src={deal.sitterImg} alt={deal.sitterName} />
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-sm xl:text-base font-medium text-gray-800 font-poppins">{deal.sitterName}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm xl:text-base text-gray-600 font-poppins">{deal.date}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm xl:text-base font-semibold text-gray-800 font-poppins">{deal.price}</p>
                                        </div>
                                        <div className="col-span-2">
                                            {deal.status === "completed"
                                                ? <Rate disabled defaultValue={deal.rating} />
                                                : <span className="text-sm text-gray-400 font-poppins">N/A</span>
                                            }
                                        </div>
                                        <div className="col-span-2">
                                            <Tag color={getStatusColor(deal.status)}>{getStatusText(deal.status)}</Tag>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile */}
                            <div className="lg:hidden border-t border-gray-100 p-4 space-y-3">
                                {dealHistory.map((deal, idx) => (
                                    <div key={idx} className="rounded-lg border border-gray-200 p-4 bg-white">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                                <img className="w-full h-full object-cover" src={deal.sitterImg} alt={deal.sitterName} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold font-poppins text-gray-800 truncate">{deal.sitterName}</p>
                                                <p className="text-xs text-gray-500 font-poppins">{deal.date}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 font-poppins">Price</span>
                                                <p className="text-sm font-semibold text-gray-800 font-poppins">{deal.price}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 font-poppins">Rating</span>
                                                {deal.status === "completed"
                                                    ? <Rate disabled defaultValue={deal.rating} />
                                                    : <span className="text-sm text-gray-400 font-poppins">N/A</span>
                                                }
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 font-poppins">Status</span>
                                                <Tag color={getStatusColor(deal.status)}>{getStatusText(deal.status)}</Tag>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </section>
    );
};

export default DashboardSection;