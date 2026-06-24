"use client";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();

  async function handleLogout(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/logout-all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.message || "Logout failed");
      return;
    }

    router.replace(`/login`);
  }
  return (
    <div>
      User dashboard
      <button onClick={handleLogout} className="bg-green-500 p-4 text-xl m-3">
        Logout
      </button>
    </div>
  );
};

export default page;
