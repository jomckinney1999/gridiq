import type { TierListPlayer } from "@/types/tierlist";

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Find player row for a display name (exact or last-name / partial). */
export function findPlayerForName(
  displayName: string,
  pool: TierListPlayer[],
): TierListPlayer | null {
  const n = norm(displayName);
  if (!n) return null;

  for (const p of pool) {
    if (norm(p.name) === n) return p;
  }
  const parts = n.split(" ");
  const last = parts[parts.length - 1];
  for (const p of pool) {
    const pn = norm(p.name);
    if (pn === n || pn.endsWith(last) || pn.includes(n) || n.includes(pn)) return p;
  }
  for (const p of pool) {
    const lastName = norm(p.name).split(" ").pop() ?? "";
    if (last && lastName === last) return p;
  }
  return null;
}
