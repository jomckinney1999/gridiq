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
                ? "border-[rgba(0,255,135,0.45)] bg-[rgba(0,255,135,0.12)] text-[#00ff87]"
                : "border-[rgba(255,255,255,0.1)] bg-[#111116] text-[#8888a0] hover:border-[rgba(255,255,255,0.18)]",
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
          className="min-h-[44px] flex-1 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0d0d10] px-4 text-[14px] font-semibold text-[#f2f2f5] outline-none placeholder:text-[#44445a] focus:border-[rgba(0,255,135,0.35)]"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-[rgba(255,255,255,0.12)] px-4 py-2 text-[12px] font-semibold text-[#8888a0] transition hover:bg-[rgba(255,255,255,0.04)]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onShareLink}
            className="rounded-full border border-[rgba(0,255,135,0.25)] px-4 py-2 text-[12px] font-semibold text-[#00ff87] transition hover:bg-[rgba(0,255,135,0.08)]"
          >
            Share link
          </button>
          <button
            type="button"
            onClick={onSaveImage}
            className="rounded-full border border-[rgba(255,255,255,0.12)] px-4 py-2 text-[12px] font-semibold text-[#b8b8c8] transition hover:bg-[rgba(255,255,255,0.04)]"
          >
            Save image
          </button>
          <button
            type="button"
            disabled={publishing}
            onClick={onPublish}
            className="rounded-full bg-[#00ff87] px-4 py-2 text-[12px] font-bold text-[#050507] transition hover:brightness-110 disabled:opacity-50"
          >
            {publishing ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="w-full text-[10px] font-bold uppercase tracking-[0.12em] text-[#44445a] lg:w-auto lg:py-2">
          Presets
        </span>
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={p.onClick}
            className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#111116] px-3 py-2 text-[11px] font-semibold text-[#b8b8c8] transition hover:border-[rgba(0,255,135,0.2)] hover:text-[#f2f2f5]"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
