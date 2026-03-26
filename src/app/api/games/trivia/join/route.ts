import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  let body: { roomCode?: string; displayName?: string; userSessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const roomCode = (body.roomCode ?? "").trim().toUpperCase();
  const userSessionId = typeof body.userSessionId === "string" ? body.userSessionId : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim().slice(0, 32) : "Player";
  if (!roomCode || !userSessionId) {
    return NextResponse.json({ error: "roomCode and userSessionId required" }, { status: 400 });
  }

  const { data: session, error: sErr } = await supabase
    .from("game_sessions")
    .select("id, status, max_players, current_players")
    .eq("room_code", roomCode)
    .maybeSingle();

  if (sErr || !session) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  if (session.status !== "waiting") {
    return NextResponse.json({ error: "Game already started" }, { status: 400 });
  }
  if ((session.current_players ?? 0) >= (session.max_players ?? 20)) {
    return NextResponse.json({ error: "Room full" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("game_players")
    .select("id")
    .eq("session_id", session.id)
    .eq("user_session_id", userSessionId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("game_players").insert({
      session_id: session.id,
      user_session_id: userSessionId,
      display_name: displayName || "Player",
      score: 0,
    });
    await supabase
      .from("game_sessions")
      .update({ current_players: (session.current_players ?? 0) + 1 })
      .eq("id", session.id);
  }

  return NextResponse.json({ ok: true, sessionId: session.id });
}
