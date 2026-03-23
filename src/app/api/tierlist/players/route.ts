import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { dbPositionsForFilter } from "@/lib/tierlist/positions";
import { fallbackTierPlayers, sortPlayersByRelevance } from "@/lib/tierlist/relevance";
import { POSITION_FILTERS, type PositionFilter, type TierListPlayer } from "@/types/tierlist";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("position") ?? "QB";
  if (!POSITION_FILTERS.includes(raw as PositionFilter)) {
    return NextResponse.json({ error: "Invalid position filter" }, { status: 400 });
  }
  const filter = raw as PositionFilter;
  const positions = dbPositionsForFilter(filter);

  if (!supabase) {
    return NextResponse.json({
      players: fallbackTierPlayers(filter),
      source: "fallback" as const,
    });
  }

  const { data, error } = await supabase
    .from("players")
    .select("id, name, position, team")
    .in("position", positions)
    .limit(220);

  if (error || !data?.length) {
    return NextResponse.json({
      players: fallbackTierPlayers(filter),
      source: "fallback" as const,
    });
  }

  const rows = data as TierListPlayer[];
  const sorted = sortPlayersByRelevance(rows, filter).slice(0, 32);

  return NextResponse.json({
    players: sorted,
    source: "database" as const,
  });
}
