import type { PositionFilter, TierKey, TierListPlayer, TiersState } from "@/types/tierlist";
import { emptyTiers } from "@/types/tierlist";
import { findPlayerForName } from "@/lib/tierlist/match-player";

export type TierListPreset = {
  id: string;
  label: string;
  title: string;
  position_filter: PositionFilter;
  /** Ordered names per tier; matched against current player pool */
  names: Record<TierKey, string[]>;
};

export const TIERLIST_PRESETS: TierListPreset[] = [
  {
    id: "season-2024",
    label: "2024 Season Rankings",
    title: "2024 Season Rankings",
    position_filter: "QB",
    names: {
      S: ["Patrick Mahomes", "Josh Allen", "Lamar Jackson"],
      A: ["Joe Burrow", "Jalen Hurts", "Jayden Daniels", "C.J. Stroud"],
      B: ["Jordan Love", "Dak Prescott", "Brock Purdy", "Jared Goff", "Matthew Stafford"],
      C: ["Tua Tagovailoa", "Justin Herbert", "Kyler Murray", "Bo Nix", "Aaron Rodgers"],
      D: ["Caleb Williams", "Drake Maye", "Anthony Richardson", "Justin Fields", "Baker Mayfield"],
    },
  },
  {
    id: "dynasty",
    label: "Dynasty Rankings",
    title: "Dynasty QB Rankings",
    position_filter: "QB",
    names: {
      S: ["Patrick Mahomes", "Josh Allen", "Joe Burrow", "Lamar Jackson"],
      A: ["C.J. Stroud", "Jayden Daniels", "Justin Herbert", "Jalen Hurts"],
      B: ["Jordan Love", "Drake Maye", "Caleb Williams", "Bo Nix", "Tua Tagovailoa"],
      C: ["Brock Purdy", "Dak Prescott", "Anthony Richardson", "Kyler Murray", "Justin Fields"],
      D: ["Baker Mayfield", "Jared Goff", "Will Levis", "Michael Penix", "Sam Darnold"],
    },
  },
  {
    id: "fantasy-2025",
    label: "Fantasy 2025 Projections",
    title: "Fantasy 2025 — WR",
    position_filter: "WR",
    names: {
      S: ["CeeDee Lamb", "Justin Jefferson", "Ja'Marr Chase", "Tyreek Hill"],
      A: ["Davante Adams", "Amon-Ra St. Brown", "Puka Nacua", "Garrett Wilson", "Malik Nabers"],
      B: ["Jaylen Waddle", "Mike Evans", "DJ Moore", "DeVonta Smith", "Stefon Diggs", "Nico Collins"],
      C: ["Chris Godwin", "DK Metcalf", "Terry McLaurin", "Brandon Aiyuk", "Deebo Samuel", "Cooper Kupp"],
      D: ["Calvin Ridley", "Keenan Allen", "Courtland Sutton", "Drake London", "Zay Flowers", "Marvin Harrison"],
    },
  },
];

export function applyPresetToState(
  preset: TierListPreset,
  pool: TierListPlayer[],
): { tiers: TiersState; unrankedIds: string[] } {
  const tiers = emptyTiers();
  const used = new Set<string>();

  (["S", "A", "B", "C", "D"] as TierKey[]).forEach((key) => {
    for (const raw of preset.names[key]) {
      const p = findPlayerForName(raw, pool);
      if (p && !used.has(p.id)) {
        tiers[key].push(p.id);
        used.add(p.id);
      }
    }
  });

  const unrankedIds = pool.filter((p) => !used.has(p.id)).map((p) => p.id);
  return { tiers, unrankedIds };
}
