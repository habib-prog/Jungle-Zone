import { connectDB } from "@/config/db";
import ActivityLog from "@/models/activityLogSchema";
import { verifyAdmin } from "../auth";
import { cleanupOldActivity, ACTIVITY_RETENTION_DAYS } from "@/app/lib/activityLogger";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await verifyAdmin();
    await connectDB();

    // Best-effort cleanup of records older than the retention period.
    await cleanupOldActivity();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const emailQuery = searchParams.get("email");
    const action = searchParams.get("action");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const filter = {};
    if (emailQuery) {
      filter.email = { $regex: emailQuery, $options: "i" };
    }
    if (action === "login" || action === "logout") {
      filter.action = action;
    }
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const total = await ActivityLog.countDocuments(filter);

    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const serialized = logs.map((log) => ({
      _id: log._id,
      email: log.email,
      name: log.name,
      role: log.role,
      action: log.action,
      device: log.device,
      region: log.region,
      ip: log.ip,
      createdAt: log.createdAt,
    }));

    return Response.json(
      {
        logs: serialized,
        retentionDays: ACTIVITY_RETENTION_DAYS,
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
