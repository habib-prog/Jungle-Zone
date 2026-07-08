"use client";
import { Rate } from "antd";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/app/lib/imageUtils";

const BabySitterDashboardSection = () => {
  const [profile, setProfile] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  useEffect(() => {
    fetch("/api/babysitters/profile")
      .then(r => r.json())
      .then(data => {
        if (data.sitter) setProfile(data.sitter);
      });

    fetch("/api/payment/subscription")
      .then(r => r.json())
      .then(data => {
        if (data.subscription) setActiveSub(data.subscription);
      })
      .catch(() => {});
  }, []);

  const renderPlanBadge = () => {
    if (activeSub) {
      return `Active: ${activeSub.plan} (${activeSub.billingCycle})`;
    }
    if (profile?.subscription === 'trial') {
      const remaining = profile.subscriptionExpiry 
        ? Math.ceil((new Date(profile.subscriptionExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) 
        : 0;
      return `Free Trial ${remaining > 0 ? '(' + remaining + ' days left)' : '(Expired)'}`;
    }
    return `Free Plan`;
  };

  const avatarSrc = getImageUrl(profile?.profilePhoto) ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || "S")}&background=random`;
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-4 xl:py-6">
          <h1 className="text-xl sm:text-2xl xl:text-3xl font-semibold font-poppins text-gray-800">
            Baby Sitter Dashboard
          </h1>
          <p className="text-sm xl:text-base text-gray-500 font-poppins">
            Overview of your profile & performance
          </p>
        </div>
      </div>

      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-6 xl:py-10">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 xl:gap-7">
          {/* Profile Card */}
          <section className="xl:col-span-5 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-5 sm:p-6 xl:p-8 xl:min-h-80">
              <div className="flex items-start gap-4 xl:gap-5">
                <div className="w-16 h-16 sm:w-18 sm:h-18 xl:w-20 xl:h-20 rounded-full overflow-hidden border-4 border-brandColor bg-gray-100 shrink-0 hover:bg-brandColor/80 cursor-pointer">
                  <img
                    loading="lazy"
                    className="w-full h-full object-cover"
                    src={avatarSrc}
                    alt="profile"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl xl:text-2xl font-semibold font-poppins text-gray-800 truncate">
                    {profile?.fullName}
                  </h2>
                  <p className="text-sm xl:text-base text-gray-500 font-poppins truncate">
                    {profile?.email}
                  </p>
                  <p className="text-sm xl:text-base text-gray-500 font-poppins">
                    {profile?.phoneNumber}
                  </p>
                  
                  {profile && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandColor/10 border border-brandColor/20">
                        <div className="w-2 h-2 rounded-full bg-brandColor" />
                        <span className="text-xs font-medium text-brandColor font-poppins">
                            Plan: {renderPlanBadge()}
                        </span>
                    </div>
                  )}

                  <div className="mt-3 xl:mt-4 flex items-center gap-3">
                    <Rate disabled defaultValue={profile?.rating} />
                    <span className="text-sm xl:text-base text-gray-600 font-poppins">
                      {profile?.rating}.0 rating
                    </span>
                  </div>
                </div>
              </div>

              {/* inner mini cards */}
              {/* <div className="mt-6 xl:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-5">
                <div className="rounded-md border border-gray-200 bg-white p-4 xl:p-6">
                  <p className="text-xs xl:text-sm text-gray-500 font-poppins">
                    Total Work Done
                  </p>
                  <p className="text-xl xl:text-3xl font-semibold font-poppins text-gray-800 mt-2">
                    {stats.totalWorkDone}
                  </p>
                </div>

                <div className="rounded-md border border-gray-200 bg-white p-4 xl:p-6">
                  <p className="text-xs xl:text-sm text-gray-500 font-poppins">
                    Running Work
                  </p>
                  <p className="text-xl xl:text-3xl font-semibold font-poppins text-gray-800 mt-2">
                    {stats.runningWork}
                  </p>
                </div>
              </div> */}
            </div>
          </section>

          {/* Right: 2x2 Cards */}
          <section className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-7">
            {/* earnings */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-8 xl:min-h-[150px]">
              <p className="text-sm xl:text-base text-gray-500 font-poppins">
                Total Earnings
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-2xl xl:text-3xl font-semibold font-poppins text-gray-800">
                  {/* ${stats.totalEarnings.toLocaleString()} */}
                </p>
                <span className="text-xs xl:text-sm text-gray-400 font-poppins">
                  updated today
                </span>
              </div>
            </div>

            {/* success donut */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-8 xl:min-h-[150px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm xl:text-base text-gray-500 font-poppins">
                    Success Score
                  </p>
                  <p className="text-2xl xl:text-3xl font-semibold font-poppins text-gray-800 mt-3">
                    {/* {stats.successScore}% */}
                  </p>
                  <p className="text-xs xl:text-sm text-gray-400 font-poppins mt-2">
                    Based on completed jobs
                  </p>
                </div>

                <div className="w-[92px] h-[92px] xl:w-[120px] xl:h-[120px] relative shrink-0">
                  {/* <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={32}
                        outerRadius={44}
                        paddingAngle={2}
                        stroke="none"
                        isAnimationActive
                      >
                        <Cell fill="#0ea5e9" />
                        <Cell fill="#e5e7eb" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer> */}

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs xl:text-sm font-semibold text-gray-700">
                      {/* {stats.successScore}% */}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* total work */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-8 xl:min-h-[150px]">
              <p className="text-sm xl:text-base text-gray-500 font-poppins">
                Total Work Done
              </p>
              <p className="text-2xl xl:text-3xl font-semibold font-poppins text-gray-800 mt-3">
                {/* {stats.totalWorkDone} */}
              </p>
              <p className="text-xs xl:text-sm text-gray-400 font-poppins mt-2">
                Completed tasks overall
              </p>
            </div>

            {/* running work */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-8 xl:min-h-[150px]">
              <p className="text-sm xl:text-base text-gray-500 font-poppins">
                Total Running Work
              </p>
              <p className="text-2xl xl:text-3xl font-semibold font-poppins text-gray-800 mt-3">
                {/* {stats.runningWork} */}
              </p>
              <p className="text-xs xl:text-sm text-gray-400 font-poppins mt-2">
                Active tasks in progress
              </p>
            </div>
          </section>
        </div>

        {/* REVIEWS */}
        <section className="mt-6 xl:mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 xl:px-8 py-4 xl:py-5 flex items-center justify-between">
            <h3 className="text-base xl:text-lg font-semibold font-poppins text-gray-800">
              Reviews
            </h3>
            <span className="text-sm xl:text-base text-gray-500 font-poppins">
              {/* {reviews.length} total */}
            </span>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-2 px-6 xl:px-8 py-3 bg-gray-50 text-xs xl:text-sm font-medium text-gray-600">
              <div className="col-span-1">Image</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Star</div>
              <div className="col-span-5">Comments</div>
            </div>

            {/* {reviews.map((r, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 px-6 xl:px-8 py-5 xl:py-6 border-t border-gray-100 items-center"
              >
                <div className="col-span-1">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full overflow-hidden bg-gray-100">
                    <img
                      className="w-full h-full object-cover"
                      src={r.img}
                      alt={r.name}
                    />
                  </div>
                </div>

                <div className="col-span-3">
                  <p className="text-sm xl:text-base font-medium text-gray-800 font-poppins">
                    {r.name}
                  </p>
                </div>

                <div className="col-span-3">
                  <Rate disabled defaultValue={r.star} />
                </div>

                <div className="col-span-5">
                  <p className="text-sm xl:text-base text-gray-600 font-poppins">
                    {r.comment}
                  </p>
                </div>
              </div>
            ))} */}
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden border-t border-gray-100">
            {/* <div className="p-4 space-y-3">
              {reviews.map((r, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-gray-200 p-4 bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                      <img
                        className="w-full h-full object-cover"
                        src={r.img}
                        alt={r.name}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold font-poppins text-gray-800 truncate">
                        {r.name}
                      </p>
                      <div className="mt-1">
                        <Rate disabled defaultValue={r.star} />
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 font-poppins mt-3">
                    {r.comment}
                  </p>
                </div>
              ))}
            </div> */}
          </div>
        </section>
      </div>
    </div>
  )
}

export default BabySitterDashboardSection