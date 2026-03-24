"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnalystRow } from "@/components/guru/AnalystRow";
import { ConsensusRanking } from "@/components/guru/ConsensusRanking";
import { FanSignals } from "@/components/guru/FanSignals";
import { ScoreBreakdown } from "@/components/guru/ScoreBreakdown";
import { StockChart, type StockHistoryPoint } from "@/components/guru/StockChart";
import { getGuruSessionId } from "@/lib/guru/session";
import { cn } from "@/lib/utils";
import type { ConsensusRankingPayload } from "@/types/consensus";

type DetailPayload = {
  score: {
    overall_score: number | null;
    expert_score: number | null;
    fan_score: number | null;
    pff_grade: number | null;
    espn_qbr: number | null;
    analyst_consensus: number | null;
    stats_score: number | null;
    score_change_week: number | null;
    score_direction: string | null;
    freshness_label: string | null;
    tier_list_avg: string | null;
    fantasy_adp_score: number | null;
  };
  player: { id: string; name: string; position: string; team: string };
  history: StockHistoryPoint[];
  ratings: { average: number | null; count: number };
  fanSignals: {
    redditPositivePct: number;
    fantasyAdpRank: number | null;
    tierListAvg: string | null;
    socialBuzzPct: number;
    userRatingAvg: number | null;
    userRatingCount: number;
    stockDeltaWeek: number;
  };
  fanBreakdown: {
    reddit: number;
    fantasyAdp: number;
    tierList: number;
    socialBuzz: number;
  };
  analystRows: {
    name: string;
    org: string;
    initials: string;
    color: string;
    score: number;
    label: string;
  }[];
};

function initials(name: string): string {
  const p = name.split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0]!.slice(0, 2).toUpperCase();
  return (p[0]![0] + p[p.length - 1]![0]).toUpperCase();
}

function scoreColor(n: number): string {
  if (n >= 85) return "var(--green)";
  if (n >= 72) return "var(--blue)";
  if (n >= 60) return "var(--orange)";
  return "var(--red-accent)";
}

