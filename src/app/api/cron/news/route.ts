import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Vercel Cron / external scheduler: verify secret, revalidate Trending.
 * Actual ingestion runs via GitHub Actions: `python scripts/news/fetch_news.py`
 */
function authorize(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  const headerSecret = req.headers.get("x-cron-secret");
  const q = new URL(req.url).searchParams.get("secret");
  return auth === `Bearer ${secret}` || headerSecret === secret || q === secret;
}

export async function POST(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET is not configured." }, { status: 501 });
  }
  if (!authorize(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/trending", "layout");

  return NextResponse.json({
    ok: true,
    revalidated: true,
    hint: "News ingestion: run scripts/news/fetch_news.py (e.g. GitHub Actions schedule).",
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
