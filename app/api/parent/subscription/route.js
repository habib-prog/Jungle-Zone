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

// GET — fetch all active subscription plans, optionally filtered by role
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const serviceCategory = searchParams.get("serviceCategory");
    let categoryFilter = ["parent", "babysitter", "both"];

    if (role === "parent") {
      categoryFilter = ["parent", "both"];
    } else if (role === "babysitter") {
      categoryFilter = ["babysitter", "both"];
    }

    const baseFilter = {
      isActive: true,
      category: { $in: categoryFilter },
    };

    let plans;
    if (["parent", "babysitter"].includes(role) && ["babysitting", "cleaning", "cooking"].includes(serviceCategory)) {
      plans = await subscriptionPlans.find({
        ...baseFilter,
        $or: [
          { serviceCategory },
          { serviceCategory: "all" },
          { serviceCategory: { $exists: false } },
        ],
      }).sort({ price: 1, duration: 1 });
    } else {
      plans = await subscriptionPlans.find(baseFilter).sort({ price: 1, duration: 1 });
    }

    return NextResponse.json({ plans }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
