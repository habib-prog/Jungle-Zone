import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { verifyAdmin } from "../auth";
import subscriptionSchema from "@/models/subscriptionSchema";

export async function GET(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const totalParents = await parentSchema.countDocuments();
    const totalBabysitters = await BabySitterRegistration.countDocuments();
    const pendingApprovals = await BabySitterRegistration.countDocuments({ isApproved: false });

    const totalSubscribed = await subscriptionSchema.find().select("price").lean();
    const totalRevenue = totalSubscribed.reduce((sum, subscription) => sum + (subscription.price || 0), 0);

    return Response.json({
      totalParents,
      totalBabysitters,
      pendingApprovals,
      totalRevenue,
    });
  } catch (error) {
    return Response.json({ error: error.message || "Server error" }, { status: error.message?.includes("Unauthorized") ? 403 : 500 });
  }
}