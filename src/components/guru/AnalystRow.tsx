"use client";

type AnalystRowProps = {
  name: string;
  org: string;
  initials: string;
  color: string;
  score: number;
  label: string;
};

export function AnalystRow({ name, org, initials, color, score, label }: AnalystRowProps) {
  const w = Math.min(100, Math.max(0, score));
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card2)] px-3 py-2.5">
      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[11px] font-black text-[var(--inverse)]"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-bold text-[var(--txt)]">{name}</div>
        <div className="truncate text-[11px] text-[var(--txt-muted)]">{org}</div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--bg-subtle-2)]">
          <div
            className="h-full rounded-full bg-[var(--purple)]"
            style={{ width: `${w}%`, backgroundColor: color }}
          />
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[12px] font-bold tabular-nums text-[var(--txt)]">{label}</div>
        <div className="text-[10px] font-medium text-[var(--txt-3)]">score</div>
      </div>
    </div>
  );
}
