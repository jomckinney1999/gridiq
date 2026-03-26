import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  let body: {
    roomCode?: string;
    userSessionId?: string;
    answerIndex?: number;
    timeLeftSec?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const roomCode = (body.roomCode ?? "").trim().toUpperCase();
  const userSessionId = typeof body.userSessionId === "string" ? body.userSessionId : "";
  const answerIndex = Number(body.answerIndex);
  const timeLeftSec = Math.max(0, Math.min(20, Number(body.timeLeftSec) || 0));
  if (!roomCode || !userSessionId || Number.isNaN(answerIndex)) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const { data: session } = await supabase.from("game_sessions").select("*").eq("room_code", roomCode).maybeSingle();
  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const gd = (session.game_data ?? {}) as {
    questionIds?: string[];
    questionIndex?: number;
    phase?: string;
    scores?: Record<string, number>;
    answersRound?: Record<string, number>;
    revealed?: boolean;
  };

  if (gd.phase !== "question" || gd.revealed) {
    return NextResponse.json({ error: "Not accepting answers" }, { status: 400 });
  }

  const qid = gd.questionIds?.[gd.questionIndex ?? 0];
  if (!qid) {
    return NextResponse.json({ error: "No question" }, { status: 400 });
  }

  const { data: qrow } = await supabase.from("trivia_questions").select("correct_index").eq("id", qid).maybeSingle();
  const correct = qrow?.correct_index ?? -1;
  const points =
    answerIndex === correct ? Math.floor(1000 * (timeLeftSec / 20)) : 0;

  const scores = { ...(gd.scores ?? {}) };
  scores[userSessionId] = (scores[userSessionId] ?? 0) + points;

  const answersRound = { ...(gd.answersRound ?? {}) };
  answersRound[userSessionId] = answerIndex;

  await supabase
    .from("game_sessions")
    .update({
      game_data: {
        ...gd,
        scores,
        answersRound,
      },
    })
    .eq("id", session.id);

  await supabase
    .from("game_players")
    .update({ score: scores[userSessionId] })
    .eq("session_id", session.id)
    .eq("user_session_id", userSessionId);

  return NextResponse.json({ ok: true, points, correct });
}
