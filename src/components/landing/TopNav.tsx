"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PRIMARY_NAV, isActiveNav } from "@/config/nav";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
          ? "border-[var(--green)] text-[var(--green)]"
          : "border-transparent text-[var(--txt-2)] hover:text-[var(--txt)]",
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
        <div className="border-b-[0.5px] border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-base)_95%,transparent)] backdrop-blur-md">
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

            <div className="flex shrink-0 items-center gap-2.5">
              <ThemeToggle />
              <div className="hidden items-center gap-1.5 text-[12px] font-semibold text-[var(--txt-2)] sm:flex">
                <motion.span
                  aria-hidden
                  className="h-2 w-2 rounded-full bg-[var(--green)]"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-[var(--green)]">Live</span>
              </div>

              <Link href="#" className="nav-cta">
                Get Pro →
              </Link>

              <button
                type="button"
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
                aria-expanded={drawerOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-md)] bg-[var(--bg-card)] text-[var(--txt)] md:hidden"
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
            className="fixed inset-0 z-[60] bg-[var(--overlay-scrim)] md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100vw,320px)] flex-col border-l border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-md)] md:hidden"
          >
            <div className="flex h-[72px] items-center justify-between border-b border-[var(--border)] px-4">
              <span className="text-[13px] font-semibold text-[var(--txt)]">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-lg px-2 py-1 text-[20px] leading-none text-[var(--txt-2)] hover:text-[var(--txt)]"
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
                        ? "bg-[var(--green-light)] text-[var(--green)]"
                        : "text-[var(--txt-2)] hover:bg-[color-mix(in_srgb,var(--txt)_4%,transparent)] hover:text-[var(--txt)]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-[var(--border)] p-4">
              <div className="mb-4 flex items-center gap-2 text-[12px] font-semibold text-[var(--txt-2)]">
                <motion.span
                  aria-hidden
                  className="h-2 w-2 rounded-full bg-[var(--green)]"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-[var(--green)]">Live</span>
              </div>
              <Link
                href="#"
                className="flex h-11 w-full items-center justify-center rounded-full bg-[var(--green)] px-4 text-[13px] font-semibold text-[var(--on-green)] shadow-[var(--shadow-glow-g)] transition hover:brightness-110"
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
