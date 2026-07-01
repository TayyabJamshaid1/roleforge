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
          className="w-full max-w-md rounded-3xl border border-white/10 bg-black/45 p-7 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-7 flex flex-col items-center text-center">
            <Image
              src="/logoo.png"
              alt="RoleForge Logo"
              width={170}
              height={70}
              className="mb-5 h-auto w-auto"
              priority
            />

<h1 className="text-3xl font-semibold tracking-tight text-white">
                {title}
            </h1>

            <p className="mt-2 max-w-sm leading-6 text-zinc-500 text-[17px]">
              {subtitle}
            </p>
          </div>

          {children}
        </motion.div>
      </div>
    </main>
  );
}