export default function GuruScorePlayerPage() {
  const params = useParams();
  const playerId = params.playerId as string;
  const [data, setData] = useState<DetailPayload | null>(null);
  const [consensus, setConsensus] = useState<ConsensusRankingPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [starsHover, setStarsHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, consRes] = await Promise.all([
        fetch(`/api/guru-score/${playerId}`),
        fetch(`/api/consensus-ranking/${playerId}`),
      ]);
      const j = await res.json();
      if (!res.ok) {
        setData(null);
        setConsensus(null);
        return;
      }
      setData(j as DetailPayload);
      if (consRes.ok) {
        const c = (await consRes.json()) as ConsensusRankingPayload;
        setConsensus(c);
      } else {
        setConsensus(null);
      }
    } catch {
      setData(null);
      setConsensus(null);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    load();
  }, [load]);

  const expertBars = useMemo(() => {
    const s = data?.score;
    if (!s) return [];
    const pff = s.pff_grade != null ? Math.min(100, Math.max(0, s.pff_grade)) : 72;
    const qbr = s.espn_qbr != null ? Math.min(100, Math.max(0, s.espn_qbr)) : 68;
    const cons = s.analyst_consensus != null ? Math.min(100, Math.max(0, s.analyst_consensus)) : 75;
    const st = s.stats_score != null ? Math.min(100, Math.max(0, s.stats_score)) : 74;
    return [
      { label: "PFF Grade", value: pff, display: s.pff_grade != null ? s.pff_grade.toFixed(1) : "—" },
      { label: "ESPN QBR", value: qbr, display: s.espn_qbr != null ? s.espn_qbr.toFixed(1) : "—" },
      { label: "Analyst consensus", value: cons, display: cons != null ? `${Math.round(cons)}` : "—" },
      { label: "Stats score", value: st, display: st != null ? `${Math.round(st)}` : "—" },
    ];
  }, [data]);

  const fanBars = useMemo(() => {
    const fb = data?.fanBreakdown;
    const s = data?.score;
    if (!fb || !s) return [];
    const tier = s.tier_list_avg ?? "B";
    return [
      { label: "Reddit sentiment", value: fb.reddit, display: `${fb.reddit}% pos.` },
      {
        label: "Fantasy ADP score",
        value: fb.fantasyAdp,
        display: s.fantasy_adp_score != null ? `ADP ${s.fantasy_adp_score}` : "—",
      },
      { label: "Tier list average", value: fb.tierList, display: tier },
      { label: "Social buzz", value: fb.socialBuzz, display: `${fb.socialBuzz}%` },
    ];
  }, [data]);

  const signalCards = useMemo(() => {
    const fs = data?.fanSignals;
    if (!fs) return [];
    return [
      { title: "Reddit positive %", value: `${fs.redditPositivePct}%`, hint: "From news_feed sentiment" },
      {
        title: "Fantasy ADP",
        value: fs.fantasyAdpRank != null ? `#${fs.fantasyAdpRank}` : "—",
        hint: "Sleeper-style rank snapshot",
      },
      { title: "Tier list average", value: fs.tierListAvg ?? "—", hint: "From tier_lists community data" },
      {
        title: "Social buzz",
        value: `${fs.socialBuzzPct}%`,
        hint: "Mentions vs prior window",
      },
      {
        title: "User rating",
        value: fs.userRatingAvg != null ? `${fs.userRatingAvg.toFixed(1)} / 5` : "—",
        hint: `${fs.userRatingCount} ratings`,
      },
      {
        title: "Stock Δ this week",
        value: `${fs.stockDeltaWeek > 0 ? "+" : ""}${(fs.stockDeltaWeek ?? 0).toFixed(1)}`,
        hint: "Composite Guru momentum",
      },
    ];
  }, [data]);

  async function submitRating(rating: number) {
    setSubmitting(true);
    try {
      const sessionId = getGuruSessionId();
      const res = await fetch(`/api/guru-score/${playerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, sessionId }),
      });
      const j = await res.json();
      if (j.ok) await load();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1000px] px-4 py-16 text-center text-[var(--txt-muted)]">
        Loading Guru Score…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-[1000px] px-4 py-16 text-center">
        <p className="text-[var(--txt)]">Could not load this player.</p>
        <Link href="/guru-score" className="mt-4 inline-block text-[var(--green)] font-semibold hover:underline">
          ← Back to Guru Score
        </Link>
      </div>
    );
  }

  const s = data.score;
  const p = data.player;
  const overall = Math.round(s.overall_score ?? 0);
  const change = s.score_change_week ?? 0;
  const up = s.score_direction === "up" || change > 0;
  const down = s.score_direction === "down" || change < 0;

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 py-8 sm:px-6">
      <Link href="/guru-score" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
        ← Guru Stock Tracker
      </Link>

      <header className="mt-6 flex flex-col gap-6 border-b border-[var(--border)] pb-8 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="grid h-24 w-24 place-items-center rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--green-light)] to-[var(--blue-light)] text-[22px] font-black text-[var(--txt)] [image-rendering:pixelated]">
            {initials(p.name)}
          </div>
          <div>
            <h1 className="text-[clamp(26px,4vw,40px)] font-black tracking-tight text-[var(--txt)]">{p.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[var(--border-md)] bg-[var(--bg-card2)] px-2.5 py-0.5 text-[12px] font-bold text-[var(--txt)]">
                {p.position}
              </span>
              {consensus?.avgRankDisplay != null ? (
                <span className="rounded-full border border-[var(--border-md)] bg-[var(--bg-card2)] px-2.5 py-0.5 text-[12px] font-bold tabular-nums text-[var(--txt)]">
                  {p.position} #{Math.round(consensus.avgRankDisplay)} avg
                </span>
              ) : null}
              <span className="text-[14px] font-semibold text-[var(--txt-2)]">{p.team}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-start gap-2 md:items-end">
          <div
            className="font-black tabular-nums leading-none"
            style={{ color: scoreColor(overall), fontSize: "52px" }}
          >
            {overall}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "text-[15px] font-bold tabular-nums",
                up && "text-[var(--green)]",
                down && "text-[var(--red-accent)]",
                !up && !down && "text-[var(--txt-2)]",
              )}
            >
              {up ? "↑" : down ? "↓" : "→"} {change > 0 ? "+" : ""}
              {change.toFixed(1)} this week
            </span>
            <span className="rounded-full border border-[var(--green-border)] bg-[var(--green-light)] px-2 py-0.5 text-[11px] font-bold text-[var(--green)]">
              {s.freshness_label ?? "Fresh"}
            </span>
          </div>
        </div>
      </header>

      <div className="mt-10">
        <ScoreBreakdown
          expertScore={s.expert_score ?? 0}
          fanScore={s.fan_score ?? 0}
          expertBars={expertBars}
          fanBars={fanBars}
        />
      </div>

      <section className="mt-12">
        <h2 className="text-[16px] font-bold text-[var(--txt)]">Stock chart</h2>
        <p className="mt-1 text-[13px] text-[var(--txt-muted)]">Expert vs fan vs composite Guru (50–100 scale).</p>
        <div className="mt-4">
          <StockChart history={data.history} />
        </div>
      </section>

      {consensus ? (
        <section className="mt-12">
          <h2 className="text-[16px] font-bold text-[var(--txt)]">Consensus rankings</h2>
          <p className="mt-1 text-[13px] text-[var(--txt-muted)]">Major outlets, fantasy ADP, and fan voting — averaged over the season.</p>
          <div className="mt-4">
            <ConsensusRanking {...consensus} />
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="text-[16px] font-bold text-[var(--txt)]">Analyst breakdown</h2>
        <p className="mt-1 text-[13px] text-[var(--txt-muted)]">
          Blended from PFF, ESPN, consensus models, and article sentiment.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {data.analystRows.map((a) => (
            <AnalystRow
              key={a.name}
              name={a.name}
              org={a.org}
              initials={a.initials}
              color={a.color}
              score={a.score}
              label={a.label}
            />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[16px] font-bold text-[var(--txt)]">Fan signals</h2>
        <FanSignals signals={signalCards} className="mt-4" />
      </section>

      <section className="mt-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <h3 className="text-[15px] font-bold text-[var(--txt)]">Rate this player</h3>
        <p className="mt-1 text-[13px] text-[var(--txt-muted)]">
          1–5 stars. Saved anonymously with your session. Average:{" "}
          <span className="font-semibold text-[var(--txt)]">
            {data.ratings.average != null ? data.ratings.average.toFixed(2) : "—"}
          </span>{" "}
          ({data.ratings.count} ratings)
        </p>
        <div className="mt-4 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => {
            const avgR = Math.round(data.ratings.average ?? 0);
            const lit = starsHover > 0 ? starsHover : avgR;
            const active = lit >= n;
            return (
              <button
                key={n}
                type="button"
                disabled={submitting}
                aria-label={`Rate ${n} stars`}
                className="text-[28px] leading-none text-[var(--txt-3)] transition hover:scale-110 disabled:opacity-50"
                onMouseEnter={() => setStarsHover(n)}
                onMouseLeave={() => setStarsHover(0)}
                onClick={() => submitRating(n)}
              >
                <span className={cn(active ? "text-[var(--orange)]" : "")}>★</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
