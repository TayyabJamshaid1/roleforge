"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthBackGuard() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success && data.user?.role) {
        router.replace(`/${data.user.role}/dashboard`);
      }
    };

    check();
  }, [router]);

  return null;
}