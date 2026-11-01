"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/app/lib/imageUtils";

const CATEGORIES = [
  "Parenting",
  "Childcare Advice",
  "Activities & Fun",
  "Safety & First Aid",
  "Nutrition & Health",
  "Platform & News",
];

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Parenting",
    author: "JungleZone Team",
    readTime: "4 min read",
    image: "",
    isPublished: true,
    tags: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs?admin=true");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      } else {
        toast.error("Failed to load blog posts");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Parenting",
      author: "JungleZone Team",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80",
      isPublished: true,
      tags: "Parenting, Childcare",
    });
    setImagePreview("https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80");
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || "Parenting",
      author: blog.author || "JungleZone Team",
      readTime: blog.readTime || "4 min read",
      image: blog.image || "",
      isPublished: blog.isPublished ?? true,
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
    });
    setImagePreview(blog.image || "");
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant local blob preview
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append("image", file);

      const res = await fetch("/api/blogs/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        setFormData((prev) => ({ ...prev, image: result.imageUrl }));
        setImagePreview(result.imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in required fields (Title & Content)");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      const url = editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(
          editingBlog ? "Blog post updated!" : "New blog post created!"
        );
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        toast.error(result.message || "Failed to save blog post");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Blog post deleted");
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting blog post");
    }
  };

  const togglePublish = async (blog) => {
    try {
      const res = await fetch(`/api/blogs/${blog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !blog.isPublished }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(
          blog.isPublished ? "Post set to Draft" : "Post Published!"
        );
        setBlogs((prev) =>
          prev.map((b) =>
            b._id === blog._id ? { ...b, isPublished: !b.isPublished } : b
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle publish status");
    }
  };

  // Filtered blogs
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const availableCategories = [...new Set([
    ...CATEGORIES,
    ...blogs.map((blog) => blog.category?.trim()).filter(Boolean),
  ])].sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#03914a]" />
            Manage Blog Posts
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit, and publish blog articles for parents and babysitters.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#03914a] hover:bg-[#02753b] text-white font-medium text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Post
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Posts</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{blogs.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Published</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {blogs.filter((b) => b.isPublished).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Drafts</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {blogs.filter((b) => !b.isPublished).length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#03914a]/30 focus:border-[#03914a]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#03914a]/30 focus:border-[#03914a] bg-white cursor-pointer"
        >
          <option value="All">All Categories</option>
          {availableCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Blogs Table / List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#03914a] mb-2" />
            <p className="text-sm">Loading blog posts...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-gray-800">No blog posts found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search filters or create a new blog post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(blog.image) || "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=200"}
                          alt={blog.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0 bg-gray-100"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-gray-900 truncate" title={blog.title}>
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate" title={blog.excerpt}>
                            {blog.excerpt || "No excerpt..."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {blog.author}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(blog)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          blog.isPublished
                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                            : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        }`}
                        title="Click to toggle status"
                      >
                        {blog.isPublished ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(blog)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Post"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Fill in details to publish or update an article on the JungleZone Blog.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 Essential Tips for Finding a Babysitter"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#03914a]/30 focus:border-[#03914a] outline-none"
                />
              </div>

              {/* Category & Read Time & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    list="blog-category-options"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    placeholder="Choose or type a category"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#03914a]/30 focus:border-[#03914a] outline-none bg-white cursor-pointer"
                  />
                  <datalist id="blog-category-options">
                    {availableCategories.map((category) => <option key={category} value={category} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Author
                  </label>
                  <input
                    type="text"
                    placeholder="Author name"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, author: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#03914a]/30 focus:border-[#03914a] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Read Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={formData.readTime}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, readTime: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#03914a]/30 focus:border-[#03914a] outline-none"
                  />
                </div>
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Featured Image (Upload file or paste URL)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Image URL (https://...)"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, image: e.target.value }));
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#03914a]/30 focus:border-[#03914a] outline-none"
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-xl cursor-pointer transition-colors w-full sm:w-auto justify-center">
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#03914a]" />
                    ) : (
                      <Upload className="w-4 h-4 text-gray-500" />
                    )}
                    <span>{uploadingImage ? "Uploading..." : "Upload Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* Preview Thumbnail */}
                {imagePreview && (
                  <div className="mt-3 relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={getImageUrl(imagePreview)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Short Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary displayed on the blog card..."
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#03914a]/30 focus:border-[#03914a] outline-none resize-none"
                />
              </div>

              {/* Content Body */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Full Article Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write full article here. Use headers (### Header) or paragraphs..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#03914a]/30 focus:border-[#03914a] outline-none font-sans"
                />
              </div>

              {/* Tags & Published Checkbox */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="w-full sm:flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Safety, Advice, Tips"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    className="w-full px-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#03914a]/30 outline-none"
                  />
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer self-end sm:self-center pt-2 sm:pt-0">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isPublished: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-[#03914a] rounded border-gray-300 focus:ring-[#03914a]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Publish Immediately
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#03914a] hover:bg-[#02753b] text-white font-medium text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {editingBlog ? "Update Post" : "Create & Save Post"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
