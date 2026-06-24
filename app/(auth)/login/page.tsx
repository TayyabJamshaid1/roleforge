"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.message || "Login failed");
      return;
    }

    router.replace(`/${data.user.role}/dashboard`);
  }

  async function handleGoogleLogin(token: string) {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.message || "Google login failed");
      return;
    }

    router.replace(`/${data.user.role}/dashboard`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Login to RoleForge
        </h1>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            className="w-full rounded border p-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded border p-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full rounded bg-black p-3 text-white">
            Login
          </button>
        </form>

        <div className="my-5 text-center text-sm text-gray-500">OR</div>

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (!credentialResponse.credential) {
              alert("Google credential not found");
              return;
            }

            handleGoogleLogin(credentialResponse.credential);
          }}
          onError={() => {
            alert("Google login failed");
          }}
        />

        <div className="mt-5 text-center text-sm">
          <a href="/forgot-password" className="underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </main>
  );
}