import type { GuruScoreRow } from "@/types/guru";
import { TIER_ORDER, type TierKey } from "@/types/tierlist";

export function sentimentToPercent(sentiment: string | null): number {
  if (!sentiment) return 50;
  const s = sentiment.toLowerCase();
  if (s.includes("positive") || s === "pos") return 78;
  if (s.includes("negative") || s === "neg") return 32;
  if (s.includes("neutral")) return 52;
  return 55;
}

export function redditPositivePct(rows: { sentiment: string | null; source_type: string | null }[]): number {
  const reddit = rows.filter((r) => (r.source_type || "").toLowerCase() === "reddit");
  if (!reddit.length) return 55;
  let sum = 0;
  for (const r of reddit) {
    sum += sentimentToPercent(r.sentiment);
  }
  return Math.round(sum / reddit.length);
}

export function tierLetterToScore(tier: string | null | undefined): number {
  if (!tier) return 72;
  const m = tier.match(/[SABCD]/i);
  const letter = (m ? m[0] : tier[0]).toUpperCase() as TierKey;
  const idx = TIER_ORDER.indexOf(letter);
  if (idx < 0) return 72;
  return 100 - idx * 18;
}

export function tierAvgLabelFromScore(score: number): string {
  if (score >= 92) return "S";
  if (score >= 78) return "A";
  if (score >= 64) return "B";
  if (score >= 50) return "C";
  return "D";
}

/** Blend stored fan score with crowd user ratings (1–5 stars → 20–100). */
export function blendFanScore(baseFan: number | null, userAvg: number | null, ratingCount: number): number {
  const base = baseFan != null && Number.isFinite(baseFan) ? baseFan : 72;
  if (userAvg == null || ratingCount === 0) return Math.round(base);
  const stars = Math.min(5, Math.max(1, userAvg));
  const crowd = stars * 20;
  const w = Math.min(0.35, 0.08 + ratingCount * 0.02);
  return Math.round(base * (1 - w) + crowd * w);
}

export function normalizeMetric01(value: number | null, min: number, max: number): number {
  if (value == null || !Number.isFinite(value)) return 0.5;
  const t = (value - min) / (max - min);
  return Math.min(1, Math.max(0, t));
}

export function fanBreakdownFromRow(
  row: GuruScoreRow,
  extras: {
    redditPct: number;
    userAvg: number | null;
    ratingCount: number;
  },
): {
  reddit: number;
  fantasyAdp: number;
  tierList: number;
  socialBuzz: number;
} {
  const redditRaw = row.reddit_sentiment;
  const reddit =
    redditRaw != null && Number.isFinite(redditRaw)
      ? Math.min(100, Math.max(0, (redditRaw + 1) * 50))
      : extras.redditPct;

  const adp = row.fantasy_adp_score;
  const fantasyAdp =
    adp != null && Number.isFinite(adp)
      ? Math.min(100, Math.max(0, 100 - Math.min(adp, 48) * 2))
      : 68;

  const tierScore = tierLetterToScore(row.tier_list_avg);
  const social = row.social_buzz_pct != null ? Math.min(100, Math.max(0, row.social_buzz_pct)) : 62;

  void extras.userAvg;
  void extras.ratingCount;

  return {
    reddit: Math.round(reddit),
    fantasyAdp: Math.round(fantasyAdp),
    tierList: Math.round(tierScore),
    socialBuzz: Math.round(social),
  };
}
