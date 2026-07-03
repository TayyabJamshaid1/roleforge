"use client";

import { LogOut, Shield, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardShell({
  title,
  subtitle,
  role,
  children,
  onLogout,
}: {
  title: string;
  subtitle: string;
  role: "user" | "manager" | "admin";
  children: React.ReactNode;
  onLogout: () => void;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl",
                role === "admin" ? "bg-red-500/20" : "bg-indigo-500/20",
              )}
            >
              {role === "admin" ? <Shield /> : <UserRound />}
            </div>

            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:bg-zinc-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </header>

        {children}
      </div>
    </main>
  );
}