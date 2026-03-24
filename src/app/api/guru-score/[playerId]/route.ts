import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { blendFanScore, fanBreakdownFromRow, redditPositivePct } from "@/lib/guru/compute";
import { deriveAnalystScores } from "@/lib/guru/analysts";
import type { GuruScoreRow } from "@/types/guru";
import { TIER_ORDER, type TiersState } from "@/types/tierlist";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

function isTiersState(v: unknown): v is TiersState {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return TIER_ORDER.every((k) => Array.isArray(o[k]));
}

function tierRank(letter: string): number {
  const i = TIER_ORDER.indexOf(letter as (typeof TIER_ORDER)[number]);
  return i >= 0 ? i : 2;
}

function avgTierFromLists(tiersStates: TiersState[], playerId: string): string | null {
  const ranks: number[] = [];
  for (const t of tiersStates) {
    for (const k of TIER_ORDER) {
      if (t[k]?.includes(playerId)) {
        ranks.push(tierRank(k));
        break;
      }
    }
  }
  if (!ranks.length) return null;
  const mean = ranks.reduce((a, b) => a + b, 0) / ranks.length;
  const idx = Math.round(mean);
  return TIER_ORDER[Math.min(TIER_ORDER.length - 1, Math.max(0, idx))] ?? null;
}

async function fetchTierListAvgLabel(playerId: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("tier_lists").select("tiers").limit(120);
  if (error || !data?.length) return null;
  const states: TiersState[] = [];
  for (const row of data) {
    const raw = row.tiers;
    if (isTiersState(raw)) states.push(raw);
  }
  return avgTierFromLists(states, playerId);
}

const MOCK_BY_NAME: Record<string, Partial<GuruScoreRow> & { position: string; team: string }> = {
  "jayden daniels": {
    player_name: "Jayden Daniels",
    position: "QB",
    team: "WSH",
    overall_score: 84,
    expert_score: 86,
    fan_score: 81,
    pff_grade: 82.4,
    espn_qbr: 68.2,
    analyst_consensus: 85,
    stats_score: 87,
    reddit_sentiment: 0.42,
    fantasy_adp_score: 14,
    tier_list_avg: "A",
    social_buzz_pct: 71,
    user_rating: 4.2,
    score_change_week: 3.2,
    score_direction: "up",
    freshness_label: "🍅 Certified Fresh",
  },
  "ceedee lamb": {
    player_name: "CeeDee Lamb",
    position: "WR",
    team: "DAL",
    overall_score: 91,
    expert_score: 92,
    fan_score: 89,
    pff_grade: 91.0,
    espn_qbr: null,
    analyst_consensus: 93,
    stats_score: 90,
    reddit_sentiment: 0.35,
    fantasy_adp_score: 6,
    tier_list_avg: "S",
    social_buzz_pct: 88,
    user_rating: 4.6,
    score_change_week: -1.1,
    score_direction: "down",
    freshness_label: "Fresh",
  },
  "saquon barkley": {
    player_name: "Saquon Barkley",
    position: "RB",
    team: "PHI",
    overall_score: 88,
    expert_score: 87,
    fan_score: 90,
    pff_grade: 86.0,
    espn_qbr: null,
    analyst_consensus: 88,
    stats_score: 86,
    reddit_sentiment: 0.55,
    fantasy_adp_score: 8,
    tier_list_avg: "A",
    social_buzz_pct: 79,
    user_rating: 4.5,
    score_change_week: 0.4,
    score_direction: "neutral",
    freshness_label: "🍅 Certified Fresh",
  },
  "rueben bain": {
    player_name: "Rueben Bain",
    position: "EDGE",
    team: "MIA",
    overall_score: 71,
    expert_score: 69,
    fan_score: 74,
    pff_grade: 72.0,
    espn_qbr: null,
    analyst_consensus: 68,
    stats_score: 70,
    reddit_sentiment: 0.12,
    fantasy_adp_score: 32,
    tier_list_avg: "B",
    social_buzz_pct: 54,
    user_rating: 3.8,
    score_change_week: 5.8,
    score_direction: "up",
    freshness_label: "Rising",
  },
  "patrick mahomes": {
    player_name: "Patrick Mahomes",
    position: "QB",
    team: "KC",
    overall_score: 94,
    expert_score: 95,
    fan_score: 92,
    pff_grade: 88.0,
    espn_qbr: 72.1,
    analyst_consensus: 96,
    stats_score: 94,
    reddit_sentiment: 0.48,
    fantasy_adp_score: 3,
    tier_list_avg: "S",
    social_buzz_pct: 92,
    user_rating: 4.8,
    score_change_week: -0.6,
    score_direction: "down",
    freshness_label: "🍅 Certified Fresh",
  },
};

