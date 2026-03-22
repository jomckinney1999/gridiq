"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

const links = ["Stats", "Stats School", "Prospects", "Advanced", "Teams", "Pricing"] as const;

export function TopNav() {
  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#050507]/70 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-3">
            <Logo />
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            {links.map((label) => (
              <a
                key={label}
                href={
                  label === "Stats School"
                    ? "/stats-school"
                    : label === "Stats"
                      ? "/search"
                      : "#"
                }
                className="rounded-full px-3 py-2 text-[12px] font-medium text-[#8888a0] transition-colors hover:bg-[#1c1c21] hover:text-[#f2f2f5]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-[12px] font-semibold text-[#8888a0] sm:flex">
              <motion.span
                aria-hidden
                className="h-2 w-2 rounded-full bg-[#00ff87]"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[#00ff87]">Live</span>
            </div>

            <a
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#00ff87] px-4 text-[12px] font-semibold text-[#050507] shadow-[0_0_20px_rgba(0,255,135,0.25)] transition hover:brightness-110 hover:shadow-[0_0_26px_rgba(0,255,135,0.35)]"
            >
              Get Early Access →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

