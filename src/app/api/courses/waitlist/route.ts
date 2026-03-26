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
      { ok: false, error: "Waitlist is not configured (Supabase)." },
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

  const source = typeof body.source === "string" ? body.source.trim().slice(0, 120) : null;

  const { error } = await supabase.from("course_waitlist").insert({ email, ...(source ? { source } : {}) });

  if (!error) {
    return NextResponse.json({
      ok: true,
      message: "You're on the list! We'll notify you when we launch.",
    });
  }

  if (error.code === "23505") {
    return NextResponse.json({
      ok: true,
      message: "You're already on the list! We'll notify you when we launch.",
    });
  }

  return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
}
