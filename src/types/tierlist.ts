export type TierKey = "S" | "A" | "B" | "C" | "D";

export const TIER_ORDER: TierKey[] = ["S", "A", "B", "C", "D"];

export type PositionFilter =
  | "QB"
  | "WR"
  | "RB"
  | "TE"
  | "EDGE"
  | "OL"
  | "DB"
  | "All-Time";

export const POSITION_FILTERS: PositionFilter[] = [
  "QB",
  "WR",
  "RB",
  "TE",
  "EDGE",
  "OL",
  "DB",
  "All-Time",
];

export type TierListPlayer = {
  id: string;
  name: string;
  team: string;
  position: string;
};

/** Player UUIDs per tier */
export type TiersState = Record<TierKey, string[]>;

export function emptyTiers(): TiersState {
  return { S: [], A: [], B: [], C: [], D: [] };
}

export type TierListRow = {
  id: string;
  share_id: string;
  title: string;
  position_filter: string;
  tiers: TiersState;
  created_at: string;
  views: number;
};
