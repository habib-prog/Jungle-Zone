import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { getAuthenticatedUser } from "@/middleware/auth";
import { getFacilityAccessForUser } from "@/app/lib/subscriptionAccess";

await connectDB();

export async function GET(req) {
  try {
    const auth = await getAuthenticatedUser();
    const access = await getFacilityAccessForUser(auth, {
      allowedRoles: ["parent"],
    });

    if (!access.isLoggedIn) {
      return new Response(
        JSON.stringify({
          error: "Please log in to use this facility",
          reason: access.reason,
        }),
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);

    const zipCode = searchParams.get("zipCode");
    const name = searchParams.get("name");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");
    const availabilityDays = searchParams.get("availabilityDays");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 9;

    const filter = { isApproved: true };

    if (zipCode) {
      const normalizedZipCode = zipCode.replace(/\s+/g, "").trim();

      if (!normalizedZipCode) {
        return new Response(
          JSON.stringify({ error: "Postcode must not be empty" }),
          { status: 400 },
        );
      }

      // Build a case-insensitive regex that ignores spaces in the stored postcode.
      // E.g., searching "E147fu" or "E14 7fu" will match "E14 7fu" or "e14 7fu" in DB.
      const regexStr = normalizedZipCode.split("").map(char => {
        return char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s*";
      }).join("");

      filter.zipCode = { $regex: new RegExp("^" + regexStr + "$", "i") };
    }

    if (name) {
      filter.fullName = { $regex: name, $options: "i" };
    }

    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) {
        const min = Number(minRate);
        if (!isNaN(min) && min > 0) filter.hourlyRate.$gte = min;
      }
      if (maxRate) {
        const max = Number(maxRate);
        if (!isNaN(max) && max < 500) filter.hourlyRate.$lte = max;
      }
      if (Object.keys(filter.hourlyRate).length === 0) delete filter.hourlyRate;
    }

    if (availabilityDays) {
      const days = availabilityDays
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
      if (days.length > 0) {
        filter["availability.day"] = { $in: days };
      }
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      BabySitterRegistration.countDocuments(filter),
      BabySitterRegistration.find(filter)
        .select("fullName profilePhoto zipCode hourlyRate availability")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
    ]);

    return new Response(
      JSON.stringify({
        message: "Babysitters fetched",
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
        data,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
