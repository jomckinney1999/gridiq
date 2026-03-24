"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { GuruListPlayer } from "@/types/guru";

function scoreHue(score: number): string {
  if (score >= 85) return "var(--green)";
  if (score >= 72) return "var(--blue)";
  if (score >= 60) return "var(--orange)";
  return "var(--red-accent)";
}

type GuruScoreCardProps = {
  player: GuruListPlayer;
  /** Compact layout for embedding in articles or sidebars. */
  embed?: boolean;
  className?: string;
};

export function GuruScoreCard({ player, embed, className }: GuruScoreCardProps) {
  const change = player.scoreChangeWeek ?? 0;
  const up = player.scoreDirection === "up" || (player.scoreDirection === "neutral" && change > 0.05);
  const down = player.scoreDirection === "down" || (player.scoreDirection === "neutral" && change < -0.05);

  const content = (
    <article
      className={cn(
        "group flex flex-col rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-sm)] transition hover:border-[var(--green-border)] hover:shadow-[var(--shadow-md)]",
        embed && "p-3",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3
            className={cn(
              "truncate font-bold text-[var(--txt)]",
              embed ? "text-[14px]" : "text-[16px]",
            )}
          >
            {player.name}
          </h3>
          <p className="mt-0.5 text-[12px] font-medium text-[var(--txt-2)]">
            {player.position} · {player.team}
          </p>
        </div>
        <div
          className="shrink-0 text-right font-black tabular-nums leading-none"
          style={{
            color: scoreHue(player.overallScore),
            fontSize: embed ? "28px" : "36px",
          }}
        >
          {Math.round(player.overallScore)}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-[var(--blue)]">
            <span>Expert</span>
            <span>{Math.round(player.expertScore)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-subtle-2)]">
            <div
              className="h-full rounded-full bg-[var(--blue)] transition-all"
              style={{ width: `${Math.min(100, player.expertScore)}%` }}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-[var(--orange)]">
            <span>Fan</span>
            <span>{Math.round(player.fanScore)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-subtle-2)]">
            <div
              className="h-full rounded-full bg-[var(--orange)] transition-all"
              style={{ width: `${Math.min(100, player.fanScore)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
            up && "bg-[var(--green-light)] text-[var(--green)]",
            down && "bg-[color-mix(in_srgb,var(--red-accent)_12%,transparent)] text-[var(--red-accent)]",
            !up && !down && "bg-[var(--bg-subtle)] text-[var(--txt-2)]",
          )}
        >
          {up ? "↑" : down ? "↓" : "→"}{" "}
          {change > 0 ? "+" : ""}
          {change.toFixed(1)}%
        </span>
        <span className="text-[11px] font-medium text-[var(--txt-muted)]">{player.freshnessLabel}</span>
      </div>
    </article>
  );

  if (embed) {
    return content;
  }

  return (
    <Link href={`/guru-score/${player.playerId}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]">
      {content}
    </Link>
  );
}

/** Fetches Guru data and renders a compact card for embedding in articles or tools. */
export function GuruScoreEmbed({ playerId }: { playerId: string }) {
  const [player, setPlayer] = useState<GuruListPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/guru-score/${playerId}`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled || j?.error || !j?.score || !j?.player) return;
        const s = j.score;
        const p = j.player;
        setPlayer({
          playerId: p.id,
          name: p.name,
          position: p.position ?? "—",
          team: p.team ?? "—",
          overallScore: s.overall_score ?? 0,
          expertScore: s.expert_score ?? 0,
          fanScore: s.fan_score ?? 0,
          scoreChangeWeek: s.score_change_week ?? 0,
          scoreDirection: s.score_direction ?? "neutral",
          freshnessLabel: s.freshness_label ?? "Fresh",
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [playerId]);

  if (!player) {
    return (
      <div
        className="h-[140px] animate-pulse rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-subtle)]"
        aria-hidden
      />
    );
  }

  return <GuruScoreCard player={player} embed />;
}
