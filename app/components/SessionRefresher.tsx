"use client";

import { useEffect } from "react";

export default function SessionRefresher() {
  useEffect(() => {
    fetch("/api/auth/refresh-session", {
      method: "POST",
    });
  }, []);

  return null;
}