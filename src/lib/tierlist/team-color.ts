const PALETTE = [
  "#1e3a5f",
  "#c41e3a",
  "#0b4f26",
  "#6b21a8",
  "#b45309",
  "#0e7490",
  "#9f1239",
  "#1d4ed8",
  "#854d0e",
  "#14532d",
];

export function teamChipBackground(team: string): string {
  if (!team?.trim()) return PALETTE[0];
  let h = 0;
  for (let i = 0; i < team.length; i++) {
    h = team.charCodeAt(i) + ((h << 5) - h);
  }
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export function playerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]?.[0] ?? "";
    const b = parts[parts.length - 1]?.[0] ?? "";
    return `${a}${b}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
