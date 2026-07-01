"use client";

import AuthShell from "@/app/components/AuthShell";
import { apiClient } from "@/lib/api-client";
import { notify } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      apiClient<{ message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    onSuccess: (data) => notify.success(data.message),
    onError: (error) => notify.error(error.message),
  });

  return (
    <AuthShell title="Forgot Password" subtitle="We will send you a reset link">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="space-y-4"
      >
             <div className="space-y-2">
  <label className="text-sm font-medium text-zinc-300">
    Email Address
  </label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-indigo-400"
          type="email"
          placeholder="enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
</div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-semibold hover:bg-indigo-600">
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Send Reset Link
        </button>
      </form>

      <Link href="/login" className="mt-6 block text-center text-sm text-slate-300">
        Back to login
      </Link>
    </AuthShell>
  );
}