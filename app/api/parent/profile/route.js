import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import { verifyToken } from "@/middleware/auth";
import { cookies } from "next/headers";

// Helper to get current user id from token
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

// GET — fetch profile
export async function GET() {
    try {
        const id = await getUserId();
        if (!id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectDB();
        const parent = await parentSchema.findById(id).select("-password");
        if (!parent) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ parent }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const id = await getUserId();
        if (!id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        const allowed = ["fullName", "phone", "postCode", "houseNo", "road", "state", "moreInfo", "nationalId"];
        const updates = {};
        for (const key of allowed) {
            if (body[key] !== undefined) updates[key] = body[key];
        }

        await connectDB();
        const account = await parentSchema.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        ).select("-password");

        return NextResponse.json({ success: true, message: "Profile updated successfully", account }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
    }
}