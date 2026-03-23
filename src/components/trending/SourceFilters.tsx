"use client";

import { cn } from "@/lib/utils";

export const SOURCE_FILTER_IDS = [
  "ALL",
  "ESPN",
  "Twitter",
  "Reddit",
  "Beat",
  "NFL",
  "PFF",
] as const;

export type SourceFilterId = (typeof SOURCE_FILTER_IDS)[number];

const LABELS: Record<string, string> = {
  ALL: "All Sources",
  ESPN: "ESPN",
  Twitter: "Twitter/X",
  Reddit: "Reddit",
  Beat: "Beat Reporters",
  NFL: "NFL Network",
  PFF: "PFF",
};

type SourceFiltersProps = {
  active: Set<string>;
  onToggle: (id: string) => void;
};

export function SourceFilters({ active, onToggle }: SourceFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SOURCE_FILTER_IDS.map((id) => {
        const on = active.has(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
              on
                ? "border-[rgba(0,255,135,0.45)] bg-[rgba(0,255,135,0.12)] text-[#00ff87]"
                : "border-[rgba(255,255,255,0.08)] bg-[#0d0d10] text-[#8888a0] hover:border-[rgba(255,255,255,0.14)] hover:text-[#b8b8c8]",
            )}
          >
            {LABELS[id] ?? id}
          </button>
        );
      })}
    </div>
  );
}
