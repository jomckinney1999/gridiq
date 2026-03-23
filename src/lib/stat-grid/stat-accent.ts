/** Accent color for stat value display (fantasy / advanced flavor). */
export function statValueAccent(statLabel: string): string {
  const u = statLabel.toUpperCase();
  if (/YPRR|YAC|AIR|SEPARATION|TARGET|SNAP/.test(u)) return "var(--blue)";
  if (/EPA|QBR|COMP|PASS/.test(u)) return "var(--green)";
  if (/RUSH|REC YARDS|TD|FANTASY|SACK|PR WIN/.test(u)) return "var(--orange)";
  if (/WIN RATE|PASS RUSH/.test(u)) return "var(--purple)";
  return "var(--txt)";
}
