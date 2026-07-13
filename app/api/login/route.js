import { connectDB } from "@/config/db";
import { signToken } from "@/middleware/auth";
import adminSchema from "@/models/adminSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import parentSchema from "@/models/parentSchema";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { resolveAuthAccount } from "@/app/lib/authAccountResolver";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 },
      );

    await connectDB();

    const [parent, sitter, admin] = await Promise.all([
      parentSchema.findOne({ email }),
      BabySitterRegistration.findOne({ email }),
      adminSchema.findOne({ email }),
    ]);

    const resolved = resolveAuthAccount({ parent, sitter, admin, email });
    let account = resolved.account;
    let role = resolved.role;

    if (!account)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );

    if (!account.password || account.provider === "google") {
      return NextResponse.json(
        {
          message:
            "This account uses Google sign-in. Please continue with Google.",
        },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, account.password);

    if (!ok)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );

    account = account.toObject();
    account.role = role;
    delete account.password;

    const token = signToken({ id: account._id, email: account.email, role });

    // Store token in httpOnly cookie (secure way)
    const res = NextResponse.json(
      {
        success: true,
        message: "Login success",
        account,
        pendingApproval: role === "sitter" && account.isApproved === false,
      },
      { status: 200 },
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    const message = String(err?.message || "Server error");
    const isMongoAuthIssue =
      /not allowed|not authorized|authorization|authentication/i.test(message);
    const isMongoTimeout =
      /timed out|server selection|ECONNREFUSED|ENOTFOUND|topology/i.test(
        message,
      );

    if (isMongoTimeout) {
      return NextResponse.json(
        {
          message:
            "We could not reach the database right now. Please try again in a moment.",
        },
        { status: 503 },
      );
    }

    if (isMongoAuthIssue) {
      return NextResponse.json(
        {
          message:
            "The database user does not have permission to read the account data.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ message }, { status: 500 });
  }
}
