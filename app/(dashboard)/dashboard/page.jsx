import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { verifyTokenEdge } from "@/middleware/verifyEdge";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;

  if (token) {
    try {
      user = await verifyTokenEdge(token);
    } catch {}
  }

  if (!user) {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      user = {
        id: session.user.id,
        role: session.user.role,
      };
    }
  }

  if (!user) redirect("/login");
  // ROLE ROUTING
  if (user.role === "admin") redirect("/dashboard/admin");

  if (user.role === "babySitter") redirect("/dashboard/babySitter");

  if (user.role === "parent") redirect("/dashboard/parent");

  redirect("/login");
}