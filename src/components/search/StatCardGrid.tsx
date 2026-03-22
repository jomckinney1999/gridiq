"use client";

import { motion } from "framer-motion";
import type { KeyStat, StatAccent } from "@/types/gridiq-query";

const ACCENT: Record<StatAccent, { line: string; text: string; glow: string }> = {
  green: {
    line: "from-[#00ff87]",
    text: "text-[#00ff87]",
    glow: "rgba(0,255,135,0.25)",
  },
  orange: {
    line: "from-[#ff6b2b]",
    text: "text-[#ff6b2b]",
    glow: "rgba(255,107,43,0.25)",
  },
  blue: {
    line: "from-[#3b9eff]",
    text: "text-[#3b9eff]",
    glow: "rgba(59,158,255,0.22)",
  },
  purple: {
    line: "from-[#a855f7]",
    text: "text-[#a855f7]",
    glow: "rgba(168,85,247,0.22)",
  },
};

export function StatCardGrid({ stats }: { stats: KeyStat[] }) {
  if (!stats.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s, i) => {
        const a = (s.accent as StatAccent) || "green";
        const c = ACCENT[a] ?? ACCENT.green;
        return (
          <motion.div
            key={`${s.label}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-xl border-[0.5px] border-[rgba(255,255,255,0.06)] bg-[#0d0d10] p-[14px]"
          >
            <div
              aria-hidden
              className={`absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r ${c.line} to-transparent`}
            />
            <div className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#44445a]">
              {s.label}
            </div>
            <div
              className={`mt-2 text-[28px] font-extrabold tabular-nums leading-none ${c.text}`}
              style={{ textShadow: `0 0 24px ${c.glow}` }}
            >
              {s.value}
            </div>
            {s.sub ? (
              <div className="mt-1 text-[11px] leading-snug text-[#66667a]">{s.sub}</div>
            ) : null}
            {s.rank ? (
              <span className="mt-2 inline-block rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2 py-0.5 text-[10px] font-bold text-[#8888a0]">
                {s.rank}
              </span>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
