"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ConsensusRankingPayload } from "@/types/consensus";

function rankAccent(rank: number): string {
  if (rank <= 3) return "#00a854";
  if (rank <= 10) return "#1a6fd4";
  if (rank <= 20) return "#d44a00";
  return "#9a9a9a";
}

function barFillPercent(rank: number, total: number): number {
  if (total <= 1) return 100;
  return ((total - rank + 1) / total) * 100;
}

type TimelinePoint = {
  x: number;
  y: number;
  rank: number;
  label: string;
  date: string;
  expertRank: number;
  fanRank: number;
};

function RankingTimeline({
  points,
  total,
}: {
  points: { date: string; label: string; avgRank: number; expertRank: number; fanRank: number }[];
  total: number;
}) {
  const w = 640;
  const h = 200;

  const layout = useMemo(() => {
    const padX = 36;
    const padY = 28;
    const innerW = w - padX * 2;
    const innerH = h - padY * 2;
    if (!points.length) return { pts: [] as TimelinePoint[], segments: [] as { path: string; color: string }[], padX, padY, innerH, innerW };
    const n = points.length;
    const maxR = Math.max(total, ...points.map((p) => Math.max(p.avgRank, p.expertRank, p.fanRank)));
    const minR = 1;

    const pts: TimelinePoint[] = points.map((p, i) => {
      const x = padX + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
      const norm = (p.avgRank - minR) / Math.max(1, maxR - minR);
      const y = padY + norm * innerH;
      return { x, y, rank: p.avgRank, label: p.label, date: p.date, expertRank: p.expertRank, fanRank: p.fanRank };
    });

    const segments: { path: string; color: string }[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i]!;
      const b = pts[i + 1]!;
      const path = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
      const prev = points[i]!.avgRank;
      const next = points[i + 1]!.avgRank;
      let color = "#9ca3af";
      if (next < prev) color = "#00a854";
      else if (next > prev) color = "#dc2626";
      segments.push({ path, color });
    }

    return { pts, segments, padX, padY, innerH, innerW };
  }, [points, total, w, h]);

  if (!points.length) {
    return <p className="text-[13px] text-[var(--txt-muted)]">No timeline data yet.</p>;
  }

  const { pts, segments, padX, padY, innerH, innerW } = layout;

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full min-w-[320px]" preserveAspectRatio="xMidYMid meet">
        <line x1={padX} y1={padY + innerH} x2={padX + innerW} y2={padY + innerH} stroke="var(--border-md)" strokeWidth={1} />
        {segments.map((s, i) => (
          <path key={i} d={s.path} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" />
        ))}
        {pts.map((p, i) => {
          const r = 8 + ((total - p.rank) / Math.max(1, total)) * 10;
          const tipText = `${p.label} · avg #${p.rank} · experts #${p.expertRank} · fans #${p.fanRank}`;
          return (
            <g key={i}>
              <title>{tipText}</title>
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill="var(--bg-card)"
                stroke={rankAccent(p.rank)}
                strokeWidth={2}
                className="cursor-default"
              />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fill="var(--txt)" fontSize={10} fontWeight="900">
                #{p.rank}
              </text>
              <text x={p.x} y={h - 6} textAnchor="middle" fill="var(--txt-muted)" style={{ fontSize: 9 }}>
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export type ConsensusRankingProps = ConsensusRankingPayload;

export function ConsensusRanking({
  playerName,
  position,
  positionLabel,
  avgRankDisplay,
  currentRankings,
  historicalRanks,
  positionPercentile,
  historicalPeerPct,
}: ConsensusRankingProps) {
  const displayRank = avgRankDisplay != null ? Math.round(avgRankDisplay) : null;
  const accent = displayRank != null ? rankAccent(displayRank) : "#9a9a9a";
  const totalForPos = currentRankings[0]?.total ?? 32;
  const posShort = position.trim().toUpperCase();

  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-5 sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--txt-muted)]">Where experts rank him</p>

      <div className="mt-4 flex flex-col gap-8">
        <div>
          <div className="flex flex-wrap items-end gap-2">
            <span className="font-black tabular-nums leading-none" style={{ color: accent, fontSize: "48px" }}>
              {posShort} #{displayRank ?? "—"}
            </span>
          </div>
          <p className="mt-1 text-[13px] text-[var(--txt-2)]">
            of {totalForPos} {positionLabel} ranked
            {playerName ? <span className="text-[var(--txt-muted)]"> · {playerName}</span> : null}
          </p>

          <div className="mt-6 overflow-hidden rounded-lg border border-[var(--border)]">
            <table className="w-full text-left text-[13px]">
              <tbody>
                {currentRankings.map((row) => {
                  const pct = barFillPercent(row.rank, row.total);
                  const c = rankAccent(row.rank);
                  return (
                    <tr key={row.source} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-3 py-2.5 font-bold text-[var(--txt)]">
                        {row.url ? (
                          <Link href={row.url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--green)] hover:underline">
                            {row.source}
                          </Link>
                        ) : (
                          row.source
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right font-black tabular-nums" style={{ color: c }}>
                        #{row.rank}
                      </td>
                      <td className="min-w-[120px] px-3 py-2.5">
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--bg-subtle-2)]">
                          <div
                            className="absolute right-0 top-0 h-full rounded-full opacity-90"
                            style={{ width: `${pct}%`, backgroundColor: c }}
                          />
                        </div>
                        <p className="mt-1 text-[9px] text-[var(--txt-muted)]">as of {row.asOf}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-bold text-[var(--txt)]">How his stock has moved</h3>
          <p className="mt-1 text-[12px] text-[var(--txt-muted)]">Milestones across the season — line moves up when rank improves.</p>
          <div className="mt-4">
            <RankingTimeline points={historicalRanks} total={totalForPos} />
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-bold text-[var(--txt)]">Position group context</h3>
          <p className="mt-2 text-[13px] text-[var(--txt-2)]">
            Among active {positionLabel} in 2024:
          </p>
          <div className="relative mt-3 h-3 w-full rounded-full bg-[var(--bg-subtle-2)]">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#00a854]"
              style={{ width: `${positionPercentile}%` }}
            />
            {[25, 50, 75, 90].map((pct) => (
              <div
                key={pct}
                className="absolute top-0 h-full w-px bg-[var(--border-md)]"
                style={{ left: `${pct}%` }}
                title={`${pct}th percentile`}
              />
            ))}
          </div>
          <div className="relative mt-1 h-4 w-full">
            {([25, 50, 75, 90] as const).map((pct) => (
              <span
                key={pct}
                className="absolute text-[9px] font-semibold text-[var(--txt-muted)]"
                style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
              >
                {pct}th
              </span>
            ))}
          </div>
          <p className="mt-8 text-[13px] text-[var(--txt-2)]">Compared to historical averages:</p>
          <p className="mt-2 text-[14px] font-bold text-[var(--txt)]">
            Higher ranked than{" "}
            <span className="text-[var(--green)]">{historicalPeerPct}%</span> of {positionLabel} in this week of a season historically.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ConsensusRankingLoader({ playerId }: { playerId: string }) {
  const [data, setData] = useState<ConsensusRankingPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(false);
    fetch(`/api/consensus-ranking/${playerId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: ConsensusRankingPayload) => {
        if (!cancelled) setData(j);
      })
      .catch(() => {
        if (!cancelled) setErr(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [playerId]);

  if (loading || (!data && !err)) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <div className="h-40 animate-pulse rounded-lg bg-[var(--bg-subtle-2)]" />
        <p className="mt-3 text-center text-[12px] text-[var(--txt-muted)]">Loading consensus…</p>
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center text-[13px] text-[var(--txt-muted)]">
        Could not load consensus rankings.
      </div>
    );
  }

  return <ConsensusRanking {...data} />;
}
