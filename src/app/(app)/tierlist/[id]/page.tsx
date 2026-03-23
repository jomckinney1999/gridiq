"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { TierRow } from "@/components/tierlist/TierRow";
import {
  TIER_ORDER,
  type TierKey,
  type TierListPlayer,
  type TiersState,
} from "@/types/tierlist";

type ApiResponse = {
  title: string;
  position_filter: string;
  tiers: TiersState;
  players: TierListPlayer[];
  created_at: string;
  views: number;
  error?: string;
};

export default function SharedTierListPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Invalid link.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/tierlist/${id}`)
      .then(async (r) => {
        const json = (await r.json()) as ApiResponse & { error?: string };
        if (!r.ok) {
          throw new Error(json.error ?? "Not found");
        }
        return json;
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const byId = useMemo(() => {
    const m = new Map<string, TierListPlayer>();
    for (const p of data?.players ?? []) {
      m.set(p.id, p);
    }
    return m;
  }, [data?.players]);

  const tierPlayers = (key: TierKey) => {
    if (!data) return [];
    return data.tiers[key].map((pid) => byId.get(pid)).filter(Boolean) as TierListPlayer[];
  };

  const created = data?.created_at
    ? new Date(data.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  if (error && !loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-[14px] text-[#ff6b2b]">{error}</p>
        <Link
          href="/tierlist"
          className="mt-6 inline-block text-[13px] font-semibold text-[#00ff87] hover:underline"
        >
          ← Tier list maker
        </Link>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[88px] animate-pulse rounded-xl bg-[rgba(255,255,255,0.04)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#00ff87]">
          Shared tier list
        </p>
        <h1 className="mt-2 text-[22px] font-extrabold text-[#f2f2f5]">{data.title}</h1>
        <p className="mt-2 text-[12px] text-[#8888a0]">
          {data.position_filter} · {created}
          {typeof data.views === "number" ? (
            <span className="text-[#55556a]"> · {data.views.toLocaleString()} views</span>
          ) : null}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {TIER_ORDER.map((tier) => (
          <TierRow
            key={tier}
            tier={tier}
            players={tierPlayers(tier)}
            draggingId={null}
            dropHighlight={false}
            readOnly
          />
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-[rgba(0,255,135,0.2)] bg-[rgba(0,255,135,0.05)] px-4 py-6 text-center">
        <p className="text-[14px] font-semibold text-[#f2f2f5]">Build your own NFL tier list</p>
        <p className="mt-1 text-[12px] text-[#8888a0]">
          Drag real players, publish, and share — free on NFL Stat Guru.
        </p>
        <Link
          href="/tierlist"
          className="mt-4 inline-flex rounded-full bg-[#00ff87] px-6 py-2.5 text-[13px] font-bold text-[#050507] transition hover:brightness-110"
        >
          Make your own
        </Link>
      </div>
    </div>
  );
}
