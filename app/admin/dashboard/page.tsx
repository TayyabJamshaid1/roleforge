"use client";

import DashboardShell from "@/app/components/DashboardShell";
import { notify } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type AppUser = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "manager" | "admin";
  isActive: boolean;
};

export default function AdminDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      return data.users as AppUser[];
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

  const forceLogoutMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log(userId);
      
      const res = await fetch(`/api/admin/users/${userId}/logout`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message);

      return data;
    },
    onSuccess: () => {
      notify.success("User logged out from all devices");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: Error) => notify.error(error.message),
  });

  return (
    <DashboardShell
      title="Admin Dashboard"
      subtitle="Manage users and sessions"
      role="admin"
      onLogout={() => logoutMutation.mutate()}
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Application Users</h2>
          <p className="mt-1 text-sm text-zinc-400">
            View users and force logout suspicious accounts.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="hidden grid-cols-5 bg-white/10 px-4 py-3 text-sm font-medium text-zinc-300 md:grid">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>

          <div className="divide-y divide-white/10">
            {users.map((user,index) => (
              <div
                key={user._id}

                className="grid gap-3 px-4 py-4 md:grid-cols-5 md:items-center"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-zinc-500 md:hidden">
                    {user.email}
                  </p>
                </div>

                <div className="hidden text-sm text-zinc-400 md:block">
                  {user.email}
                </div>

                <div>
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs capitalize text-indigo-300">
                    {user.role}
                  </span>
                </div>

                <div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                    {user.isActive ? "Active" : "Disabled"}
                  </span>
                </div>

                <div className="md:text-right">
                  <button
                    disabled={forceLogoutMutation.isPending}
                    onClick={() => {
                      forceLogoutMutation.mutate(user._id);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/25 disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout User
                  </button>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="px-4 py-10 text-center text-zinc-400">
                No users found.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}