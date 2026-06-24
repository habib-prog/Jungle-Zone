import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { verifyTokenEdge } from "@/middleware/verifyEdge";
import { authOptions } from "@/app/api/auth/authOptions";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;

  // 1. manual JWT auth
  if (token) {
    try {
      user = await verifyTokenEdge(token);
    } catch {}
  }

  // 2. next-auth fallback
  if (!user) {
    const session = await getServerSession(authOptions);

    if (session?.user) {
      user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: session.user.role,
      };
    }
  }

  // not logged in
  if (!user) redirect("/login");

  return <>{children}</>;
}
