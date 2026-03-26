import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

const CODE = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function genRoom(): string {
  let s = "";
  for (let i = 0; i < 6; i++) s += CODE[Math.floor(Math.random() * CODE.length)];
  return `NFL-${s}`;
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  let body: {
    displayName?: string;
    category?: string;
    questionCount?: number;
    hostSessionId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const hostSessionId = typeof body.hostSessionId === "string" ? body.hostSessionId : "";
  const category = typeof body.category === "string" ? body.category : "All NFL";
  const questionCount = Math.min(15, Math.max(5, Number(body.questionCount) || 5));
  if (!hostSessionId) {
    return NextResponse.json({ error: "hostSessionId required" }, { status: 400 });
  }

  let roomCode = genRoom();
  for (let attempt = 0; attempt < 12; attempt++) {
    const { data, error } = await supabase
      .from("game_sessions")
      .insert({
        game_type: "trivia",
        room_code: roomCode,
        host_session_id: hostSessionId,
        status: "waiting",
        current_players: 1,
        game_data: {
          category,
          questionCount,
          phase: "lobby",
          questionIds: [] as string[],
          questionIndex: -1,
          scores: {} as Record<string, number>,
        },
      })
      .select("id")
      .single();

    if (!error && data) {
      const dn = typeof body.displayName === "string" ? body.displayName.trim().slice(0, 32) : "Host";
      await supabase.from("game_players").insert({
        session_id: data.id,
        user_session_id: hostSessionId,
        display_name: dn || "Host",
        score: 0,
      });
      return NextResponse.json({ roomCode, sessionId: data.id });
    }
    if (error?.code === "23505") {
      roomCode = genRoom();
      continue;
    }
    return NextResponse.json({ error: error?.message ?? "create failed" }, { status: 500 });
  }
  return NextResponse.json({ error: "Could not allocate room" }, { status: 500 });
}
