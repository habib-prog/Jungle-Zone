import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

import bcrypt from "bcrypt";
import { upload } from "@/app/lib/multer";
import { runMiddleware } from "@/middleware/multerMiddleware";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mailer";
import { otpEmail } from "@/app/lib/emailTemplates";
import { generateOtp, OTP_EXPIRY_MINUTES } from "@/app/lib/otp";
import { saveProfilePhoto } from "@/app/lib/imageUpload";
import { getProviderCategoryOptions } from "@/app/lib/providerCategoryOptions";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const buffer = Buffer.from(await req.arrayBuffer());

    const mockReq = Object.assign(new (require("stream").Readable)(), {
      headers: {
        "content-type": contentType,
        "content-length": buffer.length,
        "upload-type": "sitter",
      },
      method: "POST",
    });
    mockReq.push(buffer);
    mockReq.push(null);

    const mockRes = {};

    await runMiddleware(mockReq, mockRes, upload.single("profilePhoto"));

    if (!mockReq.file) {
      return NextResponse.json(
        { error: "Profile photo is required" },
        { status: 400 },
      );
    }

    const {
      fullName,
      serviceCategory = "babysitting",
      email,
      phoneNumber,
      password,
      age,
      dateOfBirth,
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
      comfortableWith,
      comfortableWithAgeGroup,
      skills = [],
      availability = [],
      verificationDocs,
      preferences = [],
    } = mockReq.body;

    if (!["babysitting", "cleaning", "cooking"].includes(serviceCategory)) {
      return NextResponse.json({ error: "Please choose a valid service category" }, { status: 400 });
    }

    const selectedDeclarations = Array.isArray(verificationDocs)
      ? verificationDocs
      : typeof verificationDocs === "string"
        ? verificationDocs.split(",").map((value) => value.trim()).filter(Boolean)
        : [];
    const requiredDeclarations = getProviderCategoryOptions(serviceCategory)
      .declarations.filter((item) => item.required).map((item) => item.label);
    if (!requiredDeclarations.every((declaration) => selectedDeclarations.includes(declaration))) {
      return NextResponse.json({ error: "Please confirm all required service declarations" }, { status: 400 });
    }

    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !password ||
      !(age || dateOfBirth) ||
      !gender ||
      !location ||
      !zipCode
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 },
      );
    }

    // Name should not contain numbers
    if (/[0-9]/.test(fullName)) {
      return NextResponse.json(
        { error: "Full name should not contain numbers" },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Phone number digits validation
    if (!/^\+?[0-9\s\-]+$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Phone number must contain digits only" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Date of Birth / Age validation
    let parsedAge = age ? Number(age) : null;
    let parsedDob = null;
    if (dateOfBirth) {
      parsedDob = new Date(dateOfBirth);
      if (isNaN(parsedDob.getTime())) {
        return NextResponse.json(
          { error: "Invalid date of birth" },
          { status: 400 },
        );
      }
      const diffMs = Date.now() - parsedDob.getTime();
      parsedAge = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
    }
    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 100) {
      return NextResponse.json(
        { error: "You must be between 18 and 100 years old" },
        { status: 400 },
      );
    }

    // Post code validation (alphanumeric)
    if (!/^[a-zA-Z0-9\s]+$/.test(String(zipCode).trim())) {
      return NextResponse.json(
        { error: "Post code must contain letters and numbers only" },
        { status: 400 },
      );
    }

    // Hourly rate validation
    if (hourlyRate) {
      const parsedRate = Number(hourlyRate);
      if (isNaN(parsedRate) || parsedRate <= 0) {
        return NextResponse.json(
          { error: "Hourly rate must be a positive number" },
          { status: 400 },
        );
      }
    }

    // Years of experience validation
    if (yearsOfExperience) {
      const parsedExp = Number(yearsOfExperience);
      if (isNaN(parsedExp) || parsedExp < 0) {
        return NextResponse.json(
          { error: "Years of experience must be a positive number" },
          { status: 400 },
        );
      }
    }

    // Description validation
    if (!description || description.length < 10) {
      return NextResponse.json(
        { error: "Short bio must be at least 10 characters long" },
        { status: 400 },
      );
    }

    await connectDB();

    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existingUser = await BabySitterRegistration.findOne({
      email: { $regex: `^${escapedEmail}$`, $options: "i" },
    });
    if (existingUser) {
      if (!existingUser.isVerified) {
        existingUser.otp = generateOtp();
        existingUser.otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        await existingUser.save();

        let emailSent = true;
        try {
          await sendEmail({
            to: normalizedEmail,
            subject: "Your JungleZone verification code",
            html: otpEmail({
              name: existingUser.fullName || "there",
              otp: existingUser.otp,
              expiryMinutes: OTP_EXPIRY_MINUTES,
            }),
          });
        } catch (mailErr) {
          emailSent = false;
          console.error("Failed to resend OTP during registration:", mailErr);
        }

        return NextResponse.json(
          {
            message: emailSent
              ? "This email has an unverified account. A new verification code has been sent."
              : "This email has an unverified account, but we could not send a new code. Check the email service settings, then use Resend code.",
            requiresVerification: true,
            emailSent,
            resumedExistingAccount: true,
            email: normalizedEmail,
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save picture (Cloudinary in production, local disk in dev)
    const picturePath = await saveProfilePhoto(
      mockReq.file,
      "babySitterWebsite/sitter"
    );

    const newBabysitter = new BabySitterRegistration({
      serviceCategory,
      fullName,
      email: normalizedEmail,
      phoneNumber,
      password: hashedPassword,
      profilePhoto: picturePath,
      age: parsedAge,
      dateOfBirth: parsedDob,
      gender,
      location,
      zipCode: String(zipCode).trim(),
      description,
      certifications: Array.isArray(certifications)
        ? certifications
        : typeof certifications === "string"
          ? certifications
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [],
      educationLevel,
      preferredBabysittingLocation,
      languages: Array.isArray(languages)
        ? languages
        : typeof languages === "string"
          ? languages
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean)
          : [],
      yearsOfExperience: Number(yearsOfExperience) || null,
      hourlyRate: Number(hourlyRate) || null,
      comfortableWith: Array.isArray(comfortableWith)
        ? comfortableWith
        : typeof comfortableWith === "string"
          ? comfortableWith
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
      comfortableWithAgeGroup: Array.isArray(comfortableWithAgeGroup)
        ? comfortableWithAgeGroup
        : typeof comfortableWithAgeGroup === "string"
          ? comfortableWithAgeGroup.split(",").map((value) => value.trim()).filter(Boolean)
          : [],
      skills: Array.isArray(skills)
        ? skills
        : typeof skills === "string"
          ? skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      availability:
        typeof availability === "string"
          ? JSON.parse(availability || "[]")
          : [],
      verificationDocs: selectedDeclarations,
      preferences: Array.isArray(preferences)
        ? preferences
        : typeof preferences === "string"
          ? preferences
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean)
          : [],
      subscription: "trial",
      subscriptionStart: new Date(),
      subscriptionExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isVerified: false,
      otp: generateOtp(),
      otpExpires: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    });

    const savedData = await newBabysitter.save();

    let emailSent = true;
    try {
      await sendEmail({
        to: savedData.email,
        subject: "Verify your JungleZone provider account",
        html: otpEmail({
          name: savedData.fullName || "there",
          otp: savedData.otp,
          expiryMinutes: OTP_EXPIRY_MINUTES,
        }),
      });
    } catch (mailErr) {
      emailSent = false;
      console.error("Failed to send OTP email:", mailErr);
    }

    return NextResponse.json(
      {
        message:
          emailSent
            ? "Registration successful. Please verify your email to continue."
            : "Your account was created, but we could not send the verification email. Check the email service settings, then use Resend code.",
        requiresVerification: true,
        emailSent,
        email: savedData.email,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 },
    );
  }
}
