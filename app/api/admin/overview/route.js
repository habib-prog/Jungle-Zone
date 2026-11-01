import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { verifyAdmin } from "../auth";
import Payment from "@/models/paymentSchema";

export async function GET(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const totalParents = await parentSchema.countDocuments();
    const totalBabysitters = await BabySitterRegistration.countDocuments();
    const pendingApprovals = await BabySitterRegistration.countDocuments({ isApproved: false });

    const [revenue] = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, amount: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenue?.amount || 0;

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
