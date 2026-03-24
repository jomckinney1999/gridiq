const SESSION_KEY = "gridiq_guru_session_id";

function randomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `sess_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

/** Stable per-browser session for anonymous ratings. */
export function getGuruSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = randomId();
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return randomId();
  }
}
