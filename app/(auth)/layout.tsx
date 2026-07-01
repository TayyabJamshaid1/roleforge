export const dynamic = "force-dynamic";
export const revalidate = 0;
import AuthBackGuard from "@/lib/AuthGuard";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getCurrentUser();

  if (auth.status === "authenticated") {
    redirect(`/${auth.user.role}/dashboard`);
  }

  if (auth.status === "service_unavailable") {
    redirect("/service-unavailable");
  }

  return <><AuthBackGuard />
{children}</>;
}