import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import Payment from "@/models/paymentSchema";
import { verifyAdmin } from "../auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const emailQuery = searchParams.get("email");

    const filter = {};
    if (emailQuery) {
      filter.email = { $regex: emailQuery, $options: "i" };
    }

    const total = await parentSchema.countDocuments(filter);

    const parents = await parentSchema
      .find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const parentIds = parents.map((parent) => parent._id);
    const paidPayments = parentIds.length
      ? await Payment.find({ userId: { $in: parentIds }, category: "parent", status: "completed" })
          .select("userId planName createdAt")
          .sort({ createdAt: -1 })
          .lean()
      : [];
    const paidPlanByUser = new Map();
    for (const payment of paidPayments) {
      const userId = payment.userId.toString();
      if (!paidPlanByUser.has(userId)) paidPlanByUser.set(userId, payment.planName);
    }
    const usersWithAccessPlan = parents.map((parent) => {
      const user = parent.toObject();
      user.paidService = paidPlanByUser.get(parent._id.toString()) || null;
      return user;
    });

    return Response.json(
      {
        parents: usersWithAccessPlan,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Parent id is required" }, { status: 400 });
    }

    const deleted = await parentSchema.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ error: "Parent not found" }, { status: 404 });
    }

    return Response.json(
      { message: "Parent deleted successfully" },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 },
    );
  }
}
