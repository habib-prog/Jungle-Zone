import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mailer";
import { verifiedEmail } from "@/app/lib/emailTemplates";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !otp) {
      return NextResponse.json(
        { message: "Email and code are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await parentSchema.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 },
      );
    }

    if (!user.otp) {
      return NextResponse.json(
        {
          message:
            "No verification code is set for this account. Please request a new code.",
        },
        { status: 400 },
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { message: "Incorrect verification code" },
        { status: 400 },
      );
    }

    if (!user.otpExpires || new Date(user.otpExpires).getTime() < Date.now()) {
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new code." },
        { status: 400 },
      );
    }

    user.isVerified = true;
    user.otp = "";
    user.otpExpires = null;
    await user.save();

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Your JungleZone email is verified",
        html: verifiedEmail({ name: user.fullName || "there" }),
      });
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr);
    }

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 },
    );
  }
}
