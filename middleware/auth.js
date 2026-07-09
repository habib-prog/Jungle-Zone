import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { normalizeRole } from "@/app/lib/roleUtils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "Missing JWT secret. Set JWT_SECRET or AUTH_SECRET in your environment.",
  );
}

export { normalizeRole };

export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export async function comparePassword(candidate, hash) {
  return bcrypt.compare(candidate, hash);
}

export const getAuthenticatedUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded && decoded.id) {
          return {
            id: decoded.id,
            email: decoded.email || null,
            role: normalizeRole(decoded.role || "parent"),
          };
        }
      } catch (err) {
        // Token verification failed or expired, fallback to next-auth session
      }
    }

    const session = await getServerSession(authOptions);
    if (session?.user) {
      return {
        id: session.user.id || null,
        email: session.user.email || null,
        role: normalizeRole(session.user.role || "parent"),
      };
    }
  } catch (err) {
    console.error("Authentication helper error:", err);
  }
  return null;
};