function buildMockRow(
  playerId: string,
  name: string,
  position: string,
  team: string,
): GuruScoreRow {
  const key = name.toLowerCase();
  const m = MOCK_BY_NAME[key];
  const base = m ?? {
    player_name: name,
    overall_score: 78,
    expert_score: 77,
    fan_score: 79,
    pff_grade: 75.0,
    espn_qbr: 62.0,
    analyst_consensus: 76,
    stats_score: 78,
    reddit_sentiment: 0.2,
    fantasy_adp_score: 24,
    tier_list_avg: "B",
    social_buzz_pct: 60,
    user_rating: 4.0,
    score_change_week: 0.5,
    score_direction: "neutral",
    freshness_label: "Fresh",
  };
  return {
    id: "mock",
    player_id: playerId,
    player_name: base.player_name ?? name,
    week: 14,
    season: 2024,
    game_date: new Date().toISOString().slice(0, 10),
    overall_score: base.overall_score ?? 78,
    expert_score: base.expert_score ?? 77,
    fan_score: base.fan_score ?? 79,
    pff_grade: base.pff_grade ?? null,
    espn_qbr: base.espn_qbr ?? null,
    analyst_consensus: base.analyst_consensus ?? null,
    stats_score: base.stats_score ?? null,
    reddit_sentiment: base.reddit_sentiment ?? null,
    fantasy_adp_score: base.fantasy_adp_score ?? null,
    tier_list_avg: base.tier_list_avg ?? null,
    social_buzz_pct: base.social_buzz_pct ?? null,
    user_rating: base.user_rating ?? null,
    score_change_week: base.score_change_week ?? null,
    score_direction: base.score_direction ?? "neutral",
    freshness_label: base.freshness_label ?? "Fresh",
    created_at: new Date().toISOString(),
  };
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ playerId: string }> },
) {
  const { playerId } = await ctx.params;

  if (!supabase) {
    const row = buildMockRow(playerId, "Demo Player", "QB", "NFL");
    const history = buildMockHistory(playerId, row.player_name, row);
    return NextResponse.json(
      packagePayload(row, { id: playerId, name: row.player_name, position: "QB", team: "NFL" }, history, [], {
        avg: 4.2,
        count: 128,
        redditPct: 62,
        buzzChangePct: 4.5,
        mentionCount: 24,
        tierLabel: row.tier_list_avg,
        fantasyAdpRank: row.fantasy_adp_score,
      }),
    );
  }

  const { data: player, error: pErr } = await supabase
    .from("players")
    .select("id, name, position, team")
    .eq("id", playerId)
    .maybeSingle();

  if (pErr || !player) {
    const row = buildMockRow(playerId, "Player", "—", "—");
    const hist = buildMockHistory(playerId, row.player_name, row);
    return NextResponse.json(
      packagePayload(
        row,
        { id: playerId, name: row.player_name, position: "—", team: "—" },
        hist,
        [],
        {
          avg: 4.0,
          count: 0,
          redditPct: 55,
          buzzChangePct: 0,
          mentionCount: 0,
          tierLabel: row.tier_list_avg,
          fantasyAdpRank: row.fantasy_adp_score,
        },
      ),
    );
  }

  const { data: scoreRow } = await supabase
    .from("guru_scores")
    .select("*")
    .eq("player_id", playerId)
    .order("game_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const score: GuruScoreRow = scoreRow
    ? (scoreRow as GuruScoreRow)
    : buildMockRow(playerId, player.name, player.position, player.team);

  const { data: histRaw } = await supabase
    .from("guru_score_history")
    .select("score_date, overall_score, expert_score, fan_score")
    .eq("player_id", playerId)
    .order("score_date", { ascending: true })
    .limit(52);

  let historyPoints: HistoryRow[] = (histRaw ?? []) as HistoryRow[];
  if (!historyPoints.length) {
    historyPoints = buildMockHistory(playerId, player.name, score);
  }

  const { data: ratingsAgg } = await supabase
    .from("user_player_ratings")
    .select("rating")
    .eq("player_id", playerId);

  const ratings = ratingsAgg ?? [];
  const count = ratings.length;
  const avg = count ? ratings.reduce((s, r) => s + (r.rating ?? 0), 0) / count : null;

  const { data: news } = await supabase
    .from("news_feed")
    .select("sentiment, source_type, published_at, headline")
    .order("published_at", { ascending: false })
    .limit(200);

  const name = player.name;
  const filtered =
    news?.filter((n) => {
      const h = (n.headline || "").toLowerCase();
      return h.includes(name.toLowerCase().split(" ").pop() ?? "") || h.includes(name.toLowerCase());
    }) ?? [];

  const redditPct = redditPositivePct(filtered as { sentiment: string | null; source_type: string | null }[]);

  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const recent = filtered.filter((n) => {
    const t = n.published_at ? new Date(n.published_at).getTime() : 0;
    return now - t < weekMs;
  }).length;
  const older = filtered.filter((n) => {
    const t = n.published_at ? new Date(n.published_at).getTime() : 0;
    return now - t >= weekMs && now - t < 2 * weekMs;
  }).length;
  const buzzChangePct = older > 0 ? Math.round(((recent - older) / older) * 100) : recent > 0 ? 100 : 0;

  const tierLabel = (await fetchTierListAvgLabel(playerId)) ?? score.tier_list_avg;

  const payload = packagePayload(
    score,
    {
      id: player.id,
      name: player.name,
      position: player.position,
      team: player.team,
    },
    historyPoints,
    filtered as NewsRow[],
    {
      avg,
      count,
      redditPct,
      buzzChangePct,
      mentionCount: filtered.length,
      tierLabel,
      fantasyAdpRank: score.fantasy_adp_score,
    },
  );

  return NextResponse.json(payload);
}

type HistoryRow = {
  score_date: string;
  overall_score: number | null;
  expert_score: number | null;
  fan_score: number | null;
};

type NewsRow = { sentiment: string | null; source_type: string | null };

function buildMockHistory(playerId: string, playerName: string, latest: GuruScoreRow): HistoryRow[] {
  const weeks = 12;
  const out: HistoryRow[] = [];
  let o = (latest.overall_score ?? 80) - 8;
  let e = (latest.expert_score ?? 80) - 6;
  let f = (latest.fan_score ?? 80) - 5;
  for (let i = 0; i < weeks; i++) {
    o += Math.sin(i * 0.7) * 1.2 + 0.6;
    e += Math.cos(i * 0.5) * 0.9;
    f += Math.sin(i * 0.4) * 1.1;
    const d = new Date();
    d.setDate(d.getDate() - (weeks - i) * 7);
    out.push({
      score_date: d.toISOString().slice(0, 10),
      overall_score: Math.round(Math.min(100, Math.max(50, o))),
      expert_score: Math.round(Math.min(100, Math.max(50, e))),
      fan_score: Math.round(Math.min(100, Math.max(50, f))),
    });
  }
  void playerId;
  void playerName;
  out[out.length - 1] = {
    score_date: out[out.length - 1].score_date,
    overall_score: latest.overall_score ?? out[out.length - 1].overall_score,
    expert_score: latest.expert_score ?? out[out.length - 1].expert_score,
    fan_score: latest.fan_score ?? out[out.length - 1].fan_score,
  };
  return out;
}

function packagePayload(
  score: GuruScoreRow,
  player: { id: string; name: string; position: string; team: string },
  history: HistoryRow[],
  news: NewsRow[],
  extras: {
    avg: number | null;
    count: number;
    redditPct: number;
    buzzChangePct: number;
    mentionCount: number;
    tierLabel: string | null;
    fantasyAdpRank: number | null;
  },
) {
  const userAvg = extras.avg;
  const ratingCount = extras.count;
  const computedFan = blendFanScore(score.fan_score, userAvg, ratingCount);

  const fb = fanBreakdownFromRow(score, {
    redditPct: extras.redditPct,
    userAvg,
    ratingCount,
  });

  const analystRows = deriveAnalystScores({
    expertScore: score.expert_score ?? 75,
    pffGrade: score.pff_grade,
    espnQbr: score.espn_qbr,
    analystConsensus: score.analyst_consensus,
    statsScore: score.stats_score,
  });

  return {
    score: { ...score, fan_score: computedFan },
    rawFanScore: score.fan_score,
    computedFanScore: computedFan,
    player,
    history: history.map((h) => ({
      score_date: h.score_date,
      overall_score: h.overall_score,
      expert_score: h.expert_score,
      fan_score: h.fan_score,
    })),
    ratings: { average: userAvg, count: ratingCount },
    news: {
      sampleCount: news.length,
      redditPositivePct: extras.redditPct,
      mentionCount: extras.mentionCount,
      buzzChangePct: extras.buzzChangePct,
    },
    fanSignals: {
      redditPositivePct: fb.reddit,
      fantasyAdpRank: extras.fantasyAdpRank ?? score.fantasy_adp_score,
      tierListAvg: extras.tierLabel ?? score.tier_list_avg,
      socialBuzzPct: fb.socialBuzz,
      userRatingAvg: userAvg,
      userRatingCount: ratingCount,
      stockDeltaWeek: score.score_change_week ?? 0,
    },
    fanBreakdown: fb,
    analystRows,
  };
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await ctx.params;

  if (!supabase) {
    return NextResponse.json({ ok: true, computedFanScore: 80, ratings: { average: 4, count: 1 } });
  }

  let body: { rating?: number; sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rating = body.rating;
  const sessionId = body.sessionId?.trim();
  if (typeof rating !== "number" || rating < 1 || rating > 5 || !sessionId) {
    return NextResponse.json({ error: "rating (1–5) and sessionId required" }, { status: 400 });
  }

  const { error: upErr } = await supabase.from("user_player_ratings").upsert(
    {
      player_id: playerId,
      session_id: sessionId,
      rating: Math.round(rating),
    },
    { onConflict: "player_id,session_id" },
  );

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const { data: ratingsAgg } = await supabase
    .from("user_player_ratings")
    .select("rating")
    .eq("player_id", playerId);

  const ratings = ratingsAgg ?? [];
  const count = ratings.length;
  const avg = count ? ratings.reduce((s, r) => s + (r.rating ?? 0), 0) / count : null;

  const { data: scoreRow } = await supabase
    .from("guru_scores")
    .select("fan_score")
    .eq("player_id", playerId)
    .order("game_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const baseFan = scoreRow?.fan_score ?? null;
  const computedFan = blendFanScore(baseFan, avg, count);

  const { data: latestGuru } = await supabase
    .from("guru_scores")
    .select("id")
    .eq("player_id", playerId)
    .order("game_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestGuru?.id) {
    await supabase
      .from("guru_scores")
      .update({ fan_score: computedFan, user_rating: avg })
      .eq("id", latestGuru.id);
  }

  return NextResponse.json({
    ok: true,
    computedFanScore: computedFan,
    ratings: { average: avg, count },
  });
}
