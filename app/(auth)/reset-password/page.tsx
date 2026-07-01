"use client";

import AuthShell from "@/app/components/AuthShell";
import { apiClient } from "@/lib/api-client";
import { notify } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      apiClient<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      }),
    onSuccess: (data) => {
      notify.success(data.message);
      router.replace("/login");
    },
    onError: (error) => notify.error(error.message),
  });

  return (
    <AuthShell title="Reset Password" subtitle="Create a new secure password">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!token) {
            notify.error("Reset token is missing");
            return;
          }

          mutation.mutate();
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Password</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-indigo-400"
            type="password"
            placeholder="enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-semibold hover:bg-indigo-600">
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Reset Password
        </button>
      </form>
    </AuthShell>
  );
}
