import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ ok: true });
  }
  let body: {
    sessionId?: string;
    questions?: { q: string; a: string }[];
    guess?: string;
    wasCorrect?: boolean;
    playerWas?: string;
    questionsToSolve?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await supabase.from("mind_reader_games").insert({
    session_id: body.sessionId ?? "unknown",
    questions_asked: body.questions ?? [],
    final_guess: body.guess ?? null,
    was_correct: body.wasCorrect ?? null,
    player_was: body.playerWas ?? null,
    questions_to_solve: body.questionsToSolve ?? null,
  });
  return NextResponse.json({ ok: true });
}
