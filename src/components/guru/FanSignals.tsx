"use client";

import { cn } from "@/lib/utils";

type Signal = {
  title: string;
  value: string;
  hint?: string;
};

type FanSignalsProps = {
  signals: Signal[];
  className?: string;
};

export function FanSignals({ signals, className }: FanSignalsProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {signals.map((s) => (
        <div
          key={s.title}
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-sm)]"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--txt-muted)]">{s.title}</p>
          <p className="mt-2 text-[20px] font-black tabular-nums text-[var(--txt)]">{s.value}</p>
          {s.hint ? <p className="mt-1 text-[11px] leading-snug text-[var(--txt-2)]">{s.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}
