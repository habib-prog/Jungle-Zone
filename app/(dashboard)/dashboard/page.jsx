import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { verifyTokenEdge } from "@/middleware/verifyEdge";
import { authOptions } from "@/app/api/auth/authOptions";
import { normalizeRole } from "@/app/lib/roleUtils";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;

  if (token) {
    try {
      user = await verifyTokenEdge(token);
      if (user?.role) {
        user.role = normalizeRole(user.role);
      }
    } catch {}
  }

  if (!user) {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      user = {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
        role: normalizeRole(session.user.role),
      };
    }
  }

  if (!user) redirect("/login");
  // ROLE ROUTING
  if (user.role === "admin") redirect("/dashboard/admin");

  if (user.role === "babysitter") redirect("/dashboard/babySitter");

  if (user.role === "parent") redirect("/dashboard/parent");

  redirect("/login");
}
