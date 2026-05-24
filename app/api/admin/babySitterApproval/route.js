import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { verifyAdmin } from "../auth";

export async function GET(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const pending = await BabySitterRegistration.find({ isApproved: false }).select("-password").sort({ createdAt: -1 });
    return Response.json(pending);
  } catch (error) {
    console.error("BABYSITTER APPROVAL ERROR:", error);
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
      return Response.json({ message: "Babysitter approved", data: updated });
    }

    if (action === "reject") {
      const deleted = await BabySitterRegistration.findByIdAndDelete(babysitterId);
      if (!deleted) {
        return Response.json({ error: "Babysitter not found" }, { status: 404 });
      }
      return Response.json({ message: "Babysitter rejected" });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("APPROVAL POST ERROR:", error);
    return Response.json({ error: error.message || "Server error" }, { status: error.message?.includes("Unauthorized") ? 403 : 500 });
  }
}