import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import SessionRefresher from "../components/SessionRefresher";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getCurrentUser();

  switch (auth.status) {
    case "unauthenticated":
      redirect("/login");

    case "service_unavailable":
      redirect("/service-unavailable");

    case "error":
      redirect(`/error?message=${encodeURIComponent(auth.message)}`);

    case "authenticated":
      if (auth.user.role !== "manager" && auth.user.role !== "admin") {
        redirect("/unauthorized");
      }

      return (
        <>
          <SessionRefresher />
          {children}
        </>
      );
  }
}