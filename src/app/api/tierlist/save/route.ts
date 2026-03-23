import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import type { TiersState } from "@/types/tierlist";
import { TIER_ORDER } from "@/types/tierlist";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

const CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomShareId(): string {
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return s;
}

function isTiersState(v: unknown): v is TiersState {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return TIER_ORDER.every((k) => Array.isArray(o[k]));
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Tier list storage is not configured (Supabase)." },
      { status: 503 },
    );
  }

  let body: { title?: string; position_filter?: string; tiers?: TiersState };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 120) {
    return NextResponse.json({ error: "Title required (1–120 chars)" }, { status: 400 });
  }

  const position_filter =
    typeof body.position_filter === "string" && body.position_filter.length <= 32
      ? body.position_filter
      : "QB";

  if (!isTiersState(body.tiers)) {
    return NextResponse.json({ error: "Invalid tiers payload" }, { status: 400 });
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const share_id = randomShareId();
    const { data, error } = await supabase
      .from("tier_lists")
      .insert({
        share_id,
        title,
        position_filter,
        tiers: body.tiers,
      })
      .select("id, share_id, created_at")
      .single();

    if (!error && data) {
      const forwarded = request.headers.get("x-forwarded-host");
      const proto = request.headers.get("x-forwarded-proto") ?? "https";
      const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
      const base =
        fromEnv ||
        (forwarded ? `${proto}://${forwarded}` : new URL(request.url).origin);
      const url = `${base}/tierlist/${data.share_id}`;
      return NextResponse.json({
        id: data.id,
        share_id: data.share_id,
        created_at: data.created_at,
        url,
      });
    }
    if (error?.code === "23505") {
      continue;
    }
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Could not allocate share id" }, { status: 500 });
}
