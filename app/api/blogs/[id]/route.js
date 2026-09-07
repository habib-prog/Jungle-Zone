import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Blog from "@/models/blogSchema";
import mongoose from "mongoose";

export const runtime = "nodejs";

// GET /api/blogs/[id]
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    let blog = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findById(id);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("[Blog API GET Single Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id]
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    if (body.tags && typeof body.tags === "string") {
      body.tags = body.tags.split(",").map((t) => t.trim());
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Blog post updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("[Blog API PUT Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id]
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("[Blog API DELETE Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
