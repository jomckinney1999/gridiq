"use client";

import { cn } from "@/lib/utils";

type BarProps = {
  label: string;
  value: number;
  display: string;
  accent: "blue" | "orange";
};

function MiniBar({ label, value, display, accent }: BarProps) {
  const w = Math.min(100, Math.max(0, value));
  const fill = accent === "blue" ? "bg-[var(--blue)]" : "bg-[var(--orange)]";
  const text = accent === "blue" ? "text-[var(--blue)]" : "text-[var(--orange)]";
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] font-semibold text-[var(--txt-2)]">
        <span>{label}</span>
        <span className={cn("tabular-nums", text)}>{display}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-subtle-2)]">
        <div className={cn("h-full rounded-full transition-all", fill)} style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}

type ScoreBreakdownProps = {
  expertScore: number;
  fanScore: number;
  expertBars: { label: string; value: number; display: string }[];
  fanBars: { label: string; value: number; display: string }[];
  className?: string;
};

export function ScoreBreakdown({ expertScore, fanScore, expertBars, fanBars, className }: ScoreBreakdownProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2", className)}>
      <section className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--blue)]">Expert score</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[44px] font-black tabular-nums leading-none text-[var(--blue)]">{Math.round(expertScore)}</span>
          <span className="text-[13px] font-medium text-[var(--txt-muted)]">PFF · ESPN · consensus · stats</span>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          {expertBars.map((b) => (
            <MiniBar key={b.label} label={b.label} value={b.value} display={b.display} accent="blue" />
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--orange)]">Fan score</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[44px] font-black tabular-nums leading-none text-[var(--orange)]">{Math.round(fanScore)}</span>
          <span className="text-[13px] font-medium text-[var(--txt-muted)]">Reddit · ADP · tiers · buzz</span>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          {fanBars.map((b) => (
            <MiniBar key={b.label} label={b.label} value={b.value} display={b.display} accent="orange" />
          ))}
        </div>
      </section>
    </div>
  );
}
