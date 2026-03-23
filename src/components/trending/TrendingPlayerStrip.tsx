"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { safeText } from "@/lib/safe-text";
import type { TrendingPlayer } from "@/types/trending";
import { cn } from "@/lib/utils";

type TrendingPlayerStripProps = {
  players: TrendingPlayer[];
};

export function TrendingPlayerStrip({ players }: TrendingPlayerStripProps) {
  if (!players.length) return null;

  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--txt-3)]">
        Trending players (guru_scores)
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {players.map((p) => {
          const name = safeText(p.name, "");
          if (!name) return null;
          const up = typeof p.changePct === "number" && p.changePct >= 0;
          return (
            <motion.div key={p.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={`/search?q=${encodeURIComponent(name)}`}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card2)] px-3 py-2 text-[12px] font-semibold text-[var(--txt)] transition hover:border-[var(--green-border)]",
                )}
              >
                <span className="whitespace-nowrap">{name}</span>
                <span
                  className={cn(
                    "tabular-nums",
                    up ? "text-[var(--green)]" : "text-[var(--orange)]",
                  )}
                >
                  {up ? "↑" : "↓"}
                  {typeof p.changePct === "number" ? Math.abs(p.changePct).toFixed(1) : "—"}%
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
