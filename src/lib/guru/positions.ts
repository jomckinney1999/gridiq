import type { GuruPositionFilter } from "@/types/guru";

/** Map DB position strings to Guru filter pills. */
export function playerMatchesGuruFilter(dbPosition: string, filter: GuruPositionFilter): boolean {
  const p = (dbPosition || "").toUpperCase();
  if (filter === "All") return true;
  if (filter === "EDGE") {
    return ["EDGE", "LB", "OLB", "ILB", "MLB", "DE"].includes(p);
  }
  if (filter === "DT") {
    return ["DT", "NT", "DI", "IDL"].includes(p);
  }
  if (filter === "CB") {
    return ["CB", "NB"].includes(p);
  }
  return p === filter;
}
