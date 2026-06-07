import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { verifyToken } from "@/middleware/auth";
import { runMiddleware } from "@/middleware/multerMiddleware";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { upload } from "@/app/lib/multer";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    // Auth check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let userId;
    try {
      const decoded = verifyToken(token);
      userId = decoded.id;
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

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

    // Delete old picture from disk if it exists and isn't a Google URL
    const existing = await BabySitterRegistration.findById(userId).select("profilePhoto");
    if (existing?.profilePhoto && existing.profilePhoto.startsWith("/profilePicture/")) {
      const oldPath = path.join(process.cwd(), "public", existing.profilePhoto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Save new picture path (relative, served as static from /public)
    const picturePath = `/profilePicture/babySitterWebsite/sitter/${mockReq.file.filename}`;

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