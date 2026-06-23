import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "manager" && user.role !== "admin") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}