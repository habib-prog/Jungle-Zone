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
      verificationDocs,
      preferences = []
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

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 2);

    const newBabysitter = new BabySitterRegistration({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      profilePhoto: picturePath,
      age: Number(age),
      gender,
      location,
      zipCode: Number(zipCode),
      description,
      certifications: Array.isArray(certifications) ? certifications : (typeof certifications === 'string' ? certifications.split(',').map(c => c.trim()).filter(Boolean) : []),
      educationLevel,
      preferredBabysittingLocation,
      languages: Array.isArray(languages) ? languages : (typeof languages === 'string' ? languages.split(',').map(l => l.trim()).filter(Boolean) : []),
      yearsOfExperience: Number(yearsOfExperience) || null,
      hourlyRate: Number(hourlyRate) || null,
      comfortableWithAgeGroup: Array.isArray(comfortableWithAgeGroup) ? comfortableWithAgeGroup : (typeof comfortableWithAgeGroup === 'string' ? comfortableWithAgeGroup.split(',').map(a => a.trim()).filter(Boolean) : []),
      skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []),
      availability: typeof availability === 'string' ? JSON.parse(availability || '[]') : [],
      verificationDocs: Array.isArray(verificationDocs) ? verificationDocs : (typeof verificationDocs === 'string' ? verificationDocs.split(',').map(v => v.trim()).filter(Boolean) : []),
      preferences: Array.isArray(preferences) ? preferences : (typeof preferences === 'string' ? preferences.split(',').map(p => p.trim()).filter(Boolean) : []),
      subscription: "trial",
      subscriptionStart: startDate,
      subscriptionExpiry: expiryDate
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
