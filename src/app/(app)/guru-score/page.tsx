"use client";

import { useEffect, useMemo, useState } from "react";
import { GuruScoreCard } from "@/components/guru/GuruScoreCard";
import { playerMatchesGuruFilter } from "@/lib/guru/positions";
import { cn } from "@/lib/utils";
import type { GuruListPlayer, GuruPositionFilter } from "@/types/guru";
import { GURU_POSITION_FILTERS } from "@/types/guru";

export default function GuruScorePage() {
  const [players, setPlayers] = useState<GuruListPlayer[]>([]);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState<GuruPositionFilter>("All");

  useEffect(() => {
    fetch("/api/guru-score")
      .then((r) => r.json())
      .then((d) => setPlayers(d.players ?? []))
      .catch(() => setPlayers([]));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return players.filter((p) => {
      const okQ = !needle || p.name.toLowerCase().includes(needle);
      const okP = playerMatchesGuruFilter(p.position, pos);
      return okQ && okP;
    });
  }, [players, q, pos]);

  const risers = useMemo(
    () =>
      [...players]
        .sort((a, b) => (b.scoreChangeWeek ?? 0) - (a.scoreChangeWeek ?? 0))
        .filter((p) => (p.scoreChangeWeek ?? 0) > 0)
        .slice(0, 3),
    [players],
  );

  const fallers = useMemo(
    () =>
      [...players]
        .sort((a, b) => (a.scoreChangeWeek ?? 0) - (b.scoreChangeWeek ?? 0))
        .filter((p) => (p.scoreChangeWeek ?? 0) < 0)
        .slice(0, 3),
    [players],
  );

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6">
      <header className="max-w-3xl">
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--green)]">Player Intelligence</p>
        <h1 className="mt-2 text-[var(--text-h1)] font-black tracking-tight text-[var(--txt)]">Guru Stock Tracker</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--txt-2)]">
          Expert analysis vs fan sentiment — updated weekly. See how player stock rises and falls in real time.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search players</span>
          <input
            type="search"
            placeholder="Search any player..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 pr-4 text-[14px] font-medium text-[var(--txt)] shadow-[var(--shadow-sm)] outline-none ring-[var(--green)] placeholder:text-[var(--txt-3)] focus:border-[var(--green-border)] focus:ring-2"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {GURU_POSITION_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setPos(f)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-bold transition",
              pos === f
                ? "bg-[var(--green)] text-[var(--on-green)] shadow-[var(--shadow-glow-g)]"
                : "border border-[var(--border)] bg-[var(--bg-card2)] text-[var(--txt-2)] hover:text-[var(--txt)]",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--txt-muted)]">Featured movers</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-[min(100%,480px)] shrink-0 flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--green)]">Top risers</span>
            <div className="flex flex-wrap gap-2">
              {risers.length === 0 ? (
                <span className="text-[12px] text-[var(--txt-muted)]">No data yet.</span>
              ) : (
                risers.map((p) => (
                  <span
                    key={p.playerId}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--green-light)] px-2.5 py-1 text-[12px] font-bold text-[var(--green)]"
                  >
                    ↑ {(p.scoreChangeWeek ?? 0).toFixed(1)}% · {p.name}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="flex min-w-[min(100%,480px)] shrink-0 flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--red-accent)]">Top fallers</span>
            <div className="flex flex-wrap gap-2">
              {fallers.length === 0 ? (
                <span className="text-[12px] text-[var(--txt-muted)]">No data yet.</span>
              ) : (
                fallers.map((p) => (
                  <span
                    key={p.playerId}
                    className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--red-accent)_12%,transparent)] px-2.5 py-1 text-[12px] font-bold text-[var(--red-accent)]"
                  >
                    ↓ {(p.scoreChangeWeek ?? 0).toFixed(1)}% · {p.name}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--txt-muted)]">All players</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((p) => (
            <GuruScoreCard key={p.playerId} player={p} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-6 text-center text-[14px] text-[var(--txt-muted)]">No players match your filters.</p>
        ) : null}
      </section>
    </div>
  );
}
