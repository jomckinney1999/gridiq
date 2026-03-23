"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StatGridCell } from "@/components/trivia/StatGridCell";
import { getEasternDateString, getYesterdayEastern } from "@/lib/date";
import { matchesStatGridAnswer } from "@/lib/stat-grid/match-answer";
import type { StatGridPuzzle } from "@/types/stat-grid";

const STORAGE_GAME = "statGrid:v1";
const STORAGE_STREAK = "statGridStreak:v1";

const HINT_KEYS = ["position", "team", "initial", "year"] as const;
type HintKey = (typeof HINT_KEYS)[number];

type PersistedGame = {
  gameDate: string;
  lives: number;
  solved: number[];
  wrongGuesses: string[];
  hints: Record<string, string[]>;
  selectedCell: number | null;
  guessCount: number;
  timerEnd: number;
  startTime: number;
  completed: boolean;
  gaveUp: boolean;
  /** Seconds from game start to finish; set when the run ends. */
  elapsedSec: number | null;
};
type StreakData = { streak: number; lastDate: string | null };

function loadGame(): PersistedGame | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_GAME);
    if (!raw) return null;
    const p = JSON.parse(raw) as PersistedGame;
    const today = getEasternDateString();
    if (p.gameDate !== today) return null;
    return p;
  } catch {
    return null;
  }
}

function saveGame(p: PersistedGame) {
  localStorage.setItem(STORAGE_GAME, JSON.stringify(p));
}

function loadStreak(): StreakData {
  if (typeof window === "undefined") return { streak: 0, lastDate: null };
  try {
    const raw = localStorage.getItem(STORAGE_STREAK);
    if (!raw) return { streak: 0, lastDate: null };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { streak: 0, lastDate: null };
  }
}

function recordStreakIfNeeded() {
  const today = getEasternDateString();
  const prev = loadStreak();
  if (prev.lastDate === today) return;
  const y = getYesterdayEastern();
  const nextStreak = prev.lastDate === y ? (prev.streak ?? 0) + 1 : 1;
  localStorage.setItem(STORAGE_STREAK, JSON.stringify({ streak: nextStreak, lastDate: today }));
}

