import { connectDB } from "@/config/db";
import { verifyAdmin } from "../auth";
import Payment from "@/models/paymentSchema";

export async function GET(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(query);

    return Response.json({
      payments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("PAYMENT GET ERROR:", error);
    return Response.json(
      { error: error.message || "Server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function POST(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const body = await req.json();
    const { status, userId } = body;

    if (!userId || !status) {
      return Response.json(
        { error: "userId and status are required" },
        { status: 400 }
      );
    }

    const payment = await Payment.findOneAndUpdate(
      { userId },
      { status },
      { new: true }
    );

    if (!payment) {
      return Response.json({ error: "Payment not found" }, { status: 404 });
    }

    return Response.json({
      message: "Payment status updated",
      data: payment,
    });
  } catch (error) {
    console.error("PAYMENT UPDATE ERROR:", error);
    return Response.json(
      { error: error.message || "Server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
