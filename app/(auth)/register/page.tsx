"use client";

import AuthShell from "@/app/components/AuthShell";
import { apiClient } from "@/lib/api-client";
import { notify } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const mutation = useMutation({
    mutationFn: () =>
      apiClient<{ message: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      }),
    onSuccess: (data) => notify.success(data.message),
    onError: (error) => notify.error(error.message),
  });

  return (
    <AuthShell title="Create Account" subtitle="Start your RoleForge journey">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="space-y-4"
      >
        {["name", "email", "password"].map((field) => (
          <input
            key={field}
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-indigo-400"
            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
            placeholder={field}
            value={(form as any)[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <select
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="manager">Manager</option>
        </select>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-semibold hover:bg-indigo-600">
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Register
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-300">
        Already have an account?{" "}
        <Link href="/login" className="text-white underline">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}