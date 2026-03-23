"use client";

import type { StatGridCell as CellType } from "@/types/stat-grid";
import { statValueAccent } from "@/lib/stat-grid/stat-accent";
import { cn } from "@/lib/utils";

type StatGridCellProps = {
  cell: CellType;
  index: number;
  selected: boolean;
  solved: boolean;
  shake: boolean;
  onSelect: () => void;
};

export function StatGridCell({
  cell,
  index,
  selected,
  solved,
  shake,
  onSelect,
}: StatGridCellProps) {
  const accent = statValueAccent(cell.stat_label);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={solved}
      className={cn(
        "relative flex min-h-[120px] flex-col items-stretch overflow-hidden rounded-xl border bg-[var(--bg-card2)] p-3 text-left transition-all duration-200",
        selected && !solved && "border-[var(--green)] shadow-[var(--shadow-glow-g)]",
        !selected && !solved && "border-[var(--border)] hover:border-[var(--border-md)]",
        solved && "border-[var(--green-border)] shadow-[var(--shadow-glow-g)]",
        shake && "animate-[stat-grid-shake_0.45s_ease-in-out]",
      )}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--txt-3)]">{cell.stat_label}</div>
      <div
        className="mt-1 text-[22px] font-extrabold leading-none tracking-[-0.5px]"
        style={{ color: accent }}
      >
        {cell.stat_value}
      </div>
      <div className="mt-1 line-clamp-2 text-[9px] leading-snug text-[var(--txt-muted)]">{cell.context}</div>

      {solved ? (
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] pt-2 text-[11px] font-semibold text-[var(--green)]">
          <span className="truncate">{cell.answer}</span>
          <span aria-hidden>✓</span>
        </div>
      ) : (
        <div className="mt-auto pt-2 text-[9px] text-[var(--txt-3)]">Cell {index + 1}</div>
      )}
    </button>
  );
}
