"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function BannerStatGrid() {
  return (
    <svg viewBox="0 0 400 130" className="h-[130px] w-full" aria-hidden>
      <defs>
        <linearGradient id="sgf" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0a14" />
          <stop offset="100%" stopColor="#12121f" />
        </linearGradient>
      </defs>
      <rect width="400" height="130" fill="url(#sgf)" />
      <polygon points="0,130 400,90 400,130" fill="#0d3d22" opacity={0.35} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const row = i < 4 ? 0 : 1;
        const col = i % 4;
        const x = 40 + col * 78;
        const y = 28 + row * 44;
        const active = i === 2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={64}
            height={34}
            rx={4}
            fill="#15152a"
            stroke={active ? "#00a854" : "#2a2a3d"}
            strokeWidth={active ? 2 : 1}
          />
        );
      })}
      <text x={52} y={48} fill="#8a8a9e" fontSize="8">
        YPRR 3.41
      </text>
      <text x={130} y={48} fill="#8a8a9e" fontSize="8">
        EPA +.31
      </text>
      <circle cx="32" cy="18" r="3" fill="#ffd54f" opacity={0.5} />
      <circle cx="368" cy="18" r="3" fill="#ffd54f" opacity={0.5} />
    </svg>
  );
}

export function BannerTrivia() {
  return (
    <svg viewBox="0 0 400 130" className="h-[130px] w-full" aria-hidden>
      <rect width="400" height="130" fill="#0a0a1e" />
      <rect x="140" y="16" width="120" height="40" rx="6" fill="#121a2e" stroke="#3a4a6e" />
      <text x="200" y="40" textAnchor="middle" fill="#9ab" fontSize="10">
        ?
      </text>
      <rect x="60" y="80" width="60" height="36" fill="#b8860b" />
      <rect x="170" y="72" width="60" height="44" fill="#c9a000" />
      <rect x="280" y="88" width="60" height="32" fill="#8b5a2b" />
      <path d="M200 8 L210 22 L190 22 Z" fill="#ffd700" />
    </svg>
  );
}

export function BannerTier() {
  return (
    <svg viewBox="0 0 400 130" className="h-[130px] w-full" aria-hidden>
      <rect width="400" height="130" fill="#0d0014" />
      {["S", "A", "B", "C", "D"].map((t, i) => (
        <g key={t}>
          <rect x="12" y={14 + i * 22} width="28" height="18" rx="3" fill={["#00a854", "#1a6fd4", "#7c3aed", "#d44a00", "#dc2626"][i]} />
          <text x="26" y={27 + i * 22} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
            {t}
          </text>
          <rect x="48" y={14 + i * 22} width="340" height="18" rx="3" fill="#1a1020" stroke="#2d1f3a" />
        </g>
      ))}
    </svg>
  );
}

export function BannerDraft() {
  return (
    <svg viewBox="0 0 400 130" className="h-[130px] w-full" aria-hidden>
      <rect width="400" height="130" fill="#050a14" />
      {["Abdul Carter 1.01", "Ashton Jeanty 1.02", "Cam Ward 1.03", "YOU ARE ON THE CLOCK", "Pick 1.05", "Pick 1.06"].map((label, i) => (
        <rect
          key={label}
          x="20"
          y={18 + i * 16}
          width="360"
          height="14"
          rx="2"
          fill={i === 3 ? "#0d2a4a" : "#0f1520"}
          stroke={i === 3 ? "#2563eb" : "#1e293b"}
        />
      ))}
    </svg>
  );
}

export function BannerSalary() {
  return (
    <svg viewBox="0 0 400 130" className="h-[130px] w-full" aria-hidden>
      <rect width="400" height="130" fill="#0a0800" />
      <rect x="24" y="16" width="352" height="14" rx="4" fill="#1a1408" />
      <rect x="24" y="16" width="210" height="14" rx="4" fill="#f59e0b" opacity={0.7} />
      <text x="200" y="100" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
        PROJECTED SCORE 312.4 pts
      </text>
    </svg>
  );
}

export function BannerTrade() {
  return (
    <svg viewBox="0 0 400 130" className="h-[130px] w-full" aria-hidden>
      <rect width="400" height="130" fill="#0a0500" />
      <line x1="200" y1="20" x2="200" y2="110" stroke="#f97316" strokeWidth="2" strokeDasharray="6 4" />
      <rect x="24" y="40" width="150" height="60" rx="6" fill="#3a1010" stroke="#b91c1c" />
      <rect x="226" y="40" width="150" height="60" rx="6" fill="#10321a" stroke="#16a34a" />
      <circle cx="200" cy="70" r="16" fill="#1a1208" stroke="#f97316" />
      <text x="200" y="74" textAnchor="middle" fill="#fb923c" fontSize="9" fontWeight="bold">
        VS
      </text>
    </svg>
  );
}

export function BannerSurvivor() {
  return (
    <svg viewBox="0 0 400 130" className="h-[130px] w-full" aria-hidden>
      <rect width="400" height="130" fill="#050a0a" />
      <ellipse cx="200" cy="70" rx="160" ry="48" fill="#0d1f14" stroke="#14532d" />
      {[
        { x: 120, c: "#00338d" },
        { x: 160, c: "#004851" },
        { x: 200, c: "#e31837" },
        { x: 240, c: "#241773" },
      ].map((d) => (
        <circle key={d.x} cx={d.x} cy="70" r="10" fill={d.c} opacity={0.9} />
      ))}
      <circle cx="280" cy="70" r="10" fill="#444" opacity={0.4} />
      <line x1="270" y1="62" x2="290" y2="78" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export function BannerPick6() {
  return (
    <svg viewBox="0 0 400 130" className="h-[130px] w-full" aria-hidden>
      <rect width="400" height="130" fill="#080010" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 3;
        const row = i < 3 ? 0 : 1;
        const x = 40 + col * 110;
        const y = 24 + row * 52;
        return (
          <rect key={i} x={x} y={y} width="90" height="40" rx="4" fill={i < 3 ? "#2d1a4a" : "#1a1520"} stroke="#4a3a6a" />
        );
      })}
    </svg>
  );
}

