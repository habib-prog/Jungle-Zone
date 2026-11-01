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
    const category = searchParams.get("category");
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(24, Math.max(1, Number.parseInt(searchParams.get("limit") || "8", 10)));
    if (category && !["all", "babysitting", "cleaning", "cooking"].includes(category)) {
      return Response.json({ error: "Invalid service category" }, { status: 400 });
    }
    const categoryFilter = (value) => {
      const categoryQuery = { isApproved: false };
      if (value === "babysitting") {
        categoryQuery.$or = [
          { serviceCategory: "babysitting" },
          { serviceCategory: { $exists: false } },
          { serviceCategory: null },
        ];
      } else if (value !== "all") {
        categoryQuery.serviceCategory = value;
      }
      return categoryQuery;
    };

    const [pending, totalCount, allCount, counts] = await Promise.all([
      BabySitterRegistration.find(categoryFilter(category || "all"))
        .select("-password")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      BabySitterRegistration.countDocuments(categoryFilter(category || "all")),
      BabySitterRegistration.countDocuments({ isApproved: false }),
      Promise.all(["babysitting", "cleaning", "cooking"].map(async (value) => [
        value,
        await BabySitterRegistration.countDocuments(categoryFilter(value)),
      ])),
    ]);
    return Response.json({
      requests: pending,
      page,
      limit,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      counts: { all: allCount, ...Object.fromEntries(counts) },
    });
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

    const categoryLabel = (category) => ({
      babysitting: "Babysitter",
      cleaning: "Cleaner",
      cooking: "Cook / Chef",
    }[category] || "Babysitter");

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
          subject: `Your JungleZone ${categoryLabel(updated.serviceCategory).toLowerCase()} account was approved`,
          html: sitterApprovedEmail({ name: updated.fullName || "there", serviceName: categoryLabel(updated.serviceCategory) }),
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
          subject: `Your JungleZone ${categoryLabel(existing.serviceCategory).toLowerCase()} account was not approved`,
          html: sitterRejectedEmail({ name: existing.fullName || "there", serviceName: categoryLabel(existing.serviceCategory) }),
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
