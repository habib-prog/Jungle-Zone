import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { getAuthenticatedUser } from "@/middleware/auth";
import { getFacilityAccessForUser } from "@/app/lib/subscriptionAccess";
import mongoose from "mongoose";

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

    const auth = await getAuthenticatedUser();
    const access = await getFacilityAccessForUser(auth, {
      allowedRoles: ["parent"],
    });

    if (!access.isLoggedIn) {
      return new Response(
        JSON.stringify({
          error: "Please log in to use this facility",
          reason: access.reason,
          viewer: access,
        }),
        { status: 401 },
      );
    }

    if (!access.canUseFacilities) {
      return new Response(
        JSON.stringify({
          error:
            "Your free trial or subscription has expired. Please subscribe to use this facility.",
          reason: access.reason,
          viewer: access,
        }),
        { status: 403 },
      );
    }

    const data = await BabySitterRegistration.findById(id).lean();

    if (!data) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Success",
        data,
        viewer: {
          ...access,
          canSeeContact: access.canUseFacilities,
        },
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