export function BannerMindReader() {
  return (
    <svg viewBox="0 0 400 130" className="h-[130px] w-full" aria-hidden>
      <rect width="400" height="130" fill="#08000e" />
      <circle cx="200" cy="65" r="36" fill="#1a0a2e" stroke="#a855f7" strokeWidth="3" />
      <text x="200" y="72" textAnchor="middle" fill="#c4b5fd" fontSize="28" fontWeight="bold">
        ?
      </text>
      <text x="200" y="22" textAnchor="middle" fill="#9ca3af" fontSize="9">
        THINK OF A PLAYER...
      </text>
    </svg>
  );
}

const GAMES = [
  {
    href: "/games/stat-grid",
    title: "Daily Stat Grid",
    desc: "12 stat lines. Name the player. Same puzzle for everyone daily.",
    tags: ["Daily Reset", "Solo"],
    meta: "∞ streaks",
    btn: "Play →",
    btnClass: "bg-[var(--green)] text-[var(--on-green)]",
    Banner: BannerStatGrid,
  },
  {
    href: "/games/trivia",
    title: "NFL Trivia Showdown",
    desc: "Host a room, invite friends, fastest correct wins the round.",
    tags: ["Multiplayer", "Live"],
    meta: "Up to 20",
    btn: "Host Game →",
    btnClass: "bg-[#2563eb] text-white",
    Banner: BannerTrivia,
  },
  {
    href: "/tierlist",
    title: "Tier List Battle",
    desc: "Drag QBs & WRs into S–D tiers and share your list.",
    tags: ["Share", "Solo"],
    meta: "Community",
    btn: "Make List →",
    btnClass: "bg-[#7c3aed] text-white",
    Banner: BannerTier,
  },
  {
    href: "/games/mock-draft",
    title: "Mock Draft Simulator",
    desc: "Full 32-team board with clocks and trades (beta).",
    tags: ["Multiplayer", "32-Team"],
    meta: "7 rounds",
    btn: "Start Draft →",
    btnClass: "bg-[#ea580c] text-white",
    Banner: BannerDraft,
  },
  {
    href: "/games/salary-cap",
    title: "Salary Cap Challenge",
    desc: "Build the best lineup under a hard cap each week.",
    tags: ["Weekly", "Leaderboard"],
    meta: "$50M cap",
    btn: "Build Team →",
    btnClass: "bg-[#f59e0b] text-[#431a00]",
    Banner: BannerSalary,
  },
  {
    href: "/games/trade-vote",
    title: "Trade Deal or No Deal",
    desc: "Community votes on blockbuster trades — deal or no deal?",
    tags: ["Daily", "Vote"],
    meta: "Live %",
    btn: "Vote Now →",
    btnClass: "bg-[#ea580c] text-white",
    Banner: BannerTrade,
  },
  {
    href: "/games/survivor",
    title: "NFL Survivor Pick'em",
    desc: "Pick one winner per week — last standing wins the league.",
    tags: ["League", "Weekly"],
    meta: "32 teams",
    btn: "Join League →",
    btnClass: "bg-[#2563eb] text-white",
    Banner: BannerSurvivor,
  },
  {
    href: "/games/pick6",
    title: "Pick 6 Props",
    desc: "Six props weekly — nail the over/unders for the podium.",
    tags: ["Weekly", "Leaderboard"],
    meta: "Props board",
    btn: "Make Picks →",
    btnClass: "bg-[#7c3aed] text-white",
    Banner: BannerPick6,
  },
  {
    href: "/games/guru-mind-reader",
    title: "NFL Guru Mind Reader",
    desc: "Yes/no questions — can the Guru guess your mystery player?",
    tags: ["AI-Powered", "Solo"],
    meta: "Claude-powered",
    btn: "Can you stump him? →",
    btnClass: "bg-[#7c3aed] text-white",
    Banner: BannerMindReader,
  },
] as const;

export function GameHubView() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d: { activeTodayCount?: number }) => setActive(d.activeTodayCount ?? 0))
      .catch(() => setActive(0));
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-10 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--green)]">Game Room</p>
      <h1 className="mt-2 text-[clamp(28px,5vw,44px)] font-black tracking-tight text-[var(--txt)]">Play With Friends</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--txt-2)]">
        Daily challenges, live multiplayer, and AI-powered games. New games weekly.
      </p>
      <p className="mt-4 text-[13px] text-[var(--txt-muted)]">
        <span className="font-bold text-[var(--green)]">{active}</span> players active today
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((g) => (
          <article
            key={g.href}
            className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]"
          >
            <div className="overflow-hidden border-b border-[var(--border)]">
              <g.Banner />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h2 className="text-[14px] font-extrabold text-[var(--txt)]">{g.title}</h2>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--txt-muted)]">{g.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.tags.map((t) => (
                  <span key={t} className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[9px] font-semibold text-[var(--txt-2)]">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-[var(--txt-3)]">{g.meta}</p>
              <Link
                href={g.href}
                className={cn(
                  "mt-4 inline-flex w-full items-center justify-center rounded-xl py-2.5 text-[13px] font-bold transition hover:brightness-110",
                  g.btnClass,
                )}
              >
                {g.btn}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
