export type JournalistMeta = {
  handle: string;
  org: string;
  initials: string;
  color: string;
};

/** Known NFL media — used for tweet-style cards and avatars when source matches. */
export const JOURNALIST_INFO: Record<string, JournalistMeta> = {
  "Adam Schefter": { handle: "@AdamSchefter", org: "ESPN", initials: "AS", color: "#d00" },
  "Ian Rapoport": { handle: "@RapSheet", org: "NFL Network", initials: "IR", color: "#013369" },
  "Field Yates": { handle: "@FieldYates", org: "ESPN", initials: "FY", color: "#d00" },
  "Mike Garafolo": { handle: "@MikeGarafolo", org: "NFL Network", initials: "MG", color: "#013369" },
  "Tom Pelissero": { handle: "@TomPelissero", org: "NFL Network", initials: "TP", color: "#013369" },
  "Daniel Jeremiah": { handle: "@MoveTheSticks", org: "NFL Network", initials: "DJ", color: "#a855f7" },
  "Bucky Brooks": { handle: "@BuckyBrooks", org: "NFL Network", initials: "BB", color: "#a855f7" },
  "Connor Rogers": { handle: "@ConnorJRogers", org: "NFL Network", initials: "CR", color: "#1a6fd4" },
  "Trevor Sikkema": { handle: "@TampaBayTre", org: "PFF", initials: "TS", color: "#00a854" },
  "Mike Reiss": { handle: "@MikeReiss", org: "ESPN", initials: "MR", color: "#d00" },
  "Nicki Jhabvala": { handle: "@NickiJhabvala", org: "Washington Post", initials: "NJ", color: "#1a6fd4" },
  "ESPN NFL": { handle: "@ESPNNFL", org: "ESPN", initials: "ES", color: "#d00" },
};

export function lookupJournalist(author: string): JournalistMeta | null {
  const a = author.trim();
  if (!a) return null;
  if (JOURNALIST_INFO[a]) return JOURNALIST_INFO[a];
  for (const [name, meta] of Object.entries(JOURNALIST_INFO)) {
    if (a.includes(name)) return meta;
  }
  return null;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
