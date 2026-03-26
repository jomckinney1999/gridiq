import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

/** Reveal + next question (host or auto) */
export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
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
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const { data: session } = await supabase.from("game_sessions").select("*").eq("room_code", roomCode).maybeSingle();
  if (!session || session.host_session_id !== hostSessionId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const gd = (session.game_data ?? {}) as {
    questionIds?: string[];
    questionIndex?: number;
    phase?: string;
    revealed?: boolean;
  };

  const ids = gd.questionIds ?? [];
  let idx = gd.questionIndex ?? 0;

  if (!gd.revealed) {
    await supabase
      .from("game_sessions")
      .update({
        game_data: { ...gd, revealed: true, phase: "reveal" },
      })
      .eq("id", session.id);
    return NextResponse.json({ ok: true, phase: "reveal" });
  }

  idx += 1;
  if (idx >= ids.length) {
    await supabase
      .from("game_sessions")
      .update({
        status: "ended",
        ended_at: new Date().toISOString(),
        game_data: { ...gd, phase: "done", questionIndex: idx },
      })
      .eq("id", session.id);
    return NextResponse.json({ ok: true, phase: "done" });
  }

  await supabase
    .from("game_sessions")
    .update({
      game_data: {
        ...gd,
        questionIndex: idx,
        revealed: false,
        phase: "question",
        deadline: Date.now() + 20_000,
        answersRound: {},
      },
    })
    .eq("id", session.id);

  return NextResponse.json({ ok: true, phase: "question" });
}
