import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

type NewsRow = {
  id: string;
  source_name: string;
  source_type: string;
  author: string | null;
  headline: string;
  body: string | null;
  url: string | null;
  image_url: string | null;
  player_tags: string[] | null;
  team_tags: string[] | null;
  sentiment: string | null;
  published_at: string | null;
  upvotes: number | null;
  comments: number | null;
  views: number | null;
  is_verified: boolean | null;
};

const BREAKING_TYPES = new Set(["ESPN", "NFL", "PFT", "NBC", "PFR", "BR", "PFF"]);
const SOCIAL_TYPES = new Set(["Reddit", "Twitter"]);

const SOURCE_MAP: Record<string, string[]> = {
  ESPN: ["ESPN"],
  Twitter: ["Twitter"],
  Reddit: ["Reddit"],
  Beat: ["PFT", "NBC", "BR", "PFR"],
  NFL: ["NFL"],
  PFF: ["PFF"],
};

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: "News feed is not configured (Supabase).", all: [], breaking: [], social: [], total: 0 },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(req.url);
  const team = searchParams.get("team");
  const source = searchParams.get("source");
  const limit = Math.min(parseInt(searchParams.get("limit") || "60", 10), 100);

  try {
    let query = supabase.from("news_feed").select("*").order("published_at", { ascending: false }).limit(limit);

    if (team && team !== "ALL") {
      query = query.contains("team_tags", [team]);
    }

    if (source && source !== "all") {
      const types = SOURCE_MAP[source] ?? [source];
      query = query.in("source_type", types);
    }

    const { data, error } = await query;

    if (error) throw error;

    const rows = (data ?? []) as NewsRow[];

    const breaking = rows.filter((item) => BREAKING_TYPES.has(item.source_type));
    const social = rows.filter((item) => SOCIAL_TYPES.has(item.source_type));

    return NextResponse.json({
      breaking,
      social,
      all: rows,
      total: rows.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, all: [], breaking: [], social: [], total: 0 }, { status: 500 });
  }
}
