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
                ? "border-[var(--green-border)] bg-[var(--green-light)] text-[var(--green)]"
                : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--txt-2)] hover:border-[var(--border-md)] hover:text-[var(--txt-2)]",
            )}
          >
            {LABELS[id] ?? id}
          </button>
        );
      })}
    </div>
  );
}
