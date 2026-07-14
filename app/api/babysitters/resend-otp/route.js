import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mailer";
import { otpEmail } from "@/app/lib/emailTemplates";
import { generateOtp, OTP_EXPIRY_MINUTES } from "@/app/lib/otp";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await BabySitterRegistration.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 },
      );
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await user.save();

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Your JungleZone verification code",
        html: otpEmail({ name: user.fullName || "there", otp, expiryMinutes: OTP_EXPIRY_MINUTES }),
      });
    } catch (mailErr) {
      console.error("Failed to send OTP email:", mailErr);
      return NextResponse.json(
        { message: "Failed to send code. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "A new code has been sent to your email" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 },
    );
  }
}
