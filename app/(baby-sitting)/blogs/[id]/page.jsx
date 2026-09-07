"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Tag,
  Loader2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { getImageUrl } from "@/app/lib/imageUtils";
import { toast } from "sonner";
import { use } from "react";

export default function BlogDetailsPage({ params }) {
  // Unwrap params using React.use() for Next.js App Router async params
  const unwrappedParams = use(params);
  const id = unwrappedParams?.id;

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchBlogDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (data.success && data.blog) {
          setBlog(data.blog);

          // Fetch related blogs from same category
          const allRes = await fetch("/api/blogs");
          const allData = await allRes.json();
          if (allData.success && Array.isArray(allData.blogs)) {
            const filtered = allData.blogs
              .filter((b) => b._id !== data.blog._id)
              .slice(0, 3);
            setRelatedBlogs(filtered);
          }
        }
      } catch (err) {
        console.error("Failed to load blog post:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogDetails();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#03914a] mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 bg-gray-50 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl text-center max-w-md w-full shadow-lg border border-gray-200">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">
            The blog article you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#03914a] text-white font-semibold text-sm rounded-xl hover:bg-[#02753b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50/50 pb-20 pt-28 lg:pt-12">
      {/* Back Header Bar */}
      <div className="container mx-auto px-4 sm:px-6 mb-6 md:mb-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-[#03914a] transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Article Header Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 md:p-10 border border-gray-200/80 shadow-md mb-6 md:mb-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-bold bg-[#03914a]/10 text-[#03914a] border border-[#03914a]/20">
              {blog.category}
            </span>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight font-poppins">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 border-t border-gray-100 text-xs md:text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#03914a] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {blog.author ? blog.author.charAt(0).toUpperCase() : "J"}
              </div>
              <span className="text-gray-900 font-semibold">{blog.author || "JungleZone Team"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{blog.readTime || "5 min read"}</span>
            </div>
          </div>
        </div>

        {/* Featured Image Banner */}
        <div className="relative aspect-16/9 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-gray-200 mb-8 md:mb-10 bg-gray-100">
          <img
            src={getImageUrl(blog.image) || "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200"}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 md:p-12 border border-gray-200/80 shadow-md mb-12">
          {/* Excerpt Lead */}
          {blog.excerpt && (
            <p className="text-base sm:text-lg md:text-xl font-medium text-gray-700 italic border-l-4 border-[#03914a] pl-4 mb-8 bg-gray-50/80 py-3 rounded-r-xl">
              {blog.excerpt}
            </p>
          )}

          {/* Content Render */}
          <div className="prose prose-emerald max-w-none text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg space-y-6">
            {blog.content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={index}
                    className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 pt-4 font-poppins"
                  >
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 pt-6 font-poppins"
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              return (
                <p key={index} className="whitespace-pre-line text-gray-700">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {Array.isArray(blog.tags) && blog.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase text-gray-400 mr-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div className="space-y-6 pt-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-poppins">
              More Articles You Might Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedBlogs.map((item) => (
                <Link
                  key={item._id}
                  href={`/blogs/${item.slug || item._id}`}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <img
                      src={getImageUrl(item.image) || "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500"}
                      alt={item.title}
                      className="w-full h-36 object-cover rounded-xl bg-gray-100"
                    />
                    <span className="text-xs font-bold text-[#03914a]">
                      {item.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#03914a] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span>{item.readTime || "4 min read"}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#03914a] group-hover:translate-x-1 transition-transform">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
