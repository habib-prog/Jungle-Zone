import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import { verifyAdmin } from "../auth";

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

    return Response.json({
      parents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("PARENTS INFO ERROR:", error);
    return Response.json({ error: error.message || "Server error" }, { status: error.message?.includes("Unauthorized") ? 403 : 500 });
  }
}