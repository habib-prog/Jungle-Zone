import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { fullName, email, password, postCode } = await req.json();

    if (!fullName || !email || !password || !postCode) return NextResponse.json({ message: "All fields required" }, { status: 400 });

    await connectDB();

    const existing = await parentSchema.findOne({ email });
    if (existing) return NextResponse.json({ message: "Email already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new parentSchema({
      fullName,
      email,
      password: hashed,
      postCode
    });

    await newUser.save();
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
