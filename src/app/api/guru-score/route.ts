import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { GuruListPlayer } from "@/types/guru";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

const FALLBACK_PLAYERS: GuruListPlayer[] = [
  {
    playerId: "00000000-0000-4000-8000-000000000001",
    name: "Jayden Daniels",
    position: "QB",
    team: "WSH",
    overallScore: 84,
    expertScore: 86,
    fanScore: 81,
    scoreChangeWeek: 3.2,
    scoreDirection: "up",
    freshnessLabel: "🍅 Certified Fresh",
  },
  {
    playerId: "00000000-0000-4000-8000-000000000002",
    name: "CeeDee Lamb",
    position: "WR",
    team: "DAL",
    overallScore: 91,
    expertScore: 92,
    fanScore: 89,
    scoreChangeWeek: -1.1,
    scoreDirection: "down",
    freshnessLabel: "Fresh",
  },
  {
    playerId: "00000000-0000-4000-8000-000000000003",
    name: "Saquon Barkley",
    position: "RB",
    team: "PHI",
    overallScore: 88,
    expertScore: 87,
    fanScore: 90,
    scoreChangeWeek: 0.4,
    scoreDirection: "neutral",
    freshnessLabel: "🍅 Certified Fresh",
  },
  {
    playerId: "00000000-0000-4000-8000-000000000004",
    name: "Rueben Bain",
    position: "EDGE",
    team: "MIA",
    overallScore: 71,
    expertScore: 69,
    fanScore: 74,
    scoreChangeWeek: 5.8,
    scoreDirection: "up",
    freshnessLabel: "Rising",
  },
  {
    playerId: "00000000-0000-4000-8000-000000000005",
    name: "Patrick Mahomes",
    position: "QB",
    team: "KC",
    overallScore: 94,
    expertScore: 95,
    fanScore: 92,
    scoreChangeWeek: -0.6,
    scoreDirection: "down",
    freshnessLabel: "🍅 Certified Fresh",
  },
];

type ScoreRow = {
  id: string;
  player_id: string;
  player_name: string;
  overall_score: number | null;
  expert_score: number | null;
  fan_score: number | null;
  score_change_week: number | null;
  score_direction: string | null;
  freshness_label: string | null;
  game_date: string | null;
};

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ players: FALLBACK_PLAYERS, source: "fallback" as const });
  }

  const { data, error } = await supabase
    .from("guru_scores")
    .select(
      "id, player_id, player_name, overall_score, expert_score, fan_score, score_change_week, score_direction, freshness_label, game_date",
    )
    .order("game_date", { ascending: false });

  if (error || !data?.length) {
    return NextResponse.json({
      players: FALLBACK_PLAYERS,
      source: "fallback" as const,
      error: error?.message,
    });
  }

  const rows = data as ScoreRow[];
  const ids = [...new Set(rows.map((r) => r.player_id).filter(Boolean))] as string[];
  const { data: prows } = await supabase.from("players").select("id, position, team").in("id", ids);
  const pmap = new Map((prows ?? []).map((p) => [p.id as string, p]));

  const seen = new Set<string>();
  const players: GuruListPlayer[] = [];

  for (const r of rows) {
    if (!r.player_id || seen.has(r.player_id)) continue;
    seen.add(r.player_id);
    const pl = pmap.get(r.player_id);
    const pos = pl?.position ?? "—";
    const team = pl?.team ?? "—";
    players.push({
      playerId: r.player_id,
      name: r.player_name,
      position: pos,
      team,
      overallScore: r.overall_score ?? 0,
      expertScore: r.expert_score ?? 0,
      fanScore: r.fan_score ?? 0,
      scoreChangeWeek: r.score_change_week ?? 0,
      scoreDirection: r.score_direction ?? "neutral",
      freshnessLabel: r.freshness_label ?? "Fresh",
    });
  }

  if (!players.length) {
    return NextResponse.json({ players: FALLBACK_PLAYERS, source: "fallback" as const });
  }

  return NextResponse.json({ players, source: "database" as const });
}
