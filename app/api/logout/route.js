import { NextResponse } from "next/server";

export async function POST() {
    try {
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