import { createClient } from "@supabase/supabase-js";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export type FeaturedPlayerForHome = {
  id: string;
  name: string;
  pos: string;
  team: string;
  grade: string;
  accent: "green" | "orange" | "blue" | "purple";
  image: string;
  teamBg: string;
  snippet: string;
  trending: boolean;
  bars?: { label: string; value: number }[];
};

const DEFAULT_BARS = [
  { label: "Buzz", value: 91 },
  { label: "Trend", value: 88 },
  { label: "Usage", value: 85 },
];

const FALLBACK: FeaturedPlayerForHome[] = [
  {
    id: "jayden-daniels",
    name: "Jayden Daniels",
    pos: "QB",
    team: "Washington Commanders",
    grade: "92.1",
    accent: "green",
    image: "/players/jayden-daniels.png",
    teamBg: "#5a1414",
    snippet: "Featured on NFL Stat Guru",
    trending: true,
    bars: [
      { label: "Passing", value: 91 },
      { label: "Running", value: 88 },
      { label: "Pressure", value: 84 },
    ],
  },
  {
    id: "ceedee-lamb",
    name: "CeeDee Lamb",
    pos: "WR",
    team: "Dallas Cowboys",
    grade: "94.8",
    accent: "blue",
    image: "/players/ceedee-lamb.png",
    teamBg: "#003594",
    snippet: "Featured on NFL Stat Guru",
    trending: true,
    bars: [
      { label: "YPRR", value: 98 },
      { label: "Target", value: 96 },
      { label: "EPA", value: 94 },
    ],
  },
  {
    id: "saquon-barkley",
    name: "Saquon Barkley",
    pos: "RB",
    team: "Philadelphia Eagles",
    grade: "91.2",
    accent: "orange",
    image: "/players/jayden-daniels.png",
    teamBg: "#004851",
    snippet: "Featured on NFL Stat Guru",
    trending: true,
    bars: [
      { label: "Rush", value: 94 },
      { label: "Rec", value: 88 },
      { label: "TDs", value: 92 },
    ],
  },
  {
    id: "rueben-bain",
    name: "Rueben Bain",
    pos: "DT/DE",
    team: "2025 Draft",
    grade: "B+",
    accent: "purple",
    image: "/players/reuben-bain.png",
    teamBg: "#f47321",
    snippet: "Featured on NFL Stat Guru",
    trending: true,
    bars: [
      { label: "PR Win", value: 82 },
      { label: "Motor", value: 94 },
      { label: "Run D", value: 55 },
    ],
  },
];

const ACCENT_ROT: FeaturedPlayerForHome["accent"][] = ["green", "blue", "orange", "purple"];

const IMAGE_BY_NAME: Record<string, string> = {
  "jayden daniels": "/players/jayden-daniels.png",
  "ceedee lamb": "/players/ceedee-lamb.png",
  "saquon barkley": "/players/ceedee-lamb.png",
  "rueben bain": "/players/reuben-bain.png",
  "justin jefferson": "/players/ceedee-lamb.png",
  "patrick mahomes": "/players/jayden-daniels.png",
  "josh allen": "/players/jayden-daniels.png",
};

function slugId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getFeaturedPlayersForHome(): Promise<FeaturedPlayerForHome[]> {
  if (!supabase) return FALLBACK;

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: rows, error } = await supabase
    .from("news_feed")
    .select("headline, player_tags, published_at")
    .gte("published_at", since)
    .limit(400);

  if (error || !rows?.length) return FALLBACK;

  const counts = new Map<string, { n: number; headline: string }>();
  for (const row of rows) {
    const tags = row.player_tags ?? [];
    const h = (row.headline ?? "").slice(0, 120);
    for (const raw of tags) {
      const name = String(raw).trim();
      if (!name || name.length < 3) continue;
      const prev = counts.get(name);
      if (!prev) counts.set(name, { n: 1, headline: h });
      else counts.set(name, { n: prev.n + 1, headline: prev.headline || h });
    }
  }

  const topNames = [...counts.entries()]
    .sort((a, b) => b[1].n - a[1].n)
    .slice(0, 8)
    .map(([name]) => name);

  if (topNames.length === 0) return FALLBACK;

  const { data: players } = await supabase
    .from("players")
    .select("id, name, position, team")
    .in(
      "name",
      topNames.filter((n) => n.length > 0),
    );

  const byName = new Map((players ?? []).map((p) => [p.name.toLowerCase(), p]));

  const out: FeaturedPlayerForHome[] = [];
  let ai = 0;
  for (const name of topNames) {
    if (out.length >= 4) break;
    const stat = counts.get(name);
    const p = byName.get(name.toLowerCase());
    const id = p?.id ?? slugId(name);
    const pos = p?.position ?? "NFL";
    const team = p?.team ?? "NFL";
    const img = IMAGE_BY_NAME[name.toLowerCase()] ?? "/players/jayden-daniels.png";
    out.push({
      id: String(id),
      name: p?.name ?? name,
      pos,
      team,
      grade: "—",
      accent: ACCENT_ROT[ai % ACCENT_ROT.length]!,
      image: img,
      teamBg: "#1a1a1a",
      snippet: stat?.headline ?? `Trending in news · ${stat?.n ?? 0} mentions`,
      trending: true,
      bars: DEFAULT_BARS,
    });
    ai++;
  }

  if (out.length < 4) {
    const pad = FALLBACK.filter((f) => !out.some((o) => o.name === f.name));
    out.push(...pad.slice(0, 4 - out.length));
  }

  return out.slice(0, 4);
}
