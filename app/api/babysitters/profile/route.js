import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getAuthenticatedUser } from "@/middleware/auth";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";

// GET — fetch profile
export async function GET() {
    try {
        const user = await getAuthenticatedUser();
        if (!user || !user.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const id = user.id;
        if (!id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectDB();
        const sitter = await BabySitterRegistration.findById(id).select("-password");
        if (!sitter) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ sitter }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const user = await getAuthenticatedUser();
        if (!user || !user.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const id = user.id;

        const body = await req.json();

        const allowed = ["fullName", "phoneNumber", "age", "location", "zipCode", "description", "certifications", "educationLevel", "languages", "yearsOfExperience", "hourlyRate", "comfortableWithAgeGroup", "skills", "availability"];
        const updates = {};
        for (const key of allowed) {
            if (body[key] !== undefined) updates[key] = body[key];
        }

        await connectDB();
        const account = await BabySitterRegistration.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        ).select("-password");

        return NextResponse.json({ success: true, message: "Profile updated successfully", account }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
    }
}