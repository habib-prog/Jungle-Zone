import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import { getAuthenticatedUser } from "@/middleware/auth";

// GET — fetch profile
export async function GET() {
    try {
        const auth = await getAuthenticatedUser();
        if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectDB();
        const parent = auth.id
            ? await parentSchema.findById(auth.id).select("-password")
            : await parentSchema.findOne({ email: auth.email }).select("-password");

        if (!parent) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ parent }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await getAuthenticatedUser();
        if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        const allowed = ["fullName", "phone", "postCode", "houseNo", "road", "state", "moreInfo", "nationalId"];
        const updates = {};
        for (const key of allowed) {
            if (body[key] !== undefined) updates[key] = body[key];
        }

        await connectDB();
        const account = auth.id
            ? await parentSchema.findByIdAndUpdate(auth.id, { $set: updates }, { new: true }).select("-password")
            : await parentSchema.findOneAndUpdate(
                { email: auth.email },
                { $set: updates },
                { new: true }
            ).select("-password");

        return NextResponse.json({ success: true, message: "Profile updated successfully", account }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
    }
}
