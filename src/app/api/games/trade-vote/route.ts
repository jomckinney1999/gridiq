import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ deal: 60, noDeal: 40, total: 100 });
  }
  const { data: rows } = await supabase.from("trade_votes").select("choice");
  const list = rows ?? [];
  const deal = list.filter((r) => r.choice === "deal").length;
  const noDeal = list.filter((r) => r.choice === "no_deal").length;
  const total = deal + noDeal;
  const dp = total ? Math.round((deal / total) * 100) : 50;
  const np = total ? 100 - dp : 50;
  return NextResponse.json({ deal: dp, noDeal: np, total });
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  let body: { userSessionId?: string; choice?: "deal" | "no_deal" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const userSessionId = typeof body.userSessionId === "string" ? body.userSessionId : "";
  const choice = body.choice === "no_deal" ? "no_deal" : "deal";
  if (!userSessionId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await supabase.from("trade_votes").upsert({ user_session_id: userSessionId, choice });

  return NextResponse.json({ ok: true });
}
