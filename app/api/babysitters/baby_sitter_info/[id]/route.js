import { connectDB } from "@/config/db";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import mongoose from "mongoose";

export async function GET(req, context) {
  try {
    const params = await context.params; // FIX
    const id = params.id;

    console.log("ID:", id);

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400,
      });
    }

    await connectDB();

    const data = await BabySitterRegistration.findById(id);

    if (!data) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Success",
        data: data,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
