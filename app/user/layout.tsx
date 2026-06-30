import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import SessionRefresher from "../components/SessionRefresher";

export default async function UserLayout({
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
      return (
        <>
          <SessionRefresher />
          {children}
        </>
      );
  }
}