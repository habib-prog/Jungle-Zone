import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

import bcrypt from "bcrypt";
import { upload } from "@/app/lib/multer";
import { runMiddleware } from "@/middleware/multerMiddleware";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const buffer = Buffer.from(await req.arrayBuffer());

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

    await runMiddleware(mockReq, mockRes, upload.single("profilePhoto"));

    if (!mockReq.file) {
      return NextResponse.json({ error: "Profile photo is required" }, { status: 400 });
    }

    const {
      fullName,
      email,
      phoneNumber,
      password,
      age,
      gender,
      location,
      zipCode,
      description,
      certifications,
      educationLevel,
      preferredBabysittingLocation,
      languages = [],
      yearsOfExperience,
      hourlyRate,
      comfortableWithAgeGroup,
      skills = [],
      availability = [],
      verificationDocs
    } = mockReq.body;

    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !password ||
      !age ||
      !gender ||
      !location ||
      !zipCode
    ) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await BabySitterRegistration.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save picture path using the API image proxy route
    const picturePath = `/api/profilePicture/babySitterWebsite/sitter/${mockReq.file.filename}`;

    const newBabysitter = new BabySitterRegistration({
      fullName,
      email,
      phoneNumber: Number(phoneNumber),
      password: hashedPassword,
      profilePhoto: picturePath,
      age: Number(age),
      gender,
      location,
      zipCode: Number(zipCode),
      description,
      certifications,
      educationLevel,
      preferredBabysittingLocation,
      languages: typeof languages === 'string' ? languages.split(',').map(l => l.trim()) : [],
      yearsOfExperience: Number(yearsOfExperience),
      hourlyRate: Number(hourlyRate),
      comfortableWithAgeGroup,
      skills: typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : [],
      availability: typeof availability === 'string' ? JSON.parse(availability || '[]') : [],
      verificationDocs: typeof verificationDocs === 'string' ? verificationDocs.split(',').map(v => v.trim()) : []
    });

    const savedData = await newBabysitter.save();

    return NextResponse.json({
      message: "Registration successful",
      data: savedData,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
