"use client";

import { motion } from "framer-motion";
import type { KeyStat, StatAccent } from "@/types/gridiq-query";

const ACCENT: Record<StatAccent, { line: string; text: string; glow: string }> = {
  green: {
    line: "from-[var(--green)]",
    text: "text-[var(--green)]",
    glow: "color-mix(in srgb, var(--green) 25%, transparent)",
  },
  orange: {
    line: "from-[var(--orange)]",
    text: "text-[var(--orange)]",
    glow: "color-mix(in srgb, var(--orange) 25%, transparent)",
  },
  blue: {
    line: "from-[var(--blue)]",
    text: "text-[var(--blue)]",
    glow: "color-mix(in srgb, var(--blue) 22%, transparent)",
  },
  purple: {
    line: "from-[var(--purple)]",
    text: "text-[var(--purple)]",
    glow: "color-mix(in srgb, var(--purple) 22%, transparent)",
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
            className="relative overflow-hidden rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--bg-card)] p-[14px]"
          >
            <div
              aria-hidden
              className={`absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r ${c.line} to-transparent`}
            />
            <div className="text-[10px] font-bold uppercase tracking-[0.5px] text-[var(--txt-3)]">
              {s.label}
            </div>
            <div
              className={`mt-2 text-[28px] font-extrabold tabular-nums leading-none ${c.text}`}
              style={{ textShadow: `0 0 24px ${c.glow}` }}
            >
              {s.value}
            </div>
            {s.sub ? (
              <div className="mt-1 text-[11px] leading-snug text-[var(--txt-muted)]">{s.sub}</div>
            ) : null}
            {s.rank ? (
              <span className="mt-2 inline-block rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-2 py-0.5 text-[10px] font-bold text-[var(--txt-2)]">
                {s.rank}
              </span>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
