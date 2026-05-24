import { NextResponse } from "next/server";
import { verifyTokenEdge } from "@/middleware/verifyEdge";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const cookieToken = req.cookies.get("token")?.value;
  const nextAuthToken = await getToken({ req, secret: process.env.AUTH_SECRET });

  let user = null;

  if (cookieToken) {
    try {
      user = await verifyTokenEdge(cookieToken);
    } catch {
      // expired or invalid
    }
  }

  if (!user && nextAuthToken) {
    user = {
      id: nextAuthToken.sub,
      email: nextAuthToken.email,
      role: nextAuthToken.role || "parent",
    };
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/dashboard/admin")) {
    if (user.role !== "admin") {
      const redirectUrl = user.role === "sitter" ? "/dashboard/babySitter" : "/dashboard/parent";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  if (pathname.startsWith("/dashboard/parent")) {
    if (user.role === "sitter") {
      return NextResponse.redirect(new URL("/dashboard/babySitter", req.url));
    }
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
  }

  if (pathname.startsWith("/dashboard/babySitter")) {
    if (user.role === "parent") {
      return NextResponse.redirect(new URL("/dashboard/parent", req.url));
    }
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};