import { getAuthenticatedUser } from "@/middleware/auth";

export async function getAdminUser() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

export async function verifyAdmin() {
  const user = await getAdminUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}
