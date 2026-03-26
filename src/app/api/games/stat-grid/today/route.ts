import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { STAT_GRID_SEED } from "@/lib/games/stat-grid-seed";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const date = todayIso();
  if (!supabase) {
    return NextResponse.json({ game_date: date, cells: STAT_GRID_SEED });
  }

  const { data } = await supabase.from("stat_grid_puzzles").select("cells").eq("game_date", date).maybeSingle();

  if (data?.cells && Array.isArray(data.cells)) {
    return NextResponse.json({ game_date: date, cells: data.cells });
  }

  return NextResponse.json({ game_date: date, cells: STAT_GRID_SEED });
}
