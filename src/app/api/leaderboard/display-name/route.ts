import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  let body: { sessionId?: string; displayName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim().slice(0, 20) : "";
  if (!sessionId || !displayName) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { data: row } = await supabase.from("leaderboard").select("id").eq("user_session_id", sessionId).maybeSingle();
  if (row) {
    await supabase.from("leaderboard").update({ display_name: displayName, updated_at: new Date().toISOString() }).eq("user_session_id", sessionId);
  } else {
    await supabase.from("leaderboard").insert({
      user_session_id: sessionId,
      display_name: displayName,
      total_xp: 0,
      weekly_xp: 0,
    });
  }
  return NextResponse.json({ ok: true });
}
