"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { log } from "console";

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
        alert("Email Verified Successfully");

        router.replace("/login");
      } else {
        alert(data.message);
      }
    };

    verify();
  }, []);

  return <div>Verifying Email...</div>;
}
