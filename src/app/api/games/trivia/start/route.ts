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
  let body: { roomCode?: string; hostSessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const roomCode = (body.roomCode ?? "").trim().toUpperCase();
  const hostSessionId = typeof body.hostSessionId === "string" ? body.hostSessionId : "";
  if (!roomCode || !hostSessionId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: session, error } = await supabase.from("game_sessions").select("*").eq("room_code", roomCode).maybeSingle();
  if (error || !session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (session.host_session_id !== hostSessionId) {
    return NextResponse.json({ error: "Not host" }, { status: 403 });
  }

  const { data: players } = await supabase.from("game_players").select("user_session_id").eq("session_id", session.id);
  if (!players || players.length < 2) {
    return NextResponse.json({ error: "Need at least 2 players" }, { status: 400 });
  }

  const gd = (session.game_data ?? {}) as {
    category?: string;
    questionCount?: number;
  };
  const n = Math.min(15, Math.max(1, gd.questionCount ?? 5));

  let qQuery = supabase.from("trivia_questions").select("id").limit(200);
  const cat = gd.category ?? "All NFL";
  if (cat && cat !== "All NFL") {
    qQuery = qQuery.eq("category", cat);
  }
  const { data: qs } = await qQuery;
  const ids = (qs ?? []).map((q) => q.id as string);
  const shuffled = ids.sort(() => Math.random() - 0.5).slice(0, n);
  if (shuffled.length === 0) {
    return NextResponse.json({ error: "No questions available" }, { status: 400 });
  }

  const deadline = Date.now() + 20_000;
  const nextData = {
    ...gd,
    phase: "question",
    questionIds: shuffled,
    questionIndex: 0,
    deadline,
    scores: {} as Record<string, number>,
    answersRound: {} as Record<string, number>,
    revealed: false,
  };

  await supabase
    .from("game_sessions")
    .update({
      status: "playing",
      started_at: new Date().toISOString(),
      game_data: nextData,
    })
    .eq("id", session.id);

  return NextResponse.json({ ok: true });
}
