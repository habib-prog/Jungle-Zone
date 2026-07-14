import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/middleware/auth";
import { recordActivity } from "@/app/lib/activityLogger";

export async function POST(req) {
    try {
        let body = {};
        try {
            body = await req.json();
        } catch {
            body = {};
        }

        const user = await getAuthenticatedUser();
        if (user) {
            await recordActivity(req, {
                action: "logout",
                userAgent: body.userAgent || undefined,
                timezone: body.timezone || undefined,
                user: {
                    id: user.id,
                    email: user.email,
                    name: "",
                    role: user.role,
                    timezone: body.timezone,
                },
            });
        }

        const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
        res.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0), // Expire the cookie
        });
        return res;
    } catch (error) {
        return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
    }
}
