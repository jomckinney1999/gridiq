"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StatGridCellDef } from "@/lib/games/stat-grid-seed";
import { awardXP, getSessionId } from "@/lib/xp/actions";
import { cn } from "@/lib/utils";

const TIMER_SEC = 300;
const LIVES_START = 5;

function normalizeGuess(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, "");
}

function matchesCell(guess: string, cell: StatGridCellDef): boolean {
  const g = normalizeGuess(guess);
  if (!g) return false;
  const full = normalizeGuess(cell.answer);
  if (g === full) return true;
  return cell.aliases.some((a) => normalizeGuess(a) === g || full.includes(g) || g.includes(normalizeGuess(a)));
}

export default function StatGridPage() {
  const [cells, setCells] = useState<StatGridCellDef[]>([]);
  const [gameDate, setGameDate] = useState("");
  const [selected, setSelected] = useState<number | null>(0);
  const [guess, setGuess] = useState("");
  const [solved, setSolved] = useState<Record<number, string>>({});
  const [wrong, setWrong] = useState<string[]>([]);
  const [shake, setShake] = useState<number | null>(null);
  const [lives, setLives] = useState(LIVES_START);
  const [guesses, setGuesses] = useState(0);
  const [left, setLeft] = useState(TIMER_SEC);
  const [done, setDone] = useState(false);
  const awardedRef = useRef(false);

  useEffect(() => {
    fetch("/api/games/stat-grid/today")
      .then((r) => r.json())
      .then((d: { game_date: string; cells: StatGridCellDef[] }) => {
        setGameDate(d.game_date);
        setCells(Array.isArray(d.cells) ? d.cells : []);
      })
      .catch(() => setCells([]));
  }, []);

  useEffect(() => {
    if (done) return;
    const t = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(t);
          setDone(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [done]);

  const solvedCount = useMemo(() => Object.keys(solved).length, [solved]);

  useEffect(() => {
    if (solvedCount !== 12 || !cells.length || awardedRef.current) return;
    awardedRef.current = true;
    setDone(true);
    const sid = getSessionId();
    const perfect = lives === LIVES_START;
    void (async () => {
      await awardXP(sid, "DAILY_STAT_GRID", localStorage.getItem("guru_display_name") ?? undefined);
      if (perfect) await awardXP(sid, "PERFECT_SCORE", localStorage.getItem("guru_display_name") ?? undefined);
    })();
    const streakKey = "stat_grid_streak";
    const prev = parseInt(localStorage.getItem(streakKey) ?? "0", 10);
    localStorage.setItem(streakKey, String(prev + 1));
  }, [solvedCount, cells.length, lives]);

  const submit = useCallback(() => {
    if (done || selected == null || !cells[selected]) return;
    if (solved[selected]) return;
    const cell = cells[selected]!;
    setGuesses((g) => g + 1);
    if (matchesCell(guess, cell)) {
      setSolved((s) => ({ ...s, [selected]: cell.answer }));
      setGuess("");
    } else {
      setLives((l) => Math.max(0, l - 1));
      setWrong((w) => [...w, guess.trim() || "(empty)"]);
      setShake(selected);
      window.setTimeout(() => setShake(null), 500);
      setGuess("");
    }
  }, [cells, done, guess, selected, solved]);

  const mm = Math.floor(left / 60);
  const ss = left % 60;

  const shareText = `⚡ NFL Stat Guru Stat Grid — ${gameDate}
Solved: ${solvedCount}/12 in ${mm}:${String(ss).padStart(2, "0")} with ${lives} lives left 🏈
nflstatguru.vercel.app/games/stat-grid`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/games" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
        ← Game Room
      </Link>

      <header className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-[var(--txt)]">⚡ Stat Grid</h1>
          <p className="text-[12px] text-[var(--txt-muted)]">{gameDate}</p>
        </div>
        <div className="flex items-center gap-4 text-[13px]">
          <span className="text-[var(--txt-2)]">
            {"❤️".repeat(lives)}
            {"🤍".repeat(LIVES_START - lives)}
          </span>
          <span className="font-mono font-bold tabular-nums text-[var(--txt)]">
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </span>
        </div>
      </header>

      <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--green)_35%,transparent)] bg-[var(--green-light)] px-4 py-3 text-[13px] text-[var(--txt)]">
        Each cell shows a 2024 NFL stat line. Type the player&apos;s name to claim the cell.
      </div>

      <p className="mt-3 text-[13px] text-[var(--txt-muted)]">
        Progress: {solvedCount} / 12 solved · {guesses} guesses
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Player name…"
          className="h-11 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-[14px] text-[var(--txt)] outline-none ring-[var(--green)] focus:ring-2"
        />
        <button
          type="button"
          onClick={submit}
          className="h-11 shrink-0 rounded-xl bg-[var(--green)] px-5 text-[13px] font-bold text-[var(--on-green)]"
        >
          Submit →
        </button>
      </div>

      {selected != null && cells[selected] ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["💡 Position", cells[selected].hints.position],
              ["🏟 Team", cells[selected].hints.team],
              ["🔤 Initial", cells[selected].hints.initial],
              ["📅 Year", cells[selected].hints.year],
            ] as const
          ).map(([lab, val]) => (
            <span
              key={lab}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-card2)] px-2.5 py-1 text-[11px] text-[var(--txt-2)]"
            >
              {lab} {val}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {cells.map((c) => {
          const isSel = selected === c.pos;
          const ok = solved[c.pos];
          return (
            <button
              key={c.pos}
              type="button"
              onClick={() => setSelected(c.pos)}
              className={cn(
                "rounded-xl border p-3 text-left transition",
                ok ? "border-[var(--green-border)] bg-[color-mix(in_srgb,var(--green)_18%,transparent)]" : "border-[var(--border)] bg-[var(--bg-card)]",
                isSel && !ok ? "ring-2 ring-[var(--green)]" : "",
                shake === c.pos && "animate-[shake_0.4s_ease-in-out]",
              )}
            >
              <div className="text-[9px] font-bold uppercase tracking-wide text-[var(--txt-muted)]">{c.label}</div>
              <div className="mt-1 text-[18px] font-black text-[var(--green)]">{c.value}</div>
              <div className="mt-0.5 text-[9px] text-[var(--txt-muted)]">{c.context}</div>
              {ok ? (
                <div className="mt-2 text-[11px] font-bold text-[var(--txt)]">
                  {ok} ✓
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      {wrong.length ? (
        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase text-[var(--txt-muted)]">Wrong guesses</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {wrong.map((w, i) => (
              <span key={i} className="rounded-md bg-[var(--bg-subtle-2)] px-2 py-0.5 text-[11px] text-[var(--txt-2)]">
                {w}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {solvedCount === 12 ? (
        <div className="mt-8 rounded-xl border border-[var(--green-border)] bg-[var(--green-light)] p-4">
          <p className="font-bold text-[var(--green)]">Grid cleared!</p>
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(shareText)}
            className="mt-3 text-[12px] font-semibold text-[var(--txt)] underline"
          >
            Copy share text
          </button>
        </div>
      ) : null}

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </div>
  );
}
