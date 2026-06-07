import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const runtime = 'nodejs';

export async function GET(req, { params }) {
  const { filepath } = await params;
  const filePath = path.join(process.cwd(), "profilePicture", filepath.join("/"));

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}