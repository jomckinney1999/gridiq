"use client";

import type { TierListPlayer } from "@/types/tierlist";
import { playerInitials, teamChipBackground } from "@/lib/tierlist/team-color";
import { cn } from "@/lib/utils";

export type DragSource = "pool" | "S" | "A" | "B" | "C" | "D";

export type PlayerChipProps = {
  player: TierListPlayer;
  from: DragSource;
  dragging: boolean;
  onRemove?: () => void;
  showRemove?: boolean;
  readOnly?: boolean;
  onDragStartPick?: () => void;
};

export function PlayerChip({
  player,
  from,
  dragging,
  onRemove,
  showRemove = true,
  readOnly = false,
  onDragStartPick,
}: PlayerChipProps) {
  const bg = teamChipBackground(player.team || "NFL");

  return (
    <div
      draggable={!readOnly}
      onDragStart={(e) => {
        if (readOnly) return;
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({ playerId: player.id, from }),
        );
        e.dataTransfer.effectAllowed = "move";
        onDragStartPick?.();
      }}
      className={cn(
        "group flex min-w-[140px] max-w-[180px] items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card2)] px-2 py-1.5",
        !readOnly && "cursor-grab active:cursor-grabbing",
        dragging && "opacity-40",
      )}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-extrabold text-white shadow-inner"
        style={{ backgroundColor: bg }}
      >
        {playerInitials(player.name)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11px] font-semibold leading-tight text-[var(--txt)]">
          {player.name}
        </div>
        <div className="truncate text-[9px] text-[var(--txt-muted)]">
          {player.team} · {player.position}
        </div>
      </div>
      {showRemove && onRemove && !readOnly ? (
        <button
          type="button"
          aria-label={`Remove ${player.name}`}
          className="shrink-0 rounded p-0.5 text-[12px] text-[var(--txt-muted)] opacity-0 transition hover:text-[var(--orange)] group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        >
          ×
        </button>
      ) : !readOnly ? (
        <span className="shrink-0 cursor-grab px-0.5 text-[10px] text-[var(--txt-3)]" title="Drag">
          ⋮⋮
        </span>
      ) : null}
    </div>
  );
}
