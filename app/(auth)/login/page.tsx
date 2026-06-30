"use client";

import AuthShell from "@/app/components/AuthShell";
import { apiClient } from "@/lib/api-client";
import { notify } from "@/lib/toast";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { Globe, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginResponse = {
  success: true;
  user: {
    role: "user" | "manager" | "admin";
  };
  message: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: () =>
      apiClient<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    onSuccess: (data) => {
      router.replace(`/${data.user.role}/dashboard`);
    },
    onError: (error) => {
      notify.error(error.message);
    },
  });

  const googleMutation = useMutation({
    mutationFn: (token: string) =>
      apiClient<LoginResponse>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ token }),
      }),
    onSuccess: (data) => {
      router.replace(`/${data.user.role}/dashboard`);
    },
    onError: (error) => {
      notify.error(error.message);
    },
  });

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Login to continue using RoleForge Auth"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginMutation.mutate();
        }}
        className="space-y-4"
      >
        <input
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-indigo-400"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-indigo-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loginMutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
        >
          {loginMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Login
        </button>
      </form>

      <div className="my-5 text-center text-sm text-slate-400">or continue with</div>

      <div className="space-y-3">
        <div className="flex justify-center rounded-xl bg-white p-2">
          <GoogleLogin
            onSuccess={(res) => {
              if (!res.credential) return notify.error("Google credential not found");
              googleMutation.mutate(res.credential);
            }}
            onError={() => notify.error("Google login failed")}
          />
        </div>

        <a
          href="/api/auth/github"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/20"
        >
          <Globe className="h-5 w-5" />
          Continue with GitHub
        </a>
      </div>

      <div className="mt-6 flex justify-between text-sm text-slate-300">
        <Link href="/register" className="hover:text-white">
          Create account
        </Link>
        <Link href="/forgot-password" className="hover:text-white">
          Forgot password?
        </Link>
      </div>
    </AuthShell>
  );
}