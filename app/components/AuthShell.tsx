"use client";

import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";
import { motion } from "motion/react";
import Image from "next/image";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white">
      <GravityStarsBackground className="absolute inset-0" />

      <div className="relative z-10 flex min-h-[85vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-6 text-center flex flex-col items-center justify-center">
            <Image
              src="/logoo.png"
              alt="Employers Dashboard Logo"
              width={150}
              height={60}
              className="h-auto w-auto" // Makes white logo if your logo is dark
              priority
            />
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-2 text-sm text-white/70">{subtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>
    </main>
  );
}
