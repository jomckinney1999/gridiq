export type GuruScoreRow = {
  id: string;
  player_id: string;
  player_name: string;
  week: number | null;
  season: number | null;
  game_date: string | null;
  overall_score: number | null;
  expert_score: number | null;
  fan_score: number | null;
  pff_grade: number | null;
  espn_qbr: number | null;
  analyst_consensus: number | null;
  stats_score: number | null;
  reddit_sentiment: number | null;
  fantasy_adp_score: number | null;
  tier_list_avg: string | null;
  social_buzz_pct: number | null;
  user_rating: number | null;
  score_change_week: number | null;
  score_direction: string | null;
  freshness_label: string | null;
  created_at: string | null;
};

export type GuruHistoryRow = {
  id: string;
  player_id: string;
  player_name: string;
  score_date: string;
  overall_score: number | null;
  expert_score: number | null;
  fan_score: number | null;
  created_at: string | null;
};

export type GuruListPlayer = {
  playerId: string;
  name: string;
  position: string;
  team: string;
  overallScore: number;
  expertScore: number;
  fanScore: number;
  scoreChangeWeek: number;
  scoreDirection: string;
  freshnessLabel: string;
  avatarUrl?: string | null;
};

export type GuruPositionFilter =
  | "All"
  | "QB"
  | "WR"
  | "RB"
  | "TE"
  | "EDGE"
  | "DT"
  | "CB";

export const GURU_POSITION_FILTERS: GuruPositionFilter[] = [
  "All",
  "QB",
  "WR",
  "RB",
  "TE",
  "EDGE",
  "DT",
  "CB",
];
