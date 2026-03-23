import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Newsletter is not configured (Supabase)." },
      { status: 503 },
    );
  }

  let body: { email?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const source =
    typeof body.source === "string" && body.source.length <= 64 ? body.source : "content_page";

  const { error } = await supabase.from("newsletter_subscribers").insert({ email, source });

  if (!error) {
    return NextResponse.json({
      ok: true,
      message: "You're subscribed! Check your inbox for the next Film Room drop.",
    });
  }

  if (error.code === "23505") {
    return NextResponse.json({
      ok: true,
      message: "You're already on the list — look out for Tuesday's send.",
    });
  }

  return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
}
