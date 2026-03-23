"use client";

import type { GridIQAPIResponse } from "@/types/gridiq-query";

const INTENT_LABELS: Record<string, string> = {
  game_stat_lookup: "Game Lookup",
  season_stats: "Season Stats",
  prospect_profile: "Prospect",
  advanced_stats: "Advanced Stats",
  ranking: "Ranking",
  comparison: "Comparison",
  general: "General",
};

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*(.+)\*\*$/);
    if (m) {
      return (
        <strong key={i} className="font-semibold text-[var(--txt)]">
          {m[1]}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function leftAccent(
  intent: string,
  responseText: string,
): { border: string; avatar: string } {
  const lower = responseText.toLowerCase();
  const turnoverish =
    lower.includes("fumble") ||
    lower.includes("interception") ||
    lower.includes("turnover") ||
    lower.includes("int ");
  if (turnoverish) {
    return {
      border: "border-l-[var(--orange)]",
      avatar: "from-[var(--orange)] to-[color-mix(in_srgb,var(--orange)_75%,var(--txt)_25%)]",
    };
  }
  if (intent === "general") {
    return { border: "border-l-[var(--blue)]", avatar: "from-[var(--blue)] to-[var(--green)]" };
  }
  return { border: "border-l-[var(--green)]", avatar: "from-[var(--green)] to-[var(--blue)]" };
}

export function AIResponseCard({ response }: { response: GridIQAPIResponse }) {
  const intentKey = response.intent ?? "general";
  const badge = INTENT_LABELS[intentKey] ?? intentKey.replace(/_/g, " ");
  const { border, avatar } = leftAccent(intentKey, response.response_text ?? "");

  return (
    <article
      className={`rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--bg-card)] p-4 ${border} border-l-2`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-md bg-gradient-to-br ${avatar} text-[8px] font-black leading-none tracking-tighter text-[var(--on-green)]`}
          >
            SG
          </div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--green)]">
            Guru Analysis
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--txt-muted)]">
          {badge}
        </span>
      </div>
      <p className="mt-3 text-[14px] leading-[1.7] text-[var(--txt-2)]">
        {renderBold(response.response_text ?? "")}
      </p>
    </article>
  );
}
