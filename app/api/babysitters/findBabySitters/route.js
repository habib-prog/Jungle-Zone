import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

await connectDB();

export async function GET(req) {
  try {
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
      const normalizedZipCode = zipCode.replace(/\s+/g, "");
      const zipNum = Number(normalizedZipCode);

      if (!normalizedZipCode || isNaN(zipNum)) {
        return new Response(JSON.stringify({ error: "Postcode must be numeric" }), { status: 400 });
      }

      filter.zipCode = zipNum;
    }

    if (name) {
      filter.fullName = { $regex: name, $options: "i" };
    }

    if (minRate || maxRate) {
      filter.hourlyRate = {};
      const min = Number(minRate);
      const max = Number(maxRate);
      if (!isNaN(min) && min > 0) filter.hourlyRate.$gte = min;
      if (!isNaN(max) && max < 500) filter.hourlyRate.$lte = max;
      if (Object.keys(filter.hourlyRate).length === 0) delete filter.hourlyRate;
    }

    if (availabilityDays) {
      const days = availabilityDays.split(",").map((d) => d.trim()).filter(Boolean);
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
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}