import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { verifyAdmin } from "../auth";
import { sendEmail } from "@/app/lib/mailer";
import { sitterApprovedEmail, sitterRejectedEmail } from "@/app/lib/emailTemplates";

export async function GET(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const isApproved = searchParams.get("isApproved");
    const emailQuery = searchParams.get("email");

    const filter = {};
    if (isApproved !== null && isApproved !== "") {
      filter.isApproved = isApproved === "true";
    }
    if (emailQuery) {
      filter.email = { $regex: emailQuery, $options: "i" };
    }

    const total = await BabySitterRegistration.countDocuments(filter);

    const babysitters = await BabySitterRegistration.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return Response.json({
      babysitters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return Response.json({ error: error.message || "Server error" }, { status: error.message?.includes("Unauthorized") ? 403 : 500 });
  }
}

export async function POST(req){
  try {
    await verifyAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const babysitterId = searchParams.get("babysitterId");
    const action = searchParams.get("action");

    if (!babysitterId || !["approve", "reject"].includes(action)) {
      return Response.json({ error: "babysitterId and valid action required" }, { status: 400 });
    }

    const updateData = action === "approve" ? { isApproved: true } : { isApproved: false };
    const updated = await BabySitterRegistration.findByIdAndUpdate(babysitterId, updateData, { new: true });

    if (!updated) {
      return Response.json({ error: "Babysitter not found" }, { status: 404 });
    }

    try {
      await sendEmail({
        to: updated.email,
        subject: `Your JungleZone babysitter account was ${action === "approve" ? "approved" : "not approved"}`,
        html: action === "approve"
          ? sitterApprovedEmail({ name: updated.fullName || "there" })
          : sitterRejectedEmail({ name: updated.fullName || "there" }),
      });
    } catch (mailErr) {
      console.error("Failed to send approval email:", mailErr);
    }

    return Response.json({ message: `Babysitter ${action}d`, babysitter: updated });
  } catch (error) {
    return Response.json({ error: error.message || "Server error" }, { status: error.message?.includes("Unauthorized") ? 403 : 500 });
  }
}

export async function DELETE(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const babysitterId = searchParams.get("babysitterId");

    if (!babysitterId) {
      return Response.json({ error: "babysitterId required" }, { status: 400 });
    }

    const deleted = await BabySitterRegistration.findByIdAndDelete(babysitterId);
    if (!deleted) {
      return Response.json({ error: "Babysitter not found" }, { status: 404 });
    }

    return Response.json({ message: "Babysitter deleted" });
  } catch (error) {
    return Response.json({ error: error.message || "Server error" }, { status: error.message?.includes("Unauthorized") ? 403 : 500 });
  }
}