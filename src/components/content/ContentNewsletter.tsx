"use client";

import { useState } from "react";

export function ContentNewsletter() {
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
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "content_page" }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setMessage(data.message ?? "Subscribed!");
      setEmail("");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative mt-20 overflow-hidden rounded-[20px] border border-[var(--green-border)] bg-[var(--bg-card)] px-5 py-10 sm:px-10">
      <div
        className="pointer-events-none absolute inset-0 rounded-[20px] opacity-[0.45]"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--green) 14%, transparent), color-mix(in srgb, var(--blue) 10%, transparent))",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-xl text-center">
        <h2 className="text-[24px] font-extrabold tracking-[-0.5px] text-[var(--txt)] sm:text-[28px]">
          Get the Weekly Film Room
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--txt-2)]">
          Advanced stats breakdowns, fantasy intel, and NFL deep dives delivered every Tuesday. Free.
        </p>
        <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch">
          <label htmlFor="content-newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="content-newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-h-11 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-[14px] text-[var(--txt)] outline-none placeholder:text-[var(--txt-3)] focus:border-[color-mix(in_srgb,var(--green)_35%,transparent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--green)_12%,transparent)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--green)] px-6 text-[13px] font-semibold text-[var(--on-green)] shadow-[var(--shadow-glow-g)] transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "…" : "Subscribe Free"}
          </button>
        </form>
        <p className="mt-4 text-[12px] font-medium text-[var(--txt-3)]">Join 12,400+ subscribers</p>
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
    </section>
  );
}
