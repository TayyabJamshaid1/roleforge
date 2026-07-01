import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const auth = await getCurrentUser();

  if (auth.status === "unauthenticated") {
    redirect("/login");
  }

  if (auth.status === "service_unavailable") {
    redirect("/service-unavailable");
  }

  if (auth.status === "error") {
    redirect(`/error?message=${encodeURIComponent(auth.message)}`);
  }

  // authenticated
  redirect(`/${auth.user.role}/dashboard`);
}