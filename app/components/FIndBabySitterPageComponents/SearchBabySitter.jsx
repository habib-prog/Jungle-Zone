"use client";

import { Pagination, Rate } from "antd";
import React, { useEffect, useState } from "react";
import { TbCurrentLocation } from "react-icons/tb";
import { Slider } from "antd";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const SearchBabySitter = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [accessError, setAccessError] = useState(null);

  const [location, setLocation] = useState("");
  const [hourlyRate, setHourlyRate] = useState([0, 500]);
  const [availability, setAvailability] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (location) params.append("zipCode", location);
    if (hourlyRate[0] > 0) params.append("minRate", hourlyRate[0]);
    if (hourlyRate[1] < 500) params.append("maxRate", hourlyRate[1]);
    const selectedDays = Object.entries(availability)
      .filter(([_, checked]) => checked)
      .map(([day]) => day);
    if (selectedDays.length > 0)
      params.append("availabilityDays", selectedDays.join(","));
    return params.toString();
  };

  const fetchBabysitters = async (page = 1) => {
    try {
      setLoading(true);
      const query = buildQueryParams();
      const url = `/api/babysitters/findBabySitters?page=${page}${query ? "&" + query : ""}`;
      const res = await fetch(url);
      const result = await res.json();

      if (res.ok) {
        setAccessError(null);
        setBabysitters(result.data || []);
        setTotal(result.total || 0);
        setCurrentPage(result.currentPage || 1);
      } else {
        if (res.status === 401 || res.status === 403) {
          setBabysitters([]);
          setTotal(0);
          setAccessError({
            status: res.status,
            message:
              result.error ||
              "Your free trial or subscription has expired. Please subscribe to continue.",
          });
          return;
        }

        toast.error(result.error || "Failed to fetch babysitters");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch babysitters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBabysitters(1);
  }, []);

  const handleSearch = () => {
    fetchBabysitters(1);
  };

  const handleHourlyRateChange = (value) => {
    setHourlyRate(value);
  };

  const handleAvailabilityChange = (day, checked) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: checked,
    }));
  };

  const resetFilters = () => {
    setLocation("");
    setHourlyRate([0, 500]);
    setAvailability({
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    });
    fetchBabysitters(1);
  };

  const handlePageChange = (page) => {
    fetchBabysitters(page);
  };

  const handleBabysitterClick = (id) => {
    if (!isLoggedIn) {
      toast.error("Please login to view babysitter details");
      router.push(`/login?redirect=${encodeURIComponent(`/babysitters/${id}`)}`);
      return;
    }
    router.push(`/babysitters/${id}`);
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="font-poppins text-3xl font-semibold capitalize text-gray-500 mb-5">
          Find the best
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-80 bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <h3 className="font-poppins text-xl font-semibold text-gray-700 mb-6">
              Filter Results
            </h3>

            <div className="mb-8">
              <h4 className="font-poppins text-lg font-medium text-gray-600 mb-4 flex items-center gap-2">
                <TbCurrentLocation className="text-brandColor" />
                Location
              </h4>
              <input
                type="text"
                placeholder="Enter post code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full outline-none border-2 border-gray-300 rounded-[35px] px-4 py-2"
              />
            </div>

            <div className="mb-8">
              <h4 className="font-poppins text-lg font-medium text-gray-600 mb-4">
                Hourly Rate Range
              </h4>
              <Slider
                range
                min={0}
                max={500}
                step={1}
                value={hourlyRate}
                onChange={handleHourlyRateChange}
                onChangeComplete={handleSearch}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>£{hourlyRate[0]}/hr</span>
                <span>£{hourlyRate[1]}/hr</span>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-poppins text-lg font-medium text-gray-600 mb-4">
                Availability
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(availability).map(([day, isChecked]) => (
                  <label
                    key={day}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        handleAvailabilityChange(day, e.target.checked)
                      }
                      className="w-4 h-4 text-brandColor rounded focus:ring-brandColor"
                    />
                    <span className="text-gray-700 capitalize text-sm">
                      {day}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="w-full rounded-[35px] bg-brandColor px-4 py-2 text-sm font-semibold text-white mb-2"
            >
              Apply Filters
            </button>

            <button
              onClick={resetFilters}
              className="w-full rounded-[35px] bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400 transition-colors duration-300"
            >
              Reset Filters
            </button>
          </aside>

          <div className="flex-1">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : accessError ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="mb-4 text-sm font-medium text-gray-600">
                  {accessError.message}
                </p>
                <button
                  onClick={() =>
                    router.push(
                      accessError.status === 401
                        ? "/login?redirect=%2Fbabysitters"
                        : "/pricing",
                    )
                  }
                  className="rounded-[35px] bg-brandColor px-5 py-2 text-sm font-semibold text-white"
                >
                  {accessError.status === 401 ? "Login" : "Subscribe"}
                </button>
              </div>
            ) : (
              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-between gap-5">
                {babysitters.length > 0 ? (
                  babysitters.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleBabysitterClick(item._id)}
                      className="w-full md:max-w-75 rounded-sm border-2 border-gray-200 p-2 duration-500 cursor-pointer hover:border-brandColor hover:shadow-lg transition"
                    >
                      <div className="mb-5 max-h-60 w-full overflow-hidden rounded-sm bg-gray-200">
                        <img
                          src={
                            item.profilePhoto ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX6_emL9rSVs9Xi5QL9v71No8e2twojNljgw&s"
                          }
                          alt={item.fullName}
                        />
                      </div>

                      <Rate allowHalf defaultValue={5} />

                      <h2 className="select-none font-poppins text-lg font-semibold text-gray-500">
                        {item.fullName}
                      </h2>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TbCurrentLocation />
                          <p>Post Code: {item.zipCode}</p>
                        </div>

                        {item.hourlyRate && (
                          <p className="text-brandColor font-semibold">
                            £{item.hourlyRate}/hr
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No babysitter found</p>
                )}
              </div>
            )}

            {!accessError && (
              <Pagination
                align="end"
                current={currentPage}
                total={total}
                pageSize={9}
                onChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBabySitter;
