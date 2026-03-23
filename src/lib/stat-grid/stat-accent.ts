/** Accent color for stat value display (fantasy / advanced flavor). */
export function statValueAccent(statLabel: string): string {
  const u = statLabel.toUpperCase();
  if (/YPRR|YAC|AIR|SEPARATION|TARGET|SNAP/.test(u)) return "#3b9eff";
  if (/EPA|QBR|COMP|PASS/.test(u)) return "#00ff87";
  if (/RUSH|REC YARDS|TD|FANTASY|SACK|PR WIN/.test(u)) return "#ff6b2b";
  if (/WIN RATE|PASS RUSH/.test(u)) return "#a855f7";
  return "#f2f2f5";
}
