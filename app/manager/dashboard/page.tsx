"use client";

import DashboardShell from "@/app/components/DashboardShell";
import { notify } from "@/lib/toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ManagerDashboard() {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      return data.user;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: () => router.replace("/login"),
    onError: (error: Error) => notify.error(error.message),
  });

  return (
    <DashboardShell
      title="Manager Dashboard"
      subtitle="Manage your RoleForge workspace"
      role="manager"
      onLogout={() => logoutMutation.mutate()}
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="mb-4 text-xl font-semibold">Profile Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Info label="Name" value={data?.name || "Loading..."} />
          <Info label="Email" value={data?.email || "Loading..."} />
          <Info label="Role" value={data?.role || "Loading..."} />
        </div>
      </div>
    </DashboardShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}