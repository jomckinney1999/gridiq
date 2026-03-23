"use client";

import type { PositionFilter } from "@/types/tierlist";
import { POSITION_FILTERS } from "@/types/tierlist";
import { cn } from "@/lib/utils";

type TierListHeaderProps = {
  title: string;
  onTitleChange: (v: string) => void;
  positionFilter: PositionFilter;
  onPositionChange: (v: PositionFilter) => void;
  onReset: () => void;
  onShareLink: () => void;
  onSaveImage: () => void;
  onPublish: () => void;
  publishing: boolean;
  presets: { id: string; label: string; onClick: () => void }[];
};

export function TierListHeader({
  title,
  onTitleChange,
  positionFilter,
  onPositionChange,
  onReset,
  onShareLink,
  onSaveImage,
  onPublish,
  publishing,
  presets,
}: TierListHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {POSITION_FILTERS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPositionChange(p)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] font-bold transition",
              positionFilter === p
                ? "border-[var(--green-border)] bg-[var(--green-light)] text-[var(--green)]"
                : "border-[var(--border-md)] bg-[var(--bg-card2)] text-[var(--txt-2)] hover:border-[var(--border-md)]",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Tier list title"
          className="min-h-[44px] flex-1 rounded-xl border border-[var(--border-md)] bg-[var(--bg-card)] px-4 text-[14px] font-semibold text-[var(--txt)] outline-none placeholder:text-[var(--txt-3)] focus:border-[var(--green-border)]"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-[var(--border-md)] px-4 py-2 text-[12px] font-semibold text-[var(--txt-2)] transition hover:bg-[color-mix(in_srgb,var(--txt)_4%,transparent)]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onShareLink}
            className="rounded-full border border-[var(--green-border)] px-4 py-2 text-[12px] font-semibold text-[var(--green)] transition hover:bg-[var(--green-light)]"
          >
            Share link
          </button>
          <button
            type="button"
            onClick={onSaveImage}
            className="rounded-full border border-[var(--border-md)] px-4 py-2 text-[12px] font-semibold text-[var(--txt-2)] transition hover:bg-[color-mix(in_srgb,var(--txt)_4%,transparent)]"
          >
            Save image
          </button>
          <button
            type="button"
            disabled={publishing}
            onClick={onPublish}
            className="rounded-full bg-[var(--green)] px-4 py-2 text-[12px] font-bold text-[var(--on-green)] transition hover:brightness-110 disabled:opacity-50"
          >
            {publishing ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="w-full text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--txt-3)] lg:w-auto lg:py-2">
          Presets
        </span>
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={p.onClick}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-card2)] px-3 py-2 text-[11px] font-semibold text-[var(--txt-2)] transition hover:border-[var(--green-border)] hover:text-[var(--txt)]"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
