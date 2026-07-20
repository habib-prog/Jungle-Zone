import { NextResponse } from "next/server";
import { verifyTokenEdge } from "@/middleware/verifyEdge";
import { getToken } from "next-auth/jwt";
import { normalizeRole } from "@/app/lib/roleUtils";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const cookieToken = req.cookies.get("token")?.value;
  const nextAuthToken = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

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
      role: normalizeRole(nextAuthToken.role || "parent"),
    };
  }

  if (user?.role) {
    user.role = normalizeRole(user.role);
  }

  if (!user?.role && nextAuthToken?.role) {
    user = {
      ...user,
      role: normalizeRole(nextAuthToken.role || "parent"),
    };
  }

  // Allow public access to /babysitters (list page)
  if (pathname === "/babysitters") {
    return NextResponse.next();
  }

  // Require login for individual babysitter profiles
  if (pathname.startsWith("/babysitters/")) {
    if (!user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Only allow parents to view babysitter profiles
    if (user.role !== "parent") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Require login for dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/dashboard/admin")) {
    if (user?.role !== "admin") {
      const redirectUrl =
        user.role === "babysitter"
          ? "/dashboard/babySitter"
          : "/dashboard/parent";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  if (pathname.startsWith("/dashboard/parent")) {
    if (user?.role === "babysitter") {
      return NextResponse.redirect(new URL("/dashboard/babySitter", req.url));
    }
    if (user?.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
  }

  if (pathname.startsWith("/dashboard/babySitter")) {
    if (user?.role === "parent") {
      return NextResponse.redirect(new URL("/dashboard/parent", req.url));
    }
    if (user?.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/babysitters/:id*"],
};
