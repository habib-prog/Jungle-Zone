import { connectDB } from "@/config/db";
import adminSchema from "@/models/adminSchema";
import { verifyAdmin } from "../auth";

export const dynamic = "force-dynamic";

const SUPER_ADMIN_EMAIL = (
  process.env.SUPER_ADMIN_EMAIL || "xavierjames701@gmail.com"
)
  .trim()
  .toLowerCase();

export async function GET(req) {
  try {
    await verifyAdmin();
    await connectDB();

    const admins = await adminSchema
      .find()
      .select("-password")
      .sort({ createdAt: 1 });

    const adminsWithRole = admins.map((a) => {
      const obj = a.toObject();
      obj.isSuperAdmin =
        obj.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL;
      return obj;
    });

    return Response.json(
      { admins: adminsWithRole },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const admin = await verifyAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Admin id is required" }, { status: 400 });
    }

    const target = await adminSchema.findById(id);
    if (!target) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }

    if (target.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL) {
      return Response.json(
        { error: "The super admin cannot be removed" },
        { status: 403 },
      );
    }

    if (target.email.trim().toLowerCase() === admin.email?.trim().toLowerCase()) {
      return Response.json(
        { error: "You cannot remove your own admin account" },
        { status: 403 },
      );
    }

    await adminSchema.findByIdAndDelete(id);

    return Response.json(
      { message: "Admin removed successfully" },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 },
    );
  }
}
