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
        <strong key={i} className="font-semibold text-[#f2f2f5]">
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
    return { border: "border-l-[#ff6b2b]", avatar: "from-[#ff6b2b] to-[#ff9b5a]" };
  }
  if (intent === "general") {
    return { border: "border-l-[#3b9eff]", avatar: "from-[#3b9eff] to-[#00ff87]" };
  }
  return { border: "border-l-[#00ff87]", avatar: "from-[#00ff87] to-[#3b9eff]" };
}

export function AIResponseCard({ response }: { response: GridIQAPIResponse }) {
  const intentKey = response.intent ?? "general";
  const badge = INTENT_LABELS[intentKey] ?? intentKey.replace(/_/g, " ");
  const { border, avatar } = leftAccent(intentKey, response.response_text ?? "");

  return (
    <article
      className={`rounded-xl border-[0.5px] border-[rgba(255,255,255,0.06)] bg-[#0d0d10] p-4 ${border} border-l-2`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-md bg-gradient-to-br ${avatar} text-[8px] font-black leading-none tracking-tighter text-[#050507]`}
          >
            SG
          </div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#00ff87]">
            Guru Analysis
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#66667a]">
          {badge}
        </span>
      </div>
      <p className="mt-3 text-[14px] leading-[1.7] text-[#8888a0]">
        {renderBold(response.response_text ?? "")}
      </p>
    </article>
  );
}
