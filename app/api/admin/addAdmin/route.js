import { connectDB } from "@/config/db";
import adminSchema from "@/models/adminSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import parentSchema from "@/models/parentSchema";
import { verifyAdmin } from "../auth";
import { sendEmail } from "@/app/lib/mailer";
import { adminAddedEmail } from "@/app/lib/emailTemplates";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingAdmin = await adminSchema.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return Response.json(
        { error: "An admin with this email already exists" },
        { status: 409 },
      );
    }

    let fullName = "";
    let password = "";
    let provider = "credentials";

    const [parent, sitter] = await Promise.all([
      parentSchema.findOne({ email: normalizedEmail }),
      BabySitterRegistration.findOne({ email: normalizedEmail }),
    ]);

    const source = parent || sitter;
    if (source) {
      fullName = source.fullName || source.name || normalizedEmail;
      password = source.password || "";
      provider = source.provider || "credentials";
    } else {
      fullName = normalizedEmail;
    }

    const newAdmin = await adminSchema.create({
      fullName,
      email: normalizedEmail,
      password,
      provider,
    });

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "You've been added as a JungleZone Admin",
        html: adminAddedEmail({ name: fullName || "Admin", email: normalizedEmail }),
      });
    } catch (mailErr) {
      console.error("Failed to send admin-added email:", mailErr);
    }

    return Response.json(
      {
        message: "Admin added successfully",
        admin: {
          _id: newAdmin._id,
          fullName: newAdmin.fullName,
          email: newAdmin.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 },
    );
  }
}
