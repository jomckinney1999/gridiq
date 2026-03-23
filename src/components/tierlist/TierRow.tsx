"use client";

import type { TierKey, TierListPlayer } from "@/types/tierlist";
import { PlayerChip, type DragSource } from "@/components/tierlist/PlayerChip";
import { cn } from "@/lib/utils";

const TIER_ACCENTS: Record<
  TierKey,
  { label: string; bar: string; text: string }
> = {
  S: {
    label: "S",
    bar: "bg-[#00ff87]",
    text: "text-[#050507]",
  },
  A: {
    label: "A",
    bar: "bg-[#3b9eff]",
    text: "text-white",
  },
  B: {
    label: "B",
    bar: "bg-[#a855f7]",
    text: "text-white",
  },
  C: {
    label: "C",
    bar: "bg-[#ff6b2b]",
    text: "text-[#050507]",
  },
  D: {
    label: "D",
    bar: "bg-[#ef4444]",
    text: "text-white",
  },
};

type TierRowProps = {
  tier: TierKey;
  players: TierListPlayer[];
  draggingId: string | null;
  dropHighlight: boolean;
  readOnly?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onRemovePlayer?: (playerId: string) => void;
  onDragPick?: (playerId: string) => void;
};

export function TierRow({
  tier,
  players,
  draggingId,
  dropHighlight,
  readOnly = false,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemovePlayer,
  onDragPick,
}: TierRowProps) {
  const acc = TIER_ACCENTS[tier];

  return (
    <div
      className={cn(
        "flex min-h-[88px] gap-0 overflow-hidden rounded-xl border transition-all duration-200",
        dropHighlight
          ? "border-[#00ff87] bg-[rgba(0,255,135,0.08)] shadow-[0_0_24px_rgba(0,255,135,0.12)]"
          : "border-[rgba(255,255,255,0.06)] bg-[#0d0d10]",
      )}
      onDragOver={readOnly ? undefined : onDragOver}
      onDragLeave={readOnly ? undefined : onDragLeave}
      onDrop={readOnly ? undefined : onDrop}
    >
      <div
        className={cn(
          "flex w-[46px] shrink-0 items-center justify-center text-[18px] font-extrabold",
          acc.bar,
          acc.text,
        )}
      >
        {acc.label}
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap content-start gap-2 p-2">
        {players.map((p) => (
          <PlayerChip
            key={p.id}
            player={p}
            from={tier as DragSource}
            dragging={draggingId === p.id}
            readOnly={readOnly}
            onRemove={onRemovePlayer ? () => onRemovePlayer(p.id) : undefined}
            onDragStartPick={onDragPick ? () => onDragPick(p.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
