import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import Parent from "@/models/parentSchema";
import { verifyToken } from "@/middleware/auth";
import { cookies } from "next/headers";
import mongoose from "mongoose";

const getViewerFromToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
};

const hasActiveSubscription = (account) => {
  if (!account || !account.subscription || account.subscription === "free") return false;
  if (!account.subscriptionExpiry) return true;
  const expiry = new Date(account.subscriptionExpiry);
  return expiry > new Date();
};

export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400,
      });
    }

    await connectDB();

    const viewerToken = await getViewerFromToken();
    let viewer = {
      isLoggedIn: false,
      role: null,
      hasActiveSubscription: false,
      canSeeContact: false,
    };

    if (viewerToken?.id && viewerToken?.role === "parent") {
      const parent = await Parent.findById(viewerToken.id).select("subscription subscriptionExpiry");
      if (parent) {
        const isActive = hasActiveSubscription(parent);
        viewer = {
          isLoggedIn: true,
          role: "parent",
          hasActiveSubscription: isActive,
          canSeeContact: isActive,
        };
      }
    }

    const data = await BabySitterRegistration.findById(id).lean();

    if (!data) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    if (!viewer.canSeeContact) {
      data.phoneNumber = null;
      data.email = null;
    }

    return new Response(
      JSON.stringify({
        message: "Success",
        data,
        viewer,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
