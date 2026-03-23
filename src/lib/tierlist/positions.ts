import type { PositionFilter } from "@/types/tierlist";

/** DB `players.position` values to include for each filter pill. */
export function dbPositionsForFilter(filter: PositionFilter): string[] {
  switch (filter) {
    case "QB":
      return ["QB"];
    case "WR":
      return ["WR"];
    case "RB":
      return ["RB"];
    case "TE":
      return ["TE"];
    case "EDGE":
      return ["DE", "LB", "OLB", "ILB", "MLB", "EDGE"];
    case "OL":
      return ["T", "OT", "G", "OG", "C", "OL", "IOL"];
    case "DB":
      return ["CB", "S", "FS", "SS", "DB"];
    case "All-Time":
      return [
        "QB",
        "WR",
        "RB",
        "TE",
        "DE",
        "LB",
        "CB",
        "S",
        "T",
        "OT",
        "G",
        "C",
      ];
    default:
      return ["QB"];
  }
}
