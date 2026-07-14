import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/auth";
import { recordActivity } from "@/app/lib/activityLogger";
import { connectDB } from "@/config/db";
import adminSchema from "@/models/adminSchema";
import parentSchema from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    let fullName = "";
    if (user.email) {
      await connectDB();
      const [admin, parent, sitter] = await Promise.all([
        adminSchema.findOne({ email: user.email }).select("fullName"),
        parentSchema.findOne({ email: user.email }).select("fullName"),
        BabySitterRegistration.findOne({ email: user.email }).select("fullName"),
      ]);
      fullName =
        admin?.fullName || parent?.fullName || sitter?.fullName || "";
    }

    await recordActivity(req, {
      action: "login",
      userAgent: body.userAgent || undefined,
      timezone: body.timezone || undefined,
      user: {
        id: user.id,
        email: user.email,
        name: fullName,
        role: user.role,
        timezone: body.timezone,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}

