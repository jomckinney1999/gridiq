"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NFL_DIVISIONS } from "@/lib/trending/nfl-divisions";
import { cn } from "@/lib/utils";

function pathTeamSegment(pathname: string | null): string | null {
  if (!pathname) return null;
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "trending") return null;
  if (parts.length < 2) return "ALL";
  return parts[1]?.toUpperCase() ?? "ALL";
}

export function TeamSidebar() {
  const pathname = usePathname();
  const segment = pathTeamSegment(pathname);

  function teamHref(abbr: string) {
    return `/trending/${abbr}`;
  }

  function isActive(abbr: string) {
    if (abbr === "ALL") {
      return segment === "ALL" || segment === null;
    }
    return segment === abbr;
  }

  return (
    <aside className="flex max-h-[min(42vh,320px)] min-h-0 w-full shrink-0 flex-col border-b border-[rgba(255,255,255,0.06)] bg-[#0d0d10] md:h-full md:max-h-none md:w-[196px] md:border-b-0 md:border-r">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-4">
        <Link
          href="/trending"
          className={cn(
            "mb-3 rounded-lg px-2 py-2 text-[12px] font-semibold transition-colors",
            isActive("ALL")
              ? "bg-[rgba(0,255,135,0.08)] text-[#00ff87]"
              : "text-[#b8b8c8] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f2f2f5]",
          )}
        >
          All NFL
        </Link>

        {NFL_DIVISIONS.map((div) => (
          <div key={div.id} className="mb-4">
            <div className="px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#55556a]">
              {div.label}
            </div>
            <nav className="mt-1.5 flex flex-col gap-0.5">
              {div.teams.map((team) => {
                const active = isActive(team.abbr);
                return (
                  <Link
                    key={team.abbr}
                    href={teamHref(team.abbr)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] font-semibold transition-colors",
                      active
                        ? "bg-[rgba(0,255,135,0.08)] text-[#00ff87]"
                        : "text-[#b8b8c8] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f2f2f5]",
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="min-w-0 truncate">{team.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
