"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PRIMARY_NAV, isActiveNav } from "@/config/nav";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type TopNavProps = {
  /** When true, nav bar starts after the app sidebar (md+). */
  alignWithSidebar?: boolean;
};

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 px-3 py-2 text-[13px] font-semibold transition-colors",
        active
          ? "border-[#00ff87] text-[#00ff87]"
          : "border-transparent text-[#8888a0] hover:text-[#f2f2f5]",
      )}
    >
      {label}
    </Link>
  );
}

export function TopNav({ alignWithSidebar = false }: TopNavProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          alignWithSidebar && "md:left-16 lg:left-[196px]",
        )}
      >
        <div className="border-b-[0.5px] border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,7,0.95)] backdrop-blur-md">
          <div className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
            <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
              <Logo />
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex lg:gap-1">
              {PRIMARY_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActiveNav(pathname, item.href)}
                />
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden items-center gap-2 text-[12px] font-semibold text-[#8888a0] sm:flex">
                <motion.span
                  aria-hidden
                  className="h-2 w-2 rounded-full bg-[#00ff87]"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-[#00ff87]">Live</span>
              </div>

              <Link
                href="#"
                className="hidden h-10 items-center justify-center rounded-full bg-[#00ff87] px-4 text-[12px] font-semibold text-[#050507] shadow-[0_0_20px_rgba(0,255,135,0.25)] transition hover:brightness-110 hover:shadow-[0_0_26px_rgba(0,255,135,0.35)] sm:inline-flex"
              >
                Get Pro →
              </Link>

              <button
                type="button"
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
                aria-expanded={drawerOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0d0d10] text-[#f2f2f5] md:hidden"
                onClick={() => setDrawerOpen((o) => !o)}
              >
                <span className="text-lg leading-none">☰</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {drawerOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[60] bg-black/60 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100vw,320px)] flex-col border-l border-[rgba(255,255,255,0.06)] bg-[#0d0d10] shadow-[-8px_0_32px_rgba(0,0,0,0.45)] md:hidden"
          >
            <div className="flex h-[72px] items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-4">
              <span className="text-[13px] font-semibold text-[#f2f2f5]">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-lg px-2 py-1 text-[20px] leading-none text-[#8888a0] hover:text-[#f2f2f5]"
                onClick={() => setDrawerOpen(false)}
              >
                ×
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-4">
              {PRIMARY_NAV.map((item) => {
                const active = isActiveNav(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-3 text-[15px] font-semibold transition-colors",
                      active
                        ? "bg-[rgba(0,255,135,0.08)] text-[#00ff87]"
                        : "text-[#8888a0] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f2f2f5]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-[rgba(255,255,255,0.06)] p-4">
              <div className="mb-4 flex items-center gap-2 text-[12px] font-semibold text-[#8888a0]">
                <motion.span
                  aria-hidden
                  className="h-2 w-2 rounded-full bg-[#00ff87]"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-[#00ff87]">Live</span>
              </div>
              <Link
                href="#"
                className="flex h-11 w-full items-center justify-center rounded-full bg-[#00ff87] text-[13px] font-semibold text-[#050507] shadow-[0_0_20px_rgba(0,255,135,0.25)] transition hover:brightness-110"
                onClick={() => setDrawerOpen(false)}
              >
                Get Pro →
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
