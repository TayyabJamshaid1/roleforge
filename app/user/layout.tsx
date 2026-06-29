import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import SessionRefresher from "../components/SessionRefresher";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      {" "}
      <SessionRefresher />
      {children}
    </>
  );
}
