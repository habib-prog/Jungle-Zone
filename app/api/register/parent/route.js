import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

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

    const newUser = new parentSchema({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashed,
      postCode: postCode.trim(),
      subscription: "trial",
      subscriptionStart: new Date(),
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await newUser.save();
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 },
    );
  }
}
