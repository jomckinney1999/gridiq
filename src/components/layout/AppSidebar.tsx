"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAppShell } from "@/components/layout/AppShell";

const DOT_COLORS = ["#00ff87", "#3b9eff", "#ff6b2b", "#a855f7", "#f2f2f5"];

const BROWSE = [
  { href: "/search?q=qb+rankings", label: "QB Rankings", icon: "◎" },
  { href: "/search?q=wr+rankings", label: "WR Rankings", icon: "◇" },
  { href: "/search?q=route+trees", label: "Route Trees", icon: "⎔" },
  { href: "/search?q=draft+board+2025", label: "Draft Board 2025", icon: "▣" },
  { href: "/search?q=team+stats", label: "Team Stats", icon: "▤" },
  { href: "/search?q=injury+report", label: "Injury Report", icon: "◉" },
] as const;

const TOOLS = [
  { href: "/search?q=player+compare", label: "Player Compare", icon: "⚖" },
  { href: "/search?q=fantasy+optimizer", label: "Fantasy Optimizer", icon: "◆" },
  { href: "/stats-school", label: "Stats School", icon: "📚" },
] as const;

function NavLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[12px] transition-colors md:justify-center lg:justify-start ${
        active
          ? "bg-[rgba(0,255,135,0.08)] text-[#00ff87]"
          : "text-[#b8b8c8] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f2f2f5]"
      }`}
      title={label}
    >
      <span className="w-5 shrink-0 text-center text-[13px] opacity-90">{icon}</span>
      <span className="hidden min-w-0 truncate lg:inline">{label}</span>
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { recentQueries } = useAppShell();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string): boolean {
    const [path, queryString] = href.split("?");
    if (pathname !== path) return false;
    if (!queryString) return !searchParams.toString();
    const want = new URLSearchParams(queryString).get("q");
    return searchParams.get("q") === want;
  }

  const sidebarInner = (
    <>
      <div className="flex items-center gap-2 px-2 py-3">
        <Link
          href="/"
          className="flex min-w-0 max-lg:[&>div>span]:hidden items-center justify-center gap-2 lg:justify-start"
          onClick={() => setMobileOpen(false)}
        >
          <Logo />
        </Link>
      </div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-2 pb-4">
        <div className="hidden lg:block">
          <div className="px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#44445a]">
            Recent
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {recentQueries.length === 0 ? (
              <p className="px-2 text-[11px] leading-snug text-[#55556a]">
                Your searches appear here.
              </p>
            ) : (
              recentQueries.map((query, i) => (
                <Link
                  key={`${query}-${i}`}
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-[11px] leading-snug text-[#8888a0] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f2f2f5]"
                  onClick={() => setMobileOpen(false)}
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: DOT_COLORS[i % DOT_COLORS.length] }}
                  />
                  <span className="line-clamp-2">{query}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="hidden px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#44445a] lg:block">
            Browse
          </div>
          <nav className="mt-0 flex flex-col gap-0.5 lg:mt-2">
            {BROWSE.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(item.href)}
              />
            ))}
          </nav>
        </div>

        <div>
          <div className="hidden px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#44445a] lg:block">
            Tools
          </div>
          <nav className="mt-2 flex flex-col gap-0.5">
            {TOOLS.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(item.href)}
              />
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-auto border-t border-[rgba(255,255,255,0.06)] px-2 py-3">
        <div className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 lg:justify-start">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[rgba(255,255,255,0.06)] text-[11px] font-bold text-[#f2f2f5]">
            U
          </div>
          <div className="hidden min-w-0 flex-1 lg:block">
            <div className="flex items-center gap-2">
              <span className="truncate text-[12px] font-semibold text-[#f2f2f5]">You</span>
              <span className="rounded-full border border-[rgba(0,255,135,0.35)] bg-[rgba(0,255,135,0.1)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#00ff87]">
                Pro
              </span>
            </div>
            <div className="truncate text-[10px] text-[#55556a]">nflstatguru.pro</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        className="fixed left-3 top-3 z-[60] flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0d0d10] text-[#f2f2f5] shadow-lg md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <span className="text-lg leading-none">☰</span>
      </button>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-[70] bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-[80] flex w-[196px] shrink-0 flex-col border-r-[0.5px] border-[rgba(255,255,255,0.06)] bg-[#0d0d10] transition-transform duration-200 md:static md:z-auto md:w-16 md:translate-x-0 lg:w-[196px] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-full min-h-0 flex-col px-2 pt-14 md:pt-3">{sidebarInner}</div>
      </aside>
    </>
  );
}
