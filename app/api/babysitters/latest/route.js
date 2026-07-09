import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const rawLimit = Number(searchParams.get("limit")) || 3;
    const limit = Math.min(Math.max(rawLimit, 1), 6);
    const zipCode = searchParams.get("zipCode");

    const filter = { isApproved: true };

    if (zipCode) {
      const normalizedZipCode = zipCode.replace(/\s+/g, "");
      const zipNum = Number(normalizedZipCode);

      if (!normalizedZipCode || Number.isNaN(zipNum)) {
        return Response.json(
          { error: "Postcode must be numeric" },
          { status: 400 },
        );
      }

      filter.zipCode = zipNum;
    }

    const data = await BabySitterRegistration.find(filter)
      .select("fullName profilePhoto zipCode hourlyRate location")
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(
      {
        message: "Latest babysitters fetched",
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