function formatTimer(sec: number): string {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function buildShareText(
  gameDate: string,
  solved: number,
  elapsedSec: number,
  livesLeft: number,
  origin: string,
): string {
  const d = new Date(`${gameDate}T12:00:00`);
  const month = d.toLocaleString("en-US", { month: "long" });
  const day = d.getDate();
  const mm = Math.floor(elapsedSec / 60);
  const ss = elapsedSec % 60;
  const timeStr = `${mm}:${ss.toString().padStart(2, "0")}`;
  const base = origin.replace(/\/$/, "");
  return `⚡ NFL Stat Guru Stat Grid — ${month} ${day}\nSolved: ${solved}/12 in ${timeStr} with ${livesLeft} lives left 🏈\n${base}/trivia`;
}

export default function StatGridPage() {
  const [puzzle, setPuzzle] = useState<StatGridPuzzle | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lives, setLives] = useState(5);
  const [solved, setSolved] = useState<number[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [hints, setHints] = useState<Record<number, string[]>>({});
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [guess, setGuess] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [timerEnd, setTimerEnd] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(300);
  const [completed, setCompleted] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [shakeCell, setShakeCell] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const streakRecorded = useRef(false);

  useEffect(() => {
    setStreak(loadStreak().streak);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stat-grid");
        if (!res.ok) throw new Error("Failed to load puzzle");
        const data = (await res.json()) as StatGridPuzzle & { source?: string };
        if (cancelled) return;
        const cells = [...data.cells].sort((a, b) => a.position - b.position);
        setPuzzle({ game_date: data.game_date, cells });
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!puzzle) return;
    const saved = loadGame();
    if (saved && saved.gameDate === puzzle.game_date) {
      setLives(saved.lives);
      setSolved(saved.solved);
      setWrongGuesses(saved.wrongGuesses);
      const h: Record<number, string[]> = {};
      Object.entries(saved.hints).forEach(([k, v]) => {
        h[Number(k)] = v;
      });
      setHints(h);
      setSelectedCell(saved.selectedCell);
      setGuessCount(saved.guessCount);
      setTimerEnd(saved.timerEnd);
      setStartTime(saved.startTime);
      setCompleted(saved.completed);
      setGaveUp(saved.gaveUp);
      setElapsedSec(
        typeof saved.elapsedSec === "number" ? saved.elapsedSec : null,
      );
      return;
    }
    const now = Date.now();
    const end = now + 5 * 60 * 1000;
    setTimerEnd(end);
    setStartTime(now);
    setRemaining(300);
    setElapsedSec(null);
  }, [puzzle]);

  useEffect(() => {
    if (!timerEnd || completed) return;
    const tick = () => {
      const rem = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
      setRemaining(rem);
      if (rem <= 0) {
        setCompleted(true);
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [timerEnd, completed]);

  useEffect(() => {
    if (!completed && !gaveUp) return;
    if (!startTime) return;
    setElapsedSec((e) => {
      if (e !== null) return e;
      const raw = Math.floor((Date.now() - startTime) / 1000);
      if (raw > 600) return 300;
      return Math.min(300, raw);
    });
  }, [completed, gaveUp, startTime]);

  useEffect(() => {
    if (!puzzle || !timerEnd || !startTime) return;
    const p: PersistedGame = {
      gameDate: puzzle.game_date,
      lives,
      solved,
      wrongGuesses,
      hints: Object.fromEntries(Object.entries(hints).map(([k, v]) => [k, v])),
      selectedCell,
      guessCount,
      timerEnd,
      startTime,
      completed,
      gaveUp,
      elapsedSec,
    };
    saveGame(p);
  }, [
    puzzle,
    lives,
    solved,
    wrongGuesses,
    hints,
    selectedCell,
    guessCount,
    timerEnd,
    startTime,
    completed,
    gaveUp,
    elapsedSec,
  ]);

  useEffect(() => {
    if (!puzzle || completed || gaveUp) return;
    if (solved.length >= 12) {
      setCompleted(true);
    }
  }, [puzzle, solved, completed, gaveUp]);

  useEffect(() => {
    if (!puzzle || completed || gaveUp) return;
    if (lives <= 0) {
      setCompleted(true);
    }
  }, [lives, puzzle, completed, gaveUp]);

  useEffect(() => {
    if (!completed && !gaveUp) return;
    if (streakRecorded.current) return;
    streakRecorded.current = true;
    recordStreakIfNeeded();
    setStreak(loadStreak().streak);
  }, [completed, gaveUp]);

  const cellsByIndex = useMemo(() => {
    if (!puzzle) return [];
    return puzzle.cells.slice(0, 12);
  }, [puzzle]);

  const solvedSet = useMemo(() => new Set(solved), [solved]);

  const submitGuess = useCallback(() => {
    if (!puzzle || completed || gaveUp) return;
    if (selectedCell === null) {
      setShakeInput(true);
      window.setTimeout(() => setShakeInput(false), 450);
      return;
    }
    const g = guess.trim();
    if (!g) return;

    const cell = cellsByIndex[selectedCell];
    if (!cell || solvedSet.has(selectedCell)) return;

    setGuessCount((c) => c + 1);
    const ok = matchesStatGridAnswer(g, cell.answer, cell.answer_aliases);
    if (ok) {
      setSolved((s) => [...new Set([...s, selectedCell])]);
      setGuess("");
      setSelectedCell(null);
    } else {
      setLives((l) => Math.max(0, l - 1));
      setWrongGuesses((w) => (w.includes(g) ? w : [...w, g]));
      setShakeCell(selectedCell);
      window.setTimeout(() => setShakeCell(null), 450);
    }
  }, [puzzle, completed, gaveUp, selectedCell, guess, cellsByIndex, solvedSet]);

  const revealHint = useCallback(
    (key: HintKey) => {
      if (selectedCell === null || !puzzle) return;
      setHints((prev) => {
        const cur = prev[selectedCell] ?? [];
        if (cur.includes(key)) return prev;
        return { ...prev, [selectedCell]: [...cur, key] };
      });
    },
    [selectedCell, puzzle],
  );

  const handleGiveUp = useCallback(() => {
    setGaveUp(true);
    setCompleted(true);
  }, []);

  const handleShare = useCallback(() => {
    if (!puzzle) return;
    const elapsed =
      elapsedSec !== null
        ? elapsedSec
        : startTime
          ? Math.min(300, Math.floor((Date.now() - startTime) / 1000))
          : 0;
    const livesLeft = lives;
    const text = buildShareText(
      puzzle.game_date,
      solved.length,
      elapsed,
      livesLeft,
      typeof window !== "undefined" ? window.location.origin : "",
    );
    void navigator.clipboard.writeText(text);
  }, [puzzle, startTime, lives, solved.length, elapsedSec]);

  const showResults = completed;

  const selectedHints = selectedCell !== null ? hints[selectedCell] ?? [] : [];

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-[#ff6b2b]">
        {loadError}
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 rounded bg-[rgba(255,255,255,0.06)]" />
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-[rgba(255,255,255,0.04)]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const dateLabel = new Date(`${puzzle.game_date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-[-0.5px] text-[#f2f2f5]">
            ⚡ Stat Grid
          </h1>
          <p className="text-[12px] text-[#8888a0]">{dateLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 text-[18px]" aria-label={`${lives} lives`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < lives ? "opacity-100" : "opacity-25 grayscale"}>
                ❤️
              </span>
            ))}
          </div>
          <div
            className="rounded-lg border border-[rgba(0,255,135,0.25)] bg-[rgba(0,255,135,0.08)] px-3 py-1.5 font-mono text-[18px] font-bold tabular-nums text-[#00ff87]"
            suppressHydrationWarning
          >
            {formatTimer(remaining)}
          </div>
          <div className="text-[12px] text-[#8888a0]">
            Streak: <span className="font-semibold text-[#f2f2f5]">{streak}</span>
          </div>
        </div>
      </header>

      <div className="mt-4 rounded-xl border border-[rgba(0,255,135,0.2)] bg-[rgba(0,255,135,0.06)] px-4 py-3 text-[13px] leading-relaxed text-[#b8b8c8]">
        Guess the player behind each stat line. Same puzzle for everyone today. Wrong answers cost a
        life. You have four free hints per cell (position, team, initial, year).
      </div>

      <p className="mt-3 text-[13px] text-[#8888a0]">
        Progress:{" "}
        <span className="font-semibold text-[#f2f2f5]">
          {solved.length} / 12 solved
        </span>{" "}
        · <span className="font-semibold text-[#f2f2f5]">{guessCount}</span> guesses
      </p>

      {showResults ? (
        <div className="mt-8 space-y-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0d0d10] p-6">
          <h2 className="text-[18px] font-bold text-[#f2f2f5]">
            {gaveUp
              ? "Puzzle ended"
              : solved.length >= 12
                ? "Perfect grid!"
                : lives <= 0
                  ? "Out of lives"
                  : "Time's up!"}
          </h2>
          <p className="text-[14px] text-[#8888a0]">
            You solved {solved.length}/12. Streak: {streak} days.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {cellsByIndex.map((c, i) => (
              <div
                key={c.position}
                className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#111116] p-2 text-[11px]"
              >
                <div className="text-[#44445a]">{c.stat_label}</div>
                <div className="font-semibold text-[#f2f2f5]">{c.answer}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full bg-[#00ff87] px-5 py-2 text-[13px] font-semibold text-[#050507] transition hover:brightness-110"
            >
              Share
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#44445a]">
                Player name
              </label>
              <div
                className={`mt-1 flex gap-2 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0d0d10] px-3 py-2 ${
                  shakeInput ? "animate-[stat-grid-shake_0.45s_ease-in-out]" : ""
                }`}
              >
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitGuess();
                  }}
                  placeholder={
                    selectedCell === null ? "Select a cell first" : "Last name or full name"
                  }
                  className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#f2f2f5] outline-none placeholder:text-[#44445a]"
                  disabled={completed}
                />
                <button
                  type="button"
                  onClick={submitGuess}
                  disabled={completed}
                  className="shrink-0 rounded-lg bg-[#00ff87] px-4 py-2 text-[13px] font-bold text-[#050507] transition hover:brightness-110 disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#44445a]">
              Hints (selected cell)
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {HINT_KEYS.map((key) => {
                const active = selectedHints.includes(key);
                const label =
                  key === "position"
                    ? "Position"
                    : key === "team"
                      ? "Team"
                      : key === "initial"
                        ? "First Initial"
                        : "Year";
                const cell = selectedCell !== null ? cellsByIndex[selectedCell] : null;
                const text =
                  cell && active
                    ? key === "position"
                      ? cell.hints.position
                      : key === "team"
                        ? cell.hints.team
                        : key === "initial"
                          ? cell.hints.initial
                          : cell.hints.year
                    : null;
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={selectedCell === null || completed}
                      onClick={() => revealHint(key)}
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                        active
                          ? "border-[rgba(0,255,135,0.45)] bg-[rgba(0,255,135,0.12)] text-[#00ff87]"
                          : "border-[rgba(255,255,255,0.1)] bg-[#111116] text-[#8888a0] hover:border-[rgba(255,255,255,0.2)]"
                      }`}
                    >
                      {label}
                    </button>
                    {text ? (
                      <span className="max-w-[140px] text-[10px] text-[#b8b8c8]">{text}</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {cellsByIndex.map((cell, i) => (
              <StatGridCell
                key={cell.position}
                cell={cell}
                index={i}
                selected={selectedCell === i}
                solved={solvedSet.has(i)}
                shake={shakeCell === i}
                onSelect={() => {
                  if (solvedSet.has(i)) return;
                  setSelectedCell(i);
                }}
              />
            ))}
          </div>

          {wrongGuesses.length > 0 ? (
            <div className="mt-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#44445a]">
                Wrong guesses
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {wrongGuesses.map((w) => (
                  <span
                    key={w}
                    className="rounded-full border border-[rgba(255,107,43,0.35)] bg-[rgba(255,107,43,0.1)] px-2.5 py-1 text-[11px] text-[#ff6b2b]"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGiveUp}
              className="rounded-full border border-[rgba(255,255,255,0.12)] px-5 py-2 text-[13px] font-semibold text-[#8888a0] transition hover:bg-[rgba(255,255,255,0.04)]"
            >
              Give Up
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full border border-[rgba(0,255,135,0.25)] px-5 py-2 text-[13px] font-semibold text-[#00ff87] transition hover:bg-[rgba(0,255,135,0.08)]"
            >
              Share
            </button>
          </div>
        </>
      )}
    </div>
  );
}
