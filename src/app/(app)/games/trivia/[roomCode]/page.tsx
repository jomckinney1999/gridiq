"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { awardXP, getSessionId } from "@/lib/xp/actions";
import { cn } from "@/lib/utils";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type PlayerRow = { user_session_id: string; display_name: string; score: number };

type Q = {
  id: string;
  question: string;
  answers: string[];
  correct_index: number;
  explanation: string;
};

export default function TriviaRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = decodeURIComponent((params.roomCode as string) ?? "").toUpperCase();
  const sid = getSessionId();
  const xpSent = useRef(false);

  const [session, setSession] = useState<{
    status: string;
    host_session_id: string;
    game_data: Record<string, unknown>;
  } | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [question, setQuestion] = useState<Q | null>(null);
  const [left, setLeft] = useState(20);
  const [picked, setPicked] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/games/trivia/session/${encodeURIComponent(roomCode)}`);
    if (!res.ok) return;
    const j = (await res.json()) as {
      session: { status: string; host_session_id: string; game_data: Record<string, unknown> };
      players: PlayerRow[];
      currentQuestion: Q | null;
    };
    setSession(j.session);
    setPlayers(j.players ?? []);
    setQuestion(j.currentQuestion);
    const gd = j.session.game_data as { deadline?: number; revealed?: boolean };
    if (gd.deadline && !gd.revealed) {
      const ms = Math.max(0, gd.deadline - Date.now());
      setLeft(Math.ceil(ms / 1000));
    }
  }, [roomCode]);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 2000);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (!url || !anon) return;
    const sb = createClient(url, anon);
    const ch = sb
      .channel(`room-${roomCode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_sessions", filter: `room_code=eq.${roomCode}` },
        () => void load(),
      )
      .subscribe();
    return () => {
      void sb.removeChannel(ch);
    };
  }, [roomCode, load]);

  useEffect(() => {
    const gd = session?.game_data as { phase?: string; deadline?: number; revealed?: boolean } | undefined;
    if (gd?.phase !== "question" || gd.revealed) return;
    const t = window.setInterval(() => {
      const d = (session?.game_data as { deadline?: number })?.deadline;
      if (!d) return;
      const s = Math.max(0, Math.ceil((d - Date.now()) / 1000));
      setLeft(s);
    }, 250);
    return () => window.clearInterval(t);
  }, [session]);

  const isHost = session?.host_session_id === sid;
  const gd = session?.game_data as
    | {
        phase?: string;
        questionIndex?: number;
        questionIds?: string[];
        revealed?: boolean;
        scores?: Record<string, number>;
      }
    | undefined;

  async function start() {
    await fetch("/api/games/trivia/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode, hostSessionId: sid }),
    });
    void load();
  }

  async function submitAnswer(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    await fetch("/api/games/trivia/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomCode,
        userSessionId: sid,
        answerIndex: idx,
        timeLeftSec: left,
      }),
    });
    void load();
  }

  async function advance() {
    await fetch("/api/games/trivia/advance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode, hostSessionId: sid }),
    });
    setPicked(null);
    void load();
  }

  useEffect(() => {
    if (session?.status !== "ended" || !session.game_data || xpSent.current) return;
    xpSent.current = true;
    const scores = (session.game_data as { scores?: Record<string, number> }).scores ?? {};
    const best = Math.max(0, ...Object.values(scores));
    const mine = scores[sid] ?? 0;
    void (async () => {
      await awardXP(sid, "TRIVIA_PARTICIPATION", localStorage.getItem("guru_display_name") ?? undefined);
      if (mine === best && best > 0) {
        await awardXP(sid, "TRIVIA_WIN", localStorage.getItem("guru_display_name") ?? undefined);
      }
      const ids = (session.game_data as { questionIds?: string[] }).questionIds ?? [];
      const perfect = ids.length > 0 && mine >= ids.length * 500;
      if (perfect) await awardXP(sid, "TRIVIA_PERFECT", localStorage.getItem("guru_display_name") ?? undefined);
    })();
  }, [session, sid]);

  const pct = Math.min(1, left / 20);
  const barColor = pct > 0.5 ? "var(--green)" : pct > 0.25 ? "var(--orange)" : "var(--red-accent)";

  if (!session) {
    return (
      <div className="px-4 py-16 text-center text-[var(--txt-muted)]">
        Loading room…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/games/trivia" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
        ← Trivia
      </Link>

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase text-[var(--txt-muted)]">Room</p>
            <p className="font-mono text-[22px] font-black text-[var(--txt)]">{roomCode}</p>
          </div>
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(roomCode)}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-[12px] font-semibold"
          >
            Copy code
          </button>
        </div>
        <p className="mt-2 text-[12px] text-[var(--txt-muted)]">Share with friends — they join from the trivia hub.</p>

        <ul className="mt-6 space-y-2">
          {players.map((p) => (
            <li key={p.user_session_id} className="flex items-center gap-3 text-[13px]">
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-white"
                style={{ background: `hsl(${(p.display_name.charCodeAt(0) * 11) % 360} 60% 40%)` }}
              >
                {p.display_name.slice(0, 2).toUpperCase()}
              </span>
              <span className="flex-1 font-semibold text-[var(--txt)]">{p.display_name}</span>
              <span className="tabular-nums text-[var(--green)]">{p.score} pts</span>
            </li>
          ))}
        </ul>

        {session.status === "waiting" && isHost ? (
          <button
            type="button"
            onClick={() => void start()}
            disabled={players.length < 2}
            className="mt-6 h-11 w-full rounded-xl bg-[var(--green)] text-[14px] font-bold text-[var(--on-green)] disabled:opacity-40"
          >
            Start Game (2+ players)
          </button>
        ) : null}

        {gd?.phase === "question" && question ? (
          <div className="mt-8">
            <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-subtle-2)]">
              <div className="h-full transition-all" style={{ width: `${pct * 100}%`, background: barColor }} />
            </div>
            <p className="text-[11px] text-[var(--txt-muted)]">
              Q{(gd.questionIndex ?? 0) + 1} / {(gd.questionIds ?? []).length} · {left}s
            </p>
            <h2 className="mt-4 text-[18px] font-bold text-[var(--txt)]">{question.question}</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {question.answers.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={picked !== null || !!gd.revealed}
                  onClick={() => void submitAnswer(i)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left text-[13px] font-semibold",
                    picked === i ? "border-[var(--green)] bg-[var(--green-light)]" : "border-[var(--border)] bg-[var(--bg-base)]",
                  )}
                >
                  {String.fromCharCode(65 + i)}. {a}
                </button>
              ))}
            </div>
            {gd.revealed ? (
              <p className="mt-4 text-[13px] text-[var(--txt-2)]">
                Correct: {String.fromCharCode(65 + question.correct_index)} — {question.explanation}
              </p>
            ) : null}
            {isHost && gd.revealed ? (
              <button type="button" onClick={() => void advance()} className="mt-4 w-full rounded-xl bg-[#2563eb] py-3 text-[13px] font-bold text-white">
                Next question
              </button>
            ) : null}
            {isHost && !gd.revealed ? (
              <button type="button" onClick={() => void advance()} className="mt-4 w-full rounded-xl bg-[var(--orange)] py-3 text-[13px] font-bold text-white">
                Reveal & score
              </button>
            ) : null}
          </div>
        ) : null}

        {session.status === "ended" ? (
          <div className="mt-8 text-center">
            <p className="text-[18px] font-bold text-[var(--txt)]">Final scores</p>
            <button type="button" onClick={() => router.push("/games/trivia")} className="mt-4 text-[var(--green)] underline">
              Play again
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
