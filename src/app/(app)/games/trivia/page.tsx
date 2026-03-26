"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSessionId } from "@/lib/xp/actions";

const CATS = ["All NFL", "Advanced Stats", "Fantasy Football", "Draft & Prospects", "NFL History"];

export default function TriviaLobbyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("All NFL");
  const [count, setCount] = useState(5);
  const [joinCode, setJoinCode] = useState("");
  const [joinName, setJoinName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function host() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/games/trivia/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: name.trim() || "Host",
          category,
          questionCount: count,
          hostSessionId: getSessionId(),
        }),
      });
      const j = (await res.json()) as { roomCode?: string; error?: string };
      if (!res.ok) {
        setErr(j.error ?? "Failed");
        return;
      }
      if (j.roomCode) router.push(`/games/trivia/${encodeURIComponent(j.roomCode)}`);
    } finally {
      setLoading(false);
    }
  }

  async function join() {
    setErr(null);
    setLoading(true);
    try {
      const code = joinCode.trim().toUpperCase();
      const res = await fetch("/api/games/trivia/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: code,
          displayName: joinName.trim() || "Player",
          userSessionId: getSessionId(),
        }),
      });
      const j = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setErr(j.error ?? "Failed");
        return;
      }
      if (j.ok) router.push(`/games/trivia/${encodeURIComponent(code)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/games" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
        ← Game Room
      </Link>
      <h1 className="mt-6 text-[28px] font-black text-[var(--txt)]">NFL Trivia Showdown</h1>
      <p className="mt-2 text-[14px] text-[var(--txt-2)]">Host a private room or join with a code.</p>

      {err ? <p className="mt-4 text-[13px] text-[var(--orange)]">{err}</p> : null}

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-[16px] font-bold text-[var(--txt)]">Host a Room</h2>
          <label className="mt-4 block text-[12px] font-semibold text-[var(--txt-muted)]">Display name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-[14px] text-[var(--txt)]"
          />
          <label className="mt-3 block text-[12px] font-semibold text-[var(--txt-muted)]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-[14px] text-[var(--txt)]"
          >
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="mt-3 block text-[12px] font-semibold text-[var(--txt-muted)]">Questions</label>
          <div className="mt-1 flex gap-2">
            {[5, 10, 15].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-bold ${count === n ? "bg-[var(--green)] text-[var(--on-green)]" : "border border-[var(--border)] bg-[var(--bg-card2)]"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => void host()}
            className="mt-6 h-11 w-full rounded-xl bg-[#2563eb] text-[14px] font-bold text-white"
          >
            Create Room
          </button>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-[16px] font-bold text-[var(--txt)]">Join a Room</h2>
          <label className="mt-4 block text-[12px] font-semibold text-[var(--txt-muted)]">Room code (e.g. NFL-ABC123)</label>
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 font-mono text-[14px] text-[var(--txt)]"
          />
          <label className="mt-3 block text-[12px] font-semibold text-[var(--txt-muted)]">Display name</label>
          <input
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-[14px] text-[var(--txt)]"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void join()}
            className="mt-6 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card2)] text-[14px] font-bold text-[var(--txt)]"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
