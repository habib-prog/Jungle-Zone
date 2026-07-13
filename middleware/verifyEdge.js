import { jwtVerify } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "Missing JWT secret for edge verification. Set JWT_SECRET, AUTH_SECRET, or NEXTAUTH_SECRET.",
  );
}

export const verifyTokenEdge = async (token) => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
};
