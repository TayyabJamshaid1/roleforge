"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { log } from "console";
import { notify } from "@/lib/toast";

export default function VerifyEmailPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) return;

    const verify = async () => {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          token,
        }),
      });

      const data = await response.json();
      if (data.success) {
        notify.success("Email Verified Successfully");

        router.replace("/login");
      } else {
        notify.error(data.message);
      }
    };

    verify();
  }, []);

  return <div>Verifying Email...</div>;
}
