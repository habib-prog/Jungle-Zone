import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mailer";
import { otpEmail } from "@/app/lib/emailTemplates";
import { generateOtp, OTP_EXPIRY_MINUTES } from "@/app/lib/otp";

export async function POST(req) {
  try {
    const { fullName, email, password, postCode } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!fullName || !normalizedEmail || !password || !postCode) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await parentSchema.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const newUser = new parentSchema({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashed,
      postCode: postCode.trim(),
      subscription: "trial",
      subscriptionStart: new Date(),
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      otp,
      otpExpires: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      isVerified: false,
    });

    await newUser.save();

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Verify your JungleZone email",
        html: otpEmail({ name: fullName.trim(), otp, expiryMinutes: OTP_EXPIRY_MINUTES }),
      });
    } catch (mailErr) {
      console.error("Failed to send OTP email:", mailErr);
    }

    return NextResponse.json(
      {
        message: "Registration successful. Please verify your email.",
        requiresVerification: true,
        email: normalizedEmail,
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 },
    );
  }
}
