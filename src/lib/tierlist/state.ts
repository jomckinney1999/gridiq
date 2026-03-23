import { TIER_ORDER, type TierKey, type TiersState } from "@/types/tierlist";

export function stripFromTiers(tiers: TiersState, id: string): TiersState {
  const next: TiersState = { ...tiers };
  for (const k of TIER_ORDER) {
    next[k] = next[k].filter((x) => x !== id);
  }
  return next;
}

export function movePlayer(
  playerId: string,
  target: TierKey | "pool",
  tiers: TiersState,
  poolIds: string[],
): { tiers: TiersState; poolIds: string[] } {
  const nextTiers = stripFromTiers(tiers, playerId);
  let pool = poolIds.filter((id) => id !== playerId);
  if (target === "pool") {
    pool = [...pool, playerId];
  } else {
    nextTiers[target] = [...nextTiers[target], playerId];
  }
  return { tiers: nextTiers, poolIds: pool };
}
