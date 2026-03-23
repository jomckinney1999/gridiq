"use client";

import { useState } from "react";

export function CourseWaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/courses/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setMessage(data.message ?? "You're on the list! We'll notify you when we launch.");
      setEmail("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <label htmlFor="course-waitlist-email" className="sr-only">
          Email for waitlist
        </label>
        <input
          id="course-waitlist-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-h-11 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-[14px] text-[var(--txt)] outline-none placeholder:text-[var(--txt-3)] focus:border-[color-mix(in_srgb,var(--green)_35%,transparent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--green)_12%,transparent)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--green)] px-5 text-[13px] font-semibold text-[var(--on-green)] shadow-[var(--shadow-glow-g)] transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "…" : "Join Waitlist →"}
        </button>
      </form>
      {error ? (
        <p className="mt-3 text-[13px] text-[var(--red-accent)]" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-3 text-[13px] font-medium text-[var(--green)]" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
