import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getAuthenticatedUser } from "@/middleware/auth";
import { runMiddleware } from "@/middleware/multerMiddleware";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { upload } from "@/app/lib/multer";
import { saveProfilePhoto } from "@/app/lib/imageUpload";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    // Auth check
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = user.id;

    // Convert Next.js request to Node-compatible format for multer
    const contentType = req.headers.get("content-type") || "";
    const buffer = Buffer.from(await req.arrayBuffer());

    // Create a mock req/res for multer
    const mockReq = Object.assign(
      new (require("stream").Readable)(),
      {
        headers: { "content-type": contentType, "content-length": buffer.length, "upload-type": "sitter" },
        method: "POST",
      }
    );
    mockReq.push(buffer);
    mockReq.push(null);

    const mockRes = {};

    await runMiddleware(mockReq, mockRes, upload.single("picture"));

    if (!mockReq.file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    await connectDB();

    // Save new picture (Cloudinary in production, local disk in dev)
    const picturePath = await saveProfilePhoto(
      mockReq.file,
      "babySitterWebsite/sitter"
    );

    // Delete old local picture from disk if it exists (Cloudinary URLs are ignored)
    const existing = await BabySitterRegistration.findById(userId).select("profilePhoto");
    if (
      existing?.profilePhoto &&
      (existing.profilePhoto.startsWith("/profilePicture/") ||
        existing.profilePhoto.startsWith("/api/profilePicture/"))
    ) {
      const relativePath = existing.profilePhoto
        .replace(/^\/api/, "")
        .replace(/^\//, "");
      const oldPath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updated = await BabySitterRegistration.findByIdAndUpdate(
      userId,
      { $set: { profilePhoto : picturePath } },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "Picture updated",
      picture: picturePath,
      sitter : updated,
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}