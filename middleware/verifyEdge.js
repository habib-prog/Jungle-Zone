import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "Missing JWT secret for edge verification. Set JWT_SECRET or AUTH_SECRET.",
  );
}

export const verifyTokenEdge = async (token) => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
};
