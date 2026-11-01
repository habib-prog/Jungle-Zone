"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Loader2,
  Sparkles,
} from "lucide-react";
import { getImageUrl } from "@/app/lib/imageUtils";

const CATEGORIES = [
  "All",
  "Parenting",
  "Childcare Advice",
  "Activities & Fun",
  "Safety & First Aid",
  "Nutrition & Health",
  "Platform & News",
];

const INITIAL_VISIBLE_COUNT = 6;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (data.success) {
          setBlogs(data.blogs || []);
        }
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  // Reset pagination count when search or category changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [searchQuery, selectedCategory]);

  // Filtered blogs
  const availableCategories = [...new Set([
    ...CATEGORIES.filter((category) => category !== "All"),
    ...blogs.map((blog) => blog.category?.trim()).filter(Boolean),
  ])].sort((a, b) => a.localeCompare(b));
  const categoryOptions = ["All", ...availableCategories];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBlogs.length;

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-32 sm:pt-36 lg:pt-12">
      {/* Hero Banner Section */}
      <section className="container mx-auto px-4 sm:px-6 mb-8 md:mb-12">
        <div className="bg-gradient-to-br from-[#03914a] via-[#02753b] to-[#01592c] rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 text-white text-center relative overflow-hidden shadow-xl">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-emerald-100 uppercase tracking-widest border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> JungleZone Insights & Blog
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-poppins text-white leading-tight">
              Childcare Advice, Tips & Parenting Guides
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Explore expert tips on finding top babysitters, keeping toddlers
              engaged, essential safety guidelines, and parenting hacks.
            </p>

            {/* Search Input in Banner */}
            <div className="pt-2 sm:pt-4 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles, guides, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3.5 text-xs sm:text-sm md:text-base rounded-xl sm:rounded-2xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Category Pills Filter */}
        <div className="mt-4 mb-8 -mx-4 overflow-x-auto px-4 pb-2 no-scrollbar scroll-smooth sm:mx-0 sm:mb-10 sm:px-0">
          <div className="flex min-w-max items-center gap-2 sm:flex-wrap sm:justify-center">
            {categoryOptions.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#03914a] text-white shadow-md shadow-[#03914a]/20 scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Spinner State */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#03914a] mb-3" />
            <p className="text-base font-medium">Fetching latest articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto border border-gray-200 shadow-xs my-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">
              No articles found
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              We couldn&apos;t find any articles matching your search query or
              selected category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 px-6 py-2.5 bg-[#03914a] text-white text-xs font-semibold rounded-xl hover:bg-[#02753b] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Grid View Post Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {visibleBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Article Image Container */}
                  <Link
                    href={`/blogs/${blog.slug || blog._id}`}
                    className="relative block w-full aspect-16/10 overflow-hidden bg-gray-100"
                  >
                    <img
                      src={
                        getImageUrl(blog.image) ||
                        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800"
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-gray-800 shadow-sm border border-white/50">
                        {blog.category}
                      </span>
                    </div>
                  </Link>

                  {/* Article Card Details */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Meta Date & Read Time */}
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {blog.readTime || "5 min read"}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#03914a] transition-colors leading-snug line-clamp-2">
                        <Link href={`/blogs/${blog.slug || blog._id}`}>
                          {blog.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {blog.excerpt || blog.content?.slice(0, 140) + "..."}
                      </p>
                    </div>

                    {/* Author & Read More Link */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#03914a]/10 text-[#03914a] font-bold text-xs flex items-center justify-center border border-[#03914a]/20">
                          {blog.author
                            ? blog.author.charAt(0).toUpperCase()
                            : "J"}
                        </div>
                        <span className="text-xs font-semibold text-gray-700 truncate max-w-[100px] sm:max-w-[130px]">
                          {blog.author || "JungleZone Team"}
                        </span>
                      </div>

                      <Link
                        href={`/blogs/${blog.slug || blog._id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#03914a] hover:text-[#02753b] transition-colors group-hover:translate-x-1 duration-200 flex-shrink-0"
                      >
                        Read More <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* View More Button (Shows initial 6 first, then loads more) */}
            {hasMore && (
              <div className="text-center mt-10 sm:mt-14">
                <button
                  onClick={handleViewMore}
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white border-2 border-[#03914a] text-[#03914a] hover:bg-[#03914a] hover:text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>
                    View More Articles ({filteredBlogs.length - visibleCount}{" "}
                    remaining)
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
