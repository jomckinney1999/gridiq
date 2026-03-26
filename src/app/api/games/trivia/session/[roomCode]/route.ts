import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function GET(_req: NextRequest, ctx: { params: Promise<{ roomCode: string }> }) {
  const { roomCode: raw } = await ctx.params;
  const roomCode = decodeURIComponent(raw).trim().toUpperCase();

  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: session, error } = await supabase.from("game_sessions").select("*").eq("room_code", roomCode).maybeSingle();
  if (error || !session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: players } = await supabase
    .from("game_players")
    .select("user_session_id, display_name, score, rank")
    .eq("session_id", session.id)
    .order("score", { ascending: false });

  let currentQuestion: unknown = null;
  const gd = session.game_data as {
    questionIds?: string[];
    questionIndex?: number;
    phase?: string;
  };
  const qid = gd.questionIds?.[gd.questionIndex ?? 0];
  if (qid) {
    const { data: q } = await supabase.from("trivia_questions").select("*").eq("id", qid).maybeSingle();
    currentQuestion = q;
  }

  return NextResponse.json({
    session,
    players: players ?? [],
    currentQuestion,
  });
}
