"use client";

import { type ReactNode, useState } from "react";

type GamePlaceholderProps = {
  title: string;
  description: string;
  xpHint: string;
  source: string;
  banner: ReactNode;
  children?: ReactNode;
};

export function GamePlaceholder({ title, description, xpHint, source, banner, children }: GamePlaceholderProps) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function notify() {
    setMsg(null);
    const res = await fetch("/api/courses/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });
    const j = (await res.json()) as { ok?: boolean; message?: string; error?: string };
    setMsg(j.ok ? j.message ?? "You're on the list." : j.error ?? "Could not save.");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)]">
        <div className="relative">{banner}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-[color-mix(in_srgb,var(--bg-base)_55%,transparent)] backdrop-blur-[2px]">
          <span className="rounded-full border border-[var(--orange)] bg-[var(--orange-light)] px-4 py-2 text-[13px] font-bold text-[var(--orange)]">
            Coming Soon
          </span>
        </div>
      </div>
      <h1 className="mt-8 text-[26px] font-black text-[var(--txt)]">{title}</h1>
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--txt-2)]">{description}</p>
      <p className="mt-4 text-[13px] font-semibold text-[var(--green)]">{xpHint}</p>
      {children}
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="h-11 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-[var(--txt)]"
        />
        <button
          type="button"
          onClick={() => void notify()}
          className="h-11 rounded-xl bg-[var(--green)] px-6 text-[14px] font-bold text-[var(--on-green)]"
        >
          Notify Me
        </button>
      </div>
      {msg ? <p className="mt-3 text-[12px] text-[var(--txt-muted)]">{msg}</p> : null}
    </div>
  );
}
