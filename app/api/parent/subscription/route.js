import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import subscriptionPlans from "@/models/subscriptionPlans";
import { verifyToken } from "@/middleware/auth";
import { cookies } from "next/headers";

const getUserId = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = verifyToken(token);
    return decoded.id;
  } catch {
    return null;
  }
};

// GET — fetch all active subscription plans (for parents)
export async function GET() {
  try {
    await connectDB();
    const plans = await subscriptionPlans.find({ isActive: true, category: { $in: ["parent", "both"] } })
      .sort({ price: 1, duration: 1 });
    return NextResponse.json({ plans }, { status: 200 });
  } catch (error) {
    console.error("SUBSCRIPTION GET ERROR:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
