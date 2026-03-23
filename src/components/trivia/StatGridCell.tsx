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
        "relative flex min-h-[120px] flex-col items-stretch overflow-hidden rounded-xl border bg-[#111116] p-3 text-left transition-all duration-200",
        selected && !solved && "border-[#00ff87] shadow-[0_0_20px_rgba(0,255,135,0.15)]",
        !selected && !solved && "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)]",
        solved && "border-[rgba(0,255,135,0.45)] shadow-[0_0_24px_rgba(0,255,135,0.12)]",
        shake && "animate-[stat-grid-shake_0.45s_ease-in-out]",
      )}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#44445a]">{cell.stat_label}</div>
      <div
        className="mt-1 text-[22px] font-extrabold leading-none tracking-[-0.5px]"
        style={{ color: accent }}
      >
        {cell.stat_value}
      </div>
      <div className="mt-1 line-clamp-2 text-[9px] leading-snug text-[#55556a]">{cell.context}</div>

      {solved ? (
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[rgba(255,255,255,0.06)] pt-2 text-[11px] font-semibold text-[#00ff87]">
          <span className="truncate">{cell.answer}</span>
          <span aria-hidden>✓</span>
        </div>
      ) : (
        <div className="mt-auto pt-2 text-[9px] text-[#44445a]">Cell {index + 1}</div>
      )}
    </button>
  );
}
