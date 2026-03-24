import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import type { ConsensusRankingPayload } from "@/types/consensus";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

function posLabel(pos: string): string {
  const p = pos.toUpperCase();
  if (p === "QB") return "QBs";
  if (p === "WR") return "WRs";
  if (p === "RB") return "RBs";
  if (p === "TE") return "TEs";
  return `${pos}s`;
}

function formatAsOf(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function mockPayload(name: string, position: string): ConsensusRankingPayload {
  const total = position.toUpperCase() === "WR" ? 80 : position.toUpperCase() === "RB" ? 48 : 32;
  const avg = 3;
  return {
    playerName: name,
    position,
    positionLabel: posLabel(position),
    avgRankDisplay: avg,
    currentRankings: [
      { source: "PFF Rankings", rank: 3, total, asOf: "Mar 20, 2025", url: "https://www.pff.com" },
      { source: "ESPN Rankings", rank: 4, total, asOf: "Mar 20, 2025" },
      { source: "NFL.com Power Rankings", rank: 3, total, asOf: "Mar 20, 2025" },
      { source: "FantasyPros Consensus", rank: 3, total, asOf: "Mar 20, 2025" },
      { source: "Sleeper ADP Rank", rank: 2, total, asOf: "Mar 20, 2025" },
      { source: "NFL Stat Guru Fan Rank", rank: 4, total, asOf: "Mar 20, 2025" },
    ],
    historicalRanks: [
      { date: "2024-08-20", label: "Preseason", avgRank: 22, expertRank: 24, fanRank: 20 },
      { date: "2024-09-29", label: "Week 4", avgRank: 18, expertRank: 20, fanRank: 17 },
      { date: "2024-10-27", label: "Week 8", avgRank: 12, expertRank: 13, fanRank: 11 },
      { date: "2024-11-24", label: "Week 12", avgRank: 7, expertRank: 8, fanRank: 6 },
      { date: "2024-12-29", label: "Week 17", avgRank: 5, expertRank: 5, fanRank: 5 },
      { date: "2025-01-12", label: "Playoffs", avgRank: 4, expertRank: 4, fanRank: 4 },
      { date: "2025-03-20", label: "Now", avgRank: 3, expertRank: 3, fanRank: 4 },
    ],
    positionPercentile: 88,
    historicalPeerPct: 76,
  };
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await ctx.params;

  if (!supabase) {
    return NextResponse.json(mockPayload("Demo Player", "QB"));
  }

  const { data: player, error: pErr } = await supabase
    .from("players")
    .select("id, name, position")
    .eq("id", playerId)
    .maybeSingle();

  if (pErr || !player) {
    return NextResponse.json(mockPayload("Player", "QB"));
  }

  const { data: rows, error } = await supabase
    .from("consensus_rankings")
    .select("*")
    .eq("player_id", playerId)
    .order("rank_date", { ascending: true });

  if (error || !rows?.length) {
    return NextResponse.json(mockPayload(player.name, player.position));
  }

  const nonTimeline = rows.filter((r) => !r.is_timeline);
  const timeline = rows.filter((r) => r.is_timeline).sort((a, b) => String(a.rank_date).localeCompare(String(b.rank_date)));

  let maxDate = "";
  for (const r of nonTimeline) {
    const d = String(r.rank_date ?? "");
    if (d > maxDate) maxDate = d;
  }
  const currentRows = nonTimeline.filter((r) => String(r.rank_date) === maxDate);

  const currentRankings = currentRows.map((r) => ({
    source: r.source as string,
    rank: r.rank_value as number,
    total: r.rank_total as number,
    url: r.source_url ?? undefined,
    asOf: formatAsOf(String(r.rank_date)),
  }));

  const historicalRanks = timeline.map((r) => ({
    date: String(r.rank_date),
    label: (r.milestone_label as string) || "—",
    avgRank: r.rank_value as number,
    expertRank: (r.expert_rank ?? r.rank_value) as number,
    fanRank: (r.fan_rank ?? r.rank_value) as number,
  }));

  const avg =
    currentRankings.length > 0
      ? currentRankings.reduce((s, x) => s + x.rank, 0) / currentRankings.length
      : null;

  const metaRow = currentRows.find((r) => r.position_percentile != null) ?? currentRows[0];
  const positionPercentile =
    typeof metaRow?.position_percentile === "number" ? metaRow.position_percentile : 50;
  const historicalPeerPct =
    typeof metaRow?.historical_peer_pct === "number" ? metaRow.historical_peer_pct : 50;

  const payload: ConsensusRankingPayload = {
    playerName: player.name,
    position: player.position,
    positionLabel: posLabel(player.position),
    avgRankDisplay: avg != null ? Math.round(avg * 10) / 10 : null,
    currentRankings,
    historicalRanks,
    positionPercentile,
    historicalPeerPct,
  };

  return NextResponse.json(payload);
}
