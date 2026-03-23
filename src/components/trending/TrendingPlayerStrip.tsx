"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { TrendingPlayer } from "@/types/trending";
import { cn } from "@/lib/utils";

type TrendingPlayerStripProps = {
  players: TrendingPlayer[];
};

export function TrendingPlayerStrip({ players }: TrendingPlayerStripProps) {
  if (!players.length) return null;

  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#44445a]">
        Trending players (guru_scores)
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {players.map((p) => {
          const up = p.changePct >= 0;
          return (
            <motion.div key={p.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={`/search?q=${encodeURIComponent(p.name)}`}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#111116] px-3 py-2 text-[12px] font-semibold text-[#f2f2f5] transition hover:border-[rgba(0,255,135,0.35)]",
                )}
              >
                <span className="whitespace-nowrap">{p.name}</span>
                <span
                  className={cn(
                    "tabular-nums",
                    up ? "text-[#00ff87]" : "text-[#ff6b2b]",
                  )}
                >
                  {up ? "↑" : "↓"}
                  {Math.abs(p.changePct).toFixed(1)}%
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
