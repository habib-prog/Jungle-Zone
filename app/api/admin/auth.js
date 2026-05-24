import { verifyToken } from "@/middleware/auth";
import { cookies } from "next/headers";

export async function getAdminUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    try {
        const decoded = verifyToken(token);
        return decoded;
    } catch {
        return null;
    }
}

export async function verifyAdmin() {
    const user = await getAdminUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }
    return user;
}