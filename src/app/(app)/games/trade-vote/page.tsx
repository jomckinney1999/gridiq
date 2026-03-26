"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { awardXP, getSessionId } from "@/lib/xp/actions";

export default function TradeVotePage() {
  const [deal, setDeal] = useState(50);
  const [noDeal, setNoDeal] = useState(50);
  const [voted, setVoted] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/games/trade-vote")
      .then((r) => r.json())
      .then((d: { deal: number; noDeal: number }) => {
        setDeal(d.deal);
        setNoDeal(d.noDeal);
      })
      .catch(() => {});
  }, []);

  async function vote(choice: "deal" | "no_deal") {
    const sid = getSessionId();
    await fetch("/api/games/trade-vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userSessionId: sid, choice }),
    });
    setVoted(choice);
    await awardXP(sid, "TRADE_VOTE", localStorage.getItem("guru_display_name") ?? undefined);
    const res = await fetch("/api/games/trade-vote");
    const d = (await res.json()) as { deal: number; noDeal: number };
    setDeal(d.deal);
    setNoDeal(d.noDeal);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/games" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
        ← Game Room
      </Link>
      <h1 className="mt-6 text-[26px] font-black text-[var(--txt)]">Trade: Deal or No Deal</h1>
      <p className="mt-2 text-[14px] text-[var(--txt-2)]">CeeDee Lamb ↔ Saquon Barkley — community decides.</p>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#b91c1c] bg-[#3a1010] p-6 text-center">
          <p className="text-[11px] font-bold uppercase text-[#fca5a5]">You give</p>
          <p className="mt-2 text-[18px] font-black text-[var(--txt)]">CeeDee Lamb</p>
          <p className="text-[12px] text-[var(--txt-muted)]">WR · DAL</p>
        </div>
        <div className="rounded-2xl border border-[#16a34a] bg-[#10321a] p-6 text-center">
          <p className="text-[11px] font-bold uppercase text-[#86efac]">You get</p>
          <p className="mt-2 text-[18px] font-black text-[var(--txt)]">Saquon Barkley</p>
          <p className="text-[12px] text-[var(--txt-muted)]">RB · PHI</p>
        </div>
      </div>

      <div className="mt-8 h-4 w-full overflow-hidden rounded-full bg-[var(--bg-subtle-2)]">
        <div className="h-full bg-[var(--green)] transition-all" style={{ width: `${deal}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[12px] font-bold text-[var(--txt)]">
        <span>DEAL {deal}%</span>
        <span>NO DEAL {noDeal}%</span>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => void vote("deal")}
          disabled={voted !== null}
          className="h-12 flex-1 rounded-xl bg-[var(--green)] text-[14px] font-bold text-[var(--on-green)] disabled:opacity-50"
        >
          DEAL
        </button>
        <button
          type="button"
          onClick={() => void vote("no_deal")}
          disabled={voted !== null}
          className="h-12 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[14px] font-bold disabled:opacity-50"
        >
          NO DEAL
        </button>
      </div>
      {voted ? <p className="mt-4 text-[13px] text-[var(--txt-muted)]">You voted: {voted === "deal" ? "DEAL" : "NO DEAL"}</p> : null}
    </div>
  );
}
