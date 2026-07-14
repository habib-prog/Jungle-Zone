import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { verifyAdmin } from "../auth";
import { sendEmail } from "@/app/lib/mailer";
import { sitterApprovedEmail, sitterRejectedEmail } from "@/app/lib/emailTemplates";

export async function GET(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const pending = await BabySitterRegistration.find({ isApproved: false }).select("-password").sort({ createdAt: -1 });
    return Response.json(pending);
  } catch (error) {
    return Response.json({ error: error.message || "Server error" }, { status: error.message?.includes("Unauthorized") ? 403 : 500 });
  }
}

export async function POST(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const body = await req.json();
    const { babysitterId, action } = body;

    if (!babysitterId || !action) {
      return Response.json({ error: "babysitterId and action required" }, { status: 400 });
    }

    if (action === "approve") {
      const updated = await BabySitterRegistration.findByIdAndUpdate(
        babysitterId,
        { isApproved: true },
        { new: true }
      ).select("-password");
      if (!updated) {
        return Response.json({ error: "Babysitter not found" }, { status: 404 });
      }
      try {
        await sendEmail({
          to: updated.email,
          subject: "Your JungleZone babysitter account was approved",
          html: sitterApprovedEmail({ name: updated.fullName || "there" }),
        });
      } catch (mailErr) {
        console.error("Failed to send approval email:", mailErr);
      }
      return Response.json({ message: "Babysitter approved", data: updated });
    }

    if (action === "reject") {
      const existing = await BabySitterRegistration.findById(babysitterId);
      if (!existing) {
        return Response.json({ error: "Babysitter not found" }, { status: 404 });
      }
      try {
        await sendEmail({
          to: existing.email,
          subject: "Your JungleZone babysitter account was not approved",
          html: sitterRejectedEmail({ name: existing.fullName || "there" }),
        });
      } catch (mailErr) {
        console.error("Failed to send rejection email:", mailErr);
      }
      const deleted = await BabySitterRegistration.findByIdAndDelete(babysitterId);
      return Response.json({ message: "Babysitter rejected" });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message || "Server error" }, { status: error.message?.includes("Unauthorized") ? 403 : 500 });
  }
}