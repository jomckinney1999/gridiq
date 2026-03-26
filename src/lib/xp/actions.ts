import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  url && anon
    ? createClient(url, anon, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export const XP_ACTIONS = {
  DAILY_STAT_GRID: 50,
  DAILY_LOGIN_STREAK: 25,
  TRIVIA_WIN: 100,
  TRIVIA_PARTICIPATION: 25,
  TRIVIA_PERFECT: 200,
  AI_SEARCH: 10,
  SALARY_CAP_WIN: 75,
  TRADE_VOTE: 30,
  TIER_LIST_MADE: 20,
  PERFECT_SCORE: 200,
  PICK6_PERFECT: 150,
  SURVIVOR_SURVIVE: 40,
  WHO_AM_I_FIRST_CLUE: 100,
  WHO_AM_I_COMPLETE: 20,
  DAILY_VISIT: 5,
  SHARE_CONTENT: 15,
  WEEKLY_TOP_10: 250,
  GURU_STUMPED: 50,
  MIND_READER_PLAY: 15,
} as const;

const SESSION_KEY = "guru_session_id";
const LEGACY_SESSION = "gridiq_guru_session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = window.localStorage.getItem(LEGACY_SESSION);
      if (id) window.localStorage.setItem(SESSION_KEY, id);
    }
    if (!id) {
      id = `guest_${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `guest_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export async function awardXP(
  sessionId: string,
  action: keyof typeof XP_ACTIONS,
  displayName?: string,
): Promise<number> {
  const amount = XP_ACTIONS[action];
  if (!supabase || sessionId === "server") {
    return amount;
  }
  try {
    await supabase.from("xp_ledger").insert({
      user_session_id: sessionId,
      xp_amount: amount,
      action,
    });

    const { data: existing } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("user_session_id", sessionId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("leaderboard")
        .update({
          total_xp: (existing.total_xp ?? 0) + amount,
          weekly_xp: (existing.weekly_xp ?? 0) + amount,
          games_played: (existing.games_played ?? 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("user_session_id", sessionId);
    } else {
      await supabase.from("leaderboard").insert({
        user_session_id: sessionId,
        display_name: displayName || `Guest_${sessionId.slice(-4)}`,
        total_xp: amount,
        weekly_xp: amount,
        games_played: 1,
      });
    }
  } catch (e) {
    console.error("XP award error:", e);
  }
  return amount;
}
