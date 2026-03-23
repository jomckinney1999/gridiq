import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { resolveFallbackPlayerId } from "@/lib/tierlist/relevance";
import { TIER_ORDER, type TierListPlayer, type TiersState } from "@/types/tierlist";

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

function collectPlayerIds(tiers: TiersState): string[] {
  const set = new Set<string>();
  for (const k of TIER_ORDER) {
    for (const id of tiers[k]) {
      if (id) set.add(id);
    }
  }
  return [...set];
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: shareId } = await context.params;
  if (!shareId || shareId.length > 32) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("tier_lists")
    .select("id, share_id, title, position_filter, tiers, created_at, views")
    .eq("share_id", shareId)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tiers = data.tiers as TiersState;
  const ids = collectPlayerIds(tiers);

  const players: TierListPlayer[] = [];
  const seen = new Set<string>();
  if (ids.length) {
    const uuidLike = ids.filter((id) => !id.startsWith("fb-"));
    if (uuidLike.length) {
      const { data: rows } = await supabase
        .from("players")
        .select("id, name, position, team")
        .in("id", uuidLike);
      for (const p of (rows ?? []) as TierListPlayer[]) {
        players.push(p);
        seen.add(p.id);
      }
    }
    for (const id of ids) {
      if (seen.has(id)) continue;
      const fb = resolveFallbackPlayerId(id);
      if (fb) {
        players.push(fb);
        seen.add(id);
      }
    }
  }

  await supabase
    .from("tier_lists")
    .update({ views: (data.views ?? 0) + 1 })
    .eq("id", data.id);

  return NextResponse.json({
    id: data.id,
    share_id: data.share_id,
    title: data.title,
    position_filter: data.position_filter,
    tiers,
    players,
    created_at: data.created_at,
    views: (data.views ?? 0) + 1,
  });
}
