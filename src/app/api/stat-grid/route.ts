import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getEasternDateString } from "@/lib/date";
import { getFallbackPuzzleForDate } from "@/lib/stat-grid/seed-puzzles";
import type { StatGridPuzzle } from "@/types/stat-grid";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function GET() {
  const gameDate = getEasternDateString();

  if (supabase) {
    const { data, error } = await supabase
      .from("stat_grid_puzzles")
      .select("id, game_date, cells, created_at")
      .eq("game_date", gameDate)
      .maybeSingle();

    if (!error && data?.cells) {
      return NextResponse.json({
        id: data.id,
        game_date: data.game_date,
        cells: data.cells as StatGridPuzzle["cells"],
        created_at: data.created_at,
        source: "database" as const,
      });
    }
  }

  const fallback = getFallbackPuzzleForDate(gameDate);
  return NextResponse.json({
    id: null,
    game_date: fallback.game_date,
    cells: fallback.cells,
    created_at: null,
    source: "fallback" as const,
  });
}
