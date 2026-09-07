import { NextResponse } from "next/server";
import { saveProfilePhoto } from "@/app/lib/imageUpload";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") || formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageUrl = await saveProfilePhoto(
      { buffer, originalname: file.name || "blog-image.jpg" },
      "blogs"
    );

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("[Blog Upload Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
