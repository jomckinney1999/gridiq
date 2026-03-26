"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { awardXP, getSessionId } from "@/lib/xp/actions";

type Ans = { q: string; a: string };

type Guess = {
  player: string;
  position: string;
  team: string;
  confidence: number;
  reasoning: string;
  fun_fact: string;
};

function GuruSvg() {
  return (
    <svg viewBox="0 0 120 120" className="mx-auto h-[120px] w-[120px]" aria-hidden>
      <circle cx="60" cy="60" r="58" fill="#0d1a0d" stroke="rgba(0,255,135,0.12)" strokeWidth="4" />
      <ellipse cx="60" cy="52" rx="28" ry="30" fill="#1a3d2a" />
      <ellipse cx="60" cy="38" rx="22" ry="16" fill="#0f2d18" />
      <circle cx="52" cy="36" r="3" fill="#00ff87" />
      <circle cx="68" cy="36" r="3" fill="#00ff87" />
      <path d="M52 48 Q60 54 68 48" stroke="#8fd4a8" strokeWidth="2" fill="none" />
      <circle cx="60" cy="22" r="8" fill="#ff6b2b" />
      <path d="M75 70 L82 58" stroke="#2d5a3d" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function GuruMindReaderPage() {
  const [phase, setPhase] = useState<"intro" | "playing" | "reveal" | "correct" | "wrong">("intro");
  const [answers, setAnswers] = useState<Ans[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [wrongName, setWrongName] = useState("");

  const fetchQuestion = useCallback(async (hist: Ans[]) => {
    const res = await fetch("/api/games/guru-mind-reader", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "question", answers: hist }),
    });
    const j = (await res.json()) as { question?: string };
    setQ(j.question ?? "");
  }, []);

  const fetchGuess = useCallback(async (hist: Ans[]) => {
    const res = await fetch("/api/games/guru-mind-reader", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "guess", answers: hist }),
    });
    return (await res.json()) as Guess & { error?: string };
  }, []);

  async function start() {
    setPhase("playing");
    setLoading(true);
    try {
      await fetchQuestion([]);
    } finally {
      setLoading(false);
    }
  }

  async function answer(label: string) {
    if (!q || loading) return;
    const hist = [...answers, { q, a: label }];
    setAnswers(hist);
    setLoading(true);
    try {
      if (hist.length >= 20) {
        const g = await fetchGuess(hist);
        setGuess(g.player ? g : { player: "Unknown", position: "?", team: "?", confidence: 0, reasoning: "", fun_fact: "" });
        setPhase("reveal");
        return;
      }
      if (hist.length === 8) {
        const g = await fetchGuess(hist);
        if (g.player && g.confidence > 75) {
          setGuess(g);
          setPhase("reveal");
          return;
        }
      }
      await fetchQuestion(hist);
    } finally {
      setLoading(false);
    }
  }

  async function logEnd(wasCorrect: boolean) {
    await fetch("/api/games/mind-reader-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        questions: answers,
        guess: guess?.player,
        wasCorrect,
        playerWas: wrongName || null,
        questionsToSolve: answers.length,
      }),
    }).catch(() => {});
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 text-center sm:px-6">
      <Link href="/games" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
        ← Game Room
      </Link>

      {phase === "intro" ? (
        <div className="mt-8">
          <GuruSvg />
          <h1 className="mt-6 text-[24px] font-black text-[var(--txt)]">Think of any NFL player.</h1>
          <p className="mt-2 text-[14px] text-[var(--txt-2)]">Past or present. Legend or rookie. I will find them.</p>
          <p className="mt-4 text-[12px] text-[var(--txt-muted)]">Mahomes · Jerry Rice · A 2025 Draft Prospect</p>
          <button
            type="button"
            onClick={() => void start()}
            className="mt-8 h-12 w-full rounded-full bg-[var(--green)] text-[15px] font-bold text-[var(--on-green)]"
          >
            I&apos;m thinking of someone →
          </button>
          <p className="mt-4 text-[11px] text-[var(--txt-3)]">The Guru has identified 12,847 players</p>
        </div>
      ) : null}

      {phase === "playing" ? (
        <div className="mt-6 text-left">
          <GuruSvg />
          <p className="mt-2 text-center text-[12px] text-[var(--txt-muted)]">Question {answers.length + 1} of 20</p>
          <div className="mt-4 min-h-[4rem] rounded-xl border border-[var(--green-border)] bg-[var(--green-light)] p-4 text-[15px] text-[var(--txt)]">
            {loading ? <span className="animate-pulse">Consulting the archives…</span> : q || "—"}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(
              [
                ["✓ Yes", "Yes"],
                ["✗ No", "No"],
                ["~ Probably", "Probably"],
                ["? Not sure", "Not sure"],
              ] as const
            ).map(([lab, val]) => (
              <button
                key={val}
                type="button"
                disabled={loading || !q}
                onClick={() => void answer(val)}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-3 text-[13px] font-semibold disabled:opacity-40"
              >
                {lab}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "reveal" && guess ? (
        <div className="mt-8">
          <p className="animate-pulse text-[14px] text-[var(--txt-muted)]">I have identified your player…</p>
          <h2 className="mt-4 text-[28px] font-black text-[var(--txt)]">{guess.player}</h2>
          <p className="text-[13px] text-[var(--txt-2)]">
            {guess.position} · {guess.team}
          </p>
          <p className="mt-2 text-[12px] font-bold text-[var(--green)]">{guess.confidence}% confidence</p>
          <p className="mt-4 text-left text-[13px] text-[var(--txt)]">{guess.reasoning}</p>
          <div className="mt-4 rounded-xl border border-[var(--green-border)] bg-[var(--green-light)] p-3 text-left text-[12px]">{guess.fun_fact}</div>
          <button
            type="button"
            onClick={() => {
              setPhase("correct");
              void awardXP(getSessionId(), "MIND_READER_PLAY", localStorage.getItem("guru_display_name") ?? undefined);
              void logEnd(true);
            }}
            className="mt-4 w-full rounded-xl bg-[var(--green)] py-3 text-[14px] font-bold text-[var(--on-green)]"
          >
            Yes, that&apos;s correct! 🎉
          </button>
          <button
            type="button"
            onClick={() => {
              setPhase("wrong");
              void logEnd(false);
            }}
            className="mt-2 w-full rounded-xl border border-[var(--border)] py-3 text-[14px] font-semibold"
          >
            No, that&apos;s wrong…
          </button>
        </div>
      ) : null}

      {phase === "correct" ? (
        <div className="mt-8">
          <h2 className="text-[22px] font-bold text-[var(--txt)]">The Guru is all-knowing 🧘</h2>
          <p className="mt-2 text-[14px] text-[var(--txt-2)]">Identified in {answers.length} questions</p>
          <button
            type="button"
            onClick={() =>
              void navigator.clipboard.writeText(
                `The NFL Guru identified ${guess?.player ?? "?"} in ${answers.length} questions! Can you stump him? 🤔 nflstatguru.vercel.app/games/guru-mind-reader`,
              )
            }
            className="mt-6 w-full rounded-xl border border-[var(--border)] py-3 text-[13px] font-semibold"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => {
              setPhase("intro");
              setAnswers([]);
              setGuess(null);
              setQ("");
            }}
            className="mt-3 w-full rounded-xl bg-[var(--green)] py-3 text-[14px] font-bold text-[var(--on-green)]"
          >
            Play Again
          </button>
        </div>
      ) : null}

      {phase === "wrong" ? (
        <div className="mt-8 text-left">
          <h2 className="text-[20px] font-bold text-[var(--txt)]">You defeated the Guru... for now.</h2>
          <label className="mt-4 block text-[12px] font-semibold text-[var(--txt-muted)]">Who were you thinking of?</label>
          <input
            value={wrongName}
            onChange={(e) => setWrongName(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-[var(--txt)]"
          />
          <button
            type="button"
            onClick={() => {
              void logEnd(false);
              setPhase("intro");
              setAnswers([]);
              setGuess(null);
              setQ("");
              setWrongName("");
            }}
            className="mt-4 w-full rounded-xl bg-[var(--orange)] py-3 text-[14px] font-bold text-white"
          >
            Submit & Play Again
          </button>
        </div>
      ) : null}
    </div>
  );
}
