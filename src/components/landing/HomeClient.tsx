"use client";

import { useCallback, useEffect, useState } from "react";
import { awardXP, getSessionId, XP_ACTIONS } from "@/lib/xp/actions";

type TopRow = {
  user_session_id: string;
  display_name: string;
  weekly_xp: number;
  current_streak: number;
  longest_streak: number;
};

const XP_CARDS = [
  { icon: "⚡", amount: XP_ACTIONS.DAILY_STAT_GRID, label: "Daily Stat Grid" },
  { icon: "🔥", amount: XP_ACTIONS.DAILY_LOGIN_STREAK, label: "Login Streak" },
  { icon: "🧠", amount: XP_ACTIONS.TRIVIA_WIN, label: "Win Trivia Room" },
  { icon: "🔍", amount: XP_ACTIONS.AI_SEARCH, label: "Ask the Guru" },
  { icon: "🏆", amount: XP_ACTIONS.SALARY_CAP_WIN, label: "Salary Cap Win" },
  { icon: "🤝", amount: XP_ACTIONS.TRADE_VOTE, label: "Trade Vote" },
  { icon: "📊", amount: XP_ACTIONS.TIER_LIST_MADE, label: "Tier List Made" },
  { icon: "👑", amount: XP_ACTIONS.PERFECT_SCORE, label: "Perfect Score" },
];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function HomeClient() {
  const [top10, setTop10] = useState<TopRow[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userXP, setUserXP] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const loadBoard = useCallback(async (sid: string) => {
    const res = await fetch(`/api/leaderboard?sessionId=${encodeURIComponent(sid)}`);
    const j = (await res.json()) as {
      top10: TopRow[];
      activeTodayCount: number;
      userRank: number | null;
      userXP: number;
    };
    setTop10(j.top10 ?? []);
    setActiveCount(j.activeTodayCount ?? 0);
    setUserRank(j.userRank);
    setUserXP(j.userXP ?? 0);
  }, []);

  useEffect(() => {
    const sid = getSessionId();
    setSessionId(sid);
    void loadBoard(sid);

    const last = localStorage.getItem("last_visit_date");
    const t = todayKey();
    if (last !== t) {
      void (async () => {
        const amt = await awardXP(sid, "DAILY_VISIT", localStorage.getItem("guru_display_name") ?? undefined);
        if (amt > 0) {
          localStorage.setItem("last_visit_date", t);
          if (
            !localStorage.getItem("guru_display_name") &&
            !localStorage.getItem("guru_skip_display_name") &&
            !localStorage.getItem("guru_xp_modal_shown")
          ) {
            setShowNameModal(true);
          }
          void loadBoard(sid);
        }
      })();
    }
  }, [loadBoard]);

  async function saveDisplayName() {
    const name = nameInput.trim().slice(0, 20);
    if (name) {
      localStorage.setItem("guru_display_name", name);
      await fetch("/api/leaderboard/display-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, displayName: name }),
      });
    }
    localStorage.setItem("guru_xp_modal_shown", "1");
    setShowNameModal(false);
    void loadBoard(sessionId);
  }

  function skipName() {
    localStorage.setItem("guru_skip_display_name", "1");
    localStorage.setItem("guru_xp_modal_shown", "1");
    setShowNameModal(false);
  }

  return (
    <>
      <section className="border-t border-[var(--border)] bg-[var(--bg-base)] py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-[22px] font-extrabold text-[var(--txt)]">🏆 Community Leaderboard</h2>
            <p className="mt-1 text-[13px] text-[var(--txt-muted)]">This week&apos;s top Gurus · Resets Sunday</p>
            <ul className="mt-6 space-y-2">
              {top10.length === 0 ? (
                <li className="text-[13px] text-[var(--txt-muted)]">Play games or search to earn XP and appear here.</li>
              ) : (
                top10.map((row, i) => {
                  const rank = i + 1;
                  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`;
                  const isYou = row.user_session_id === sessionId;
                  const initials = row.display_name
                    .split(/\s+/)
                    .map((s) => s[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <li
                      key={row.user_session_id}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] ${
                        isYou
                          ? "border-[var(--green-border)] bg-[var(--green-light)]"
                          : "border-[var(--border)] bg-[var(--bg-card)]"
                      }`}
                    >
                      <span className="w-8 text-center font-bold text-[var(--txt-muted)]">{medal}</span>
                      <div
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                        style={{
                          background: `hsl(${(row.display_name.charCodeAt(0) * 13) % 360} 55% 42%)`,
                        }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-[var(--txt)]">
                          {row.display_name}
                          {isYou ? <span className="ml-2 text-[10px] text-[var(--green)]">YOU</span> : null}
                        </div>
                        {row.current_streak > 5 ? (
                          <div className="text-[10px] text-[var(--orange)]">🔥 {row.current_streak} streak</div>
                        ) : null}
                      </div>
                      <div className="text-right font-black tabular-nums text-[var(--green)]">{row.weekly_xp} XP</div>
                    </li>
                  );
                })
              )}
            </ul>
            {userRank != null ? (
              <p className="mt-4 text-[12px] text-[var(--txt-muted)]">
                Your rank: <span className="font-bold text-[var(--txt)]">#{userRank}</span> · Weekly XP:{" "}
                <span className="font-bold text-[var(--green)]">{userXP}</span>
              </p>
            ) : null}
            <p className="mt-2 text-[11px] text-[var(--txt-3)]">{activeCount} players active today</p>
          </div>

          <div>
            <h2 className="text-[22px] font-extrabold text-[var(--txt)]">Earn Guru XP</h2>
            <p className="mt-1 text-[13px] text-[var(--txt-muted)]">Engage to climb the leaderboard</p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3">
              {XP_CARDS.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-3 text-[12px]"
                >
                  <span className="text-[15px]">{c.icon}</span>
                  <span className="ml-1 font-bold text-[var(--green)]">+{c.amount} XP</span>
                  <div className="mt-1 text-[11px] text-[var(--txt-2)]">— {c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showNameModal ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--overlay-scrim)] p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-md)]">
            <h3 className="text-[18px] font-extrabold text-[var(--txt)]">You earned your first Guru XP! 🎉</h3>
            <p className="mt-2 text-[13px] text-[var(--txt-2)]">Set your display name for the leaderboard:</p>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value.slice(0, 20))}
              placeholder="Your name"
              className="mt-4 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3 text-[14px] text-[var(--txt)] outline-none ring-[var(--green)] focus:ring-2"
            />
            <button
              type="button"
              onClick={() => void saveDisplayName()}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-[var(--green)] text-[14px] font-semibold text-[var(--on-green)]"
            >
              Join the Leaderboard
            </button>
            <button type="button" onClick={skipName} className="mt-3 w-full text-center text-[12px] text-[var(--txt-muted)] underline">
              Skip for now
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
