import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId") ?? "";

  if (!supabase) {
    return NextResponse.json({
      top10: [],
      userRank: null,
      userXP: 0,
      activeTodayCount: 0,
    });
  }

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count: activeTodayCount } = await supabase
    .from("leaderboard")
    .select("*", { count: "exact", head: true })
    .gte("updated_at", startOfDay.toISOString());

  const { data: topRows } = await supabase
    .from("leaderboard")
    .select("user_session_id, display_name, weekly_xp, current_streak, longest_streak, total_xp, updated_at")
    .order("weekly_xp", { ascending: false })
    .limit(10);

  let userRank: number | null = null;
  let userXP = 0;

  if (sessionId) {
    const { data: me } = await supabase
      .from("leaderboard")
      .select("weekly_xp")
      .eq("user_session_id", sessionId)
      .maybeSingle();

    userXP = me?.weekly_xp ?? 0;

    if (me) {
      const { count: above } = await supabase
        .from("leaderboard")
        .select("*", { count: "exact", head: true })
        .gt("weekly_xp", userXP);
      userRank = (above ?? 0) + 1;
    }
  }

  return NextResponse.json({
    top10: topRows ?? [],
    userRank,
    userXP,
    activeTodayCount: activeTodayCount ?? 0,
  });
}
