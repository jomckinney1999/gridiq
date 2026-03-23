const PALETTE = [
  "var(--blue)",
  "var(--orange)",
  "var(--green)",
  "var(--purple)",
  "color-mix(in srgb, var(--blue) 75%, var(--txt) 25%)",
  "color-mix(in srgb, var(--orange) 75%, var(--txt) 25%)",
  "color-mix(in srgb, var(--green) 75%, var(--txt) 25%)",
  "color-mix(in srgb, var(--purple) 75%, var(--txt) 25%)",
  "color-mix(in srgb, var(--blue) 50%, var(--purple) 50%)",
  "color-mix(in srgb, var(--orange) 50%, var(--green) 50%)",
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
