import { connectDB } from "@/config/db";
import { verifyAdmin } from "../auth";
import subscriptionPlans from "@/models/subscriptionPlans";

export async function GET(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const subscriptions = await subscriptionPlans.find().sort({ createdAt: -1 });
    return Response.json(subscriptions);
  } catch (error) {
    return Response.json(
      { error: error.message || "Server error" },
      {
        status: error.message?.includes("Unauthorized") ? 403 : 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const body = await req.json();
    const {
      name,
      category,
      description,
      price,
      duration,
      durationUnit,
      features,
      isActive,
      isPopular,
      isDiscounted,
      discountPercentage,
    } = body;

    if (!name || !category || price === undefined || price === null || !duration) {
      return Response.json(
        { error: "name, category, price, and duration are required" },
        { status: 400 }
      );
    }

    if (!["parent", "babysitter", "both"].includes(category)) {
      return Response.json({ error: "Invalid category" }, { status: 400 });
    }

    if (durationUnit && !["free", "months", "years"].includes(durationUnit)) {
      return Response.json({ error: "Invalid durationUnit" }, { status: 400 });
    }

    const existingPlan = await subscriptionPlans.findOne({ name });
    if (existingPlan) {
      return Response.json(
        { error: "Plan with this name already exists" },
        { status: 409 }
      );
    }

    const newPlan = await subscriptionPlans.create({
      name,
      category,
      description: description || "",
      price,
      duration,
      durationUnit: durationUnit || "months",
      features: features || [],
      isActive: isActive ?? true,
      isPopular: isPopular ?? false,
      isDiscounted: isDiscounted ?? false,
      discountPercentage: discountPercentage || 0,
    });

    return Response.json(
      { message: "Subscription plan created", data: newPlan },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return Response.json({ error: "Plan ID is required" }, { status: 400 });
    }

    const allowedFields = [
      "name",
      "category",
      "description",
      "price",
      "duration",
      "durationUnit",
      "features",
      "isActive",
      "isPopular",
      "isDiscounted",
      "discountPercentage",
    ];
    const updateData = {};

    for (const field of allowedFields) {
      if (updateFields[field] !== undefined) {
        updateData[field] = updateFields[field];
      }
    }

    if (
      updateData.category &&
      !["parent", "babysitter", "both"].includes(updateData.category)
    ) {
      return Response.json({ error: "Invalid category" }, { status: 400 });
    }

    if (
      updateData.durationUnit &&
      !["free", "months", "years"].includes(updateData.durationUnit)
    ) {
      return Response.json({ error: "Invalid durationUnit" }, { status: 400 });
    }

    if (updateData.name) {
      const existingPlan = await subscriptionPlans.findOne({
        name: updateData.name,
        _id: { $ne: id },
      });
      if (existingPlan) {
        return Response.json(
          { error: "Plan with this name already exists" },
          { status: 409 }
        );
      }
    }

    const updatedPlan = await subscriptionPlans.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPlan) {
      return Response.json({ error: "Plan not found" }, { status: 404 });
    }

    return Response.json({
      message: "Subscription plan updated",
      data: updatedPlan,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return Response.json({ error: "Plan ID is required" }, { status: 400 });
    }

    const deletedPlan = await subscriptionPlans.findByIdAndDelete(id);

    if (!deletedPlan) {
      return Response.json({ error: "Plan not found" }, { status: 404 });
    }

    return Response.json({
      message: "Subscription plan deleted",
      data: deletedPlan,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
