"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AIResponseCard } from "@/components/search/AIResponseCard";
import { DataTable } from "@/components/search/DataTable";
import { FollowUpSuggestions } from "@/components/search/FollowUpSuggestions";
import { StatCardGrid } from "@/components/search/StatCardGrid";
import { rgbaFromHex } from "@/lib/color";
import { normalizeQueryResponse } from "@/lib/normalizeQueryResponse";
import type { GridIQAPIResponse } from "@/types/gridiq-query";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const EXAMPLE_PILLS = [
  "Mahomes TDs 2024",
  "Jayden Daniels playoffs",
  "CeeDee Lamb advanced stats",
  "Best WR by YPRR 2024",
  "Derrick Henry 2024 season",
] as const;

const HERO_PLACEHOLDER = `Ask the Guru anything... try: 'How many TDs did Patrick Mahomes throw in 2024?'`;

function HeroResultsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2 rounded-xl border-[0.5px] border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] p-4">
        <div className="h-3 w-40 rounded bg-[rgba(255,255,255,0.06)]" />
        <div className="h-3 w-full rounded bg-[rgba(255,255,255,0.04)]" />
        <div className="h-3 w-[92%] rounded bg-[rgba(255,255,255,0.04)]" />
        <div className="h-3 w-[80%] rounded bg-[rgba(255,255,255,0.04)]" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl border-[0.5px] border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)]"
          />
        ))}
      </div>
    </div>
  );
}

type Accent = "green" | "orange" | "blue" | "purple";

const BROWSER_MOCKUP_PLAYERS = [
  {
    name: "Jayden Daniels",
    position: "QB",
    team: "Washington Commanders",
    grade: "92.1",
    accent: "green" as const,
    image: "/players/jayden-daniels.png",
    teamBg: "#5a1414",
    bars: [
      { label: "Passing", value: 91 },
      { label: "Running", value: 88 },
      { label: "Pressure", value: 84 },
    ],
  },
  {
    name: "CeeDee Lamb",
    position: "WR",
    team: "Dallas Cowboys",
    grade: "94.8",
    accent: "blue" as const,
    image: "/players/ceedee-lamb.png",
    teamBg: "#003594",
    bars: [
      { label: "YPRR", value: 98 },
      { label: "Target", value: 96 },
      { label: "EPA", value: 94 },
    ],
  },
  {
    name: "Rueben Bain",
    position: "DT/DE",
    team: "2025 Draft",
    grade: "B+",
    accent: "purple" as const,
    image: "/players/reuben-bain.png",
    teamBg: "#f47321",
    bars: [
      { label: "PR Win", value: 82 },
      { label: "Motor", value: 94 },
      { label: "Run D", value: 55 },
    ],
  },
  {
    name: "Fernando Mendoza",
    position: "QB",
    team: "Indiana Hoosiers",
    grade: "91.6",
    accent: "orange" as const,
    image: "/players/fernando-mendoza.png",
    teamBg: "#990000",
    bars: [
      { label: "Comp%", value: 91 },
      { label: "YPA", value: 88 },
      { label: "TD/INT", value: 85 },
    ],
  },
] as const;

function AccentLine({ accent }: { accent: Accent }) {
  const from =
    accent === "green"
      ? "#00ff87"
      : accent === "orange"
        ? "#ff6b2b"
        : accent === "blue"
          ? "#3b9eff"
          : "#a855f7";
  return (
    <div
      className="absolute inset-x-0 top-0 h-[2px]"
      style={{
        background: `linear-gradient(90deg, ${from}, transparent)`,
      }}
    />
  );
}

function PlayerImage({
  src,
  alt,
  teamBg,
}: {
  src: string;
  alt: string;
  teamBg: string;
}) {
  return (
    <div
      className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] border"
      style={{
        backgroundColor: teamBg,
        borderColor: rgbaFromHex(teamBg, 0.6),
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="56px"
        priority
        className="object-cover object-top [image-rendering:pixelated]"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}

function AttributeBar({
  label,
  pct,
  accent,
}: {
  label: string;
  pct: number;
  accent: Accent;
}) {
  const color =
    accent === "green"
      ? "#00ff87"
      : accent === "orange"
        ? "#ff6b2b"
        : accent === "blue"
          ? "#3b9eff"
          : "#a855f7";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-[0.5px] text-[#44445a]">
          {label}
        </span>
        <span className="text-[9px] font-semibold text-[#8888a0]">{pct}%</span>
      </div>
      <div className="h-[3px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function PlayerCard({
  accent,
  name,
  meta,
  grade,
  bars,
  imageSrc,
  teamBg,
}: {
  accent: Accent;
  name: string;
  meta: string;
  grade: string;
  bars: Array<{ label: string; value: number }>;
  imageSrc: string;
  teamBg: string;
}) {
  const color =
    accent === "green"
      ? "#00ff87"
      : accent === "orange"
        ? "#ff6b2b"
        : accent === "blue"
          ? "#3b9eff"
          : "#a855f7";

  return (
    <div className="relative flex min-w-[240px] flex-1 flex-col gap-3 p-4 sm:min-w-0">
      <AccentLine accent={accent} />
      <div className="flex items-center gap-3">
        <PlayerImage src={imageSrc} alt={name} teamBg={teamBg} />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold text-[#f2f2f5]">
            {name}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#44445a]">
            {meta}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div
          className="text-[24px] font-extrabold tracking-[-1px]"
          style={{ color }}
        >
          {grade}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#8888a0]">
          Grade
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {bars.map((b) => (
          <AttributeBar
            key={b.label}
            label={b.label}
            pct={b.value}
            accent={accent}
          />
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GridIQAPIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const taRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  const resize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [query, resize]);

  const isLoadingRef = useRef(false);

  const runQuery = useCallback(async (raw?: string) => {
    const q = (raw ?? query).trim();
    if (!q || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setError(null);
    setResponse(null);
    setIsLoading(true);
    setHasSearched(true);
    setQuery(q);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      const data = (await res.json()) as Record<string, unknown>;

      if (!res.ok) {
        throw new Error(String(data.error ?? "Request failed"));
      }

      setResponse(normalizeQueryResponse(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [query]);

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void runQuery();
    }
  }

  function onFollowUp(s: string) {
    setQuery(s);
    void runQuery(s);
  }

  const showResultsBlock = hasSearched && (isLoading || response !== null || error !== null);

  useEffect(() => {
    if (!showResultsBlock) return;
    const id = requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [showResultsBlock, isLoading, response, error]);

  return (
    <section className="relative overflow-hidden bg-[#050507]">
      {/* Full viewport height */}
      <div className="relative min-h-[100svh]">
        {/* Stadium background image (very subtle) */}
        <Image
          src="/players/stadium.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />

        {/* Grid background */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,135,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(circle at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 38%, transparent 72%)",
            opacity: 1,
          }}
        />

        {/* Glow orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-120px] h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(0,255,135,0.35), transparent 62%)",
            opacity: 0.7,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-60px] top-[40px] h-[300px] w-[300px] rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(59,158,255,0.28), transparent 62%)",
            opacity: 0.7,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-60px] top-[60px] h-[250px] w-[250px] rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,107,43,0.28), transparent 62%)",
            opacity: 0.7,
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,255,135,0.25)] bg-[rgba(0,255,135,0.08)] px-4 py-2 text-[12px] font-semibold text-[#00ff87]">
                <span className="h-2 w-2 rounded-full bg-[#00ff87] shadow-[0_0_18px_rgba(0,255,135,0.25)] animate-pulse" />
                2024 NFL Season · Live Data
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-balance text-[44px] font-black tracking-[-2px] text-[#f2f2f5] sm:text-[64px]"
            >
              The NFL Stats Platform
              <br />
              <span className="bg-gradient-to-r from-[#00ff87] via-[#3b9eff] to-[#ff6b2b] bg-clip-text text-transparent">
                Built for Obsessives
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-[480px] text-[16px] leading-relaxed text-[#8888a0]"
            >
              Ask the Guru anything. From route counts to playoff fumbles — NFL Stat Guru
              answers the questions ESPN can’t.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-7 w-full max-w-[640px]"
            >
              <div
                className="group flex w-full items-end gap-3 rounded-[14px] border border-[rgba(255,255,255,0.12)] bg-[#0d0d10] px-4 py-[14px] transition-[box-shadow,border-color] duration-200 ease-in-out hover:border-[rgba(0,255,135,0.3)] focus-within:border-[rgba(0,255,135,0.45)] focus-within:shadow-[0_0_0_3px_rgba(0,255,135,0.12),0_0_20px_rgba(0,255,135,0.08)] sm:gap-4"
              >
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[rgba(0,255,135,0.1)]">
                  <span className="text-[14px] font-light leading-none text-[#00ff87]">
                    ✦
                  </span>
                </div>
                <textarea
                  ref={taRef}
                  rows={1}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={HERO_PLACEHOLDER}
                  disabled={isLoading}
                  className="min-h-[24px] min-w-0 w-full resize-none border-0 bg-transparent py-1 text-left text-[14px] leading-relaxed text-[#f2f2f5] outline-none placeholder:text-[#44445a]"
                />
                <button
                  type="button"
                  onClick={() => void runQuery()}
                  disabled={isLoading || !query.trim()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#00ff87] px-4 py-2 text-[13px] font-bold text-[#050507] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-[#050507] border-t-transparent"
                        aria-hidden
                      />
                      Thinking...
                    </>
                  ) : (
                    "Ask the Guru"
                  )}
                </button>
              </div>

              <div className="mt-2 flex w-full flex-wrap justify-center gap-2">
                {EXAMPLE_PILLS.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => void runQuery(pill)}
                    className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[#0d0d10] px-3 py-1.5 text-left text-[12px] text-[#8888a0] transition hover:border-[rgba(0,255,135,0.35)] hover:bg-[rgba(0,255,135,0.06)] hover:text-[#00ff87]"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </motion.div>

            {showResultsBlock ? (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-6 w-full max-w-[800px] scroll-mt-24 text-left"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#00ff87]">
                  Guru says:
                </div>

                {error ? (
                  <div className="mt-3 rounded-xl border border-[rgba(255,107,43,0.25)] bg-[rgba(255,107,43,0.08)] px-4 py-3 text-[13px] text-[#ff6b2b]">
                    {error}
                  </div>
                ) : null}

                {isLoading ? <HeroResultsSkeleton /> : null}

                {!isLoading && response ? (
                  <motion.div
                    key={response.response_text?.slice(0, 48) ?? "r"}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-3 space-y-6"
                  >
                    <AIResponseCard response={response} />
                    {response.key_stats?.length ? (
                      <StatCardGrid stats={response.key_stats} />
                    ) : null}
                    {response.table_data ? (
                      <DataTable table={response.table_data} />
                    ) : null}
                    {response.follow_up_suggestions?.length ? (
                      <FollowUpSuggestions
                        suggestions={response.follow_up_suggestions}
                        onPick={onFollowUp}
                      />
                    ) : null}
                  </motion.div>
                ) : null}

                {!isLoading && (response || error) ? (
                  <div className="mt-3">
                    <Link
                      href="/search"
                      className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#ff6b2b] underline-offset-4 transition hover:text-[#ff8f5a] hover:underline"
                    >
                      Want more? →
                    </Link>
                  </div>
                ) : null}
              </motion.div>
            ) : null}

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex w-full flex-wrap items-center justify-center gap-2"
            >
              {[
                { n: "2.8M+", t: "plays tracked", c: "#00ff87" },
                { n: "1,847", t: "players profiled", c: "#ff6b2b" },
                { n: "340+", t: "advanced metrics", c: "#3b9eff" },
                { n: "AI-powered", t: "search", c: "#00ff87" },
                { n: "1999–2024", t: "data", c: "#3b9eff" },
              ].map((chip) => (
                <div
                  key={chip.n}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.06)] bg-[#0d0d10] px-3 py-2 text-[12px] text-[#8888a0]"
                >
                  <span className="font-bold" style={{ color: chip.c }}>
                    {chip.n}
                  </span>
                  <span className="text-[#8888a0]">{chip.t}</span>
                </div>
              ))}
            </motion.div>

            {/* Browser mockup */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 w-full"
            >
              <div className="overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[#0d0d10] shadow-[0_0_40px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] bg-[#111116] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="ml-2 flex flex-1 items-center justify-center">
                    <div className="flex w-full max-w-[420px] items-center gap-2 rounded-full border border-[rgba(255,255,255,0.06)] bg-[#0d0d10] px-4 py-1.5 text-[12px] text-[#8888a0]">
                      <span className="text-[#44445a]">🔒</span>
                      <span className="truncate">nflstatguru.com/search</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-3 rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[#111116] px-4 py-3">
                      <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[rgba(0,255,135,0.14)] text-[#00ff87]">
                        ✦
                      </div>
                      <div className="flex min-w-0 flex-1 items-center gap-1 text-[13px] text-[#f2f2f5]">
                        <span className="truncate">
                          Show me top WRs by YPRR in 2024
                        </span>
                        <span className="h-[14px] w-[2px] animate-pulse bg-[#00ff87]" />
                      </div>
                    </div>
                    <a
                      href="/search"
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#00ff87] px-5 text-[13px] font-semibold text-[#050507] shadow-[0_0_24px_rgba(0,255,135,0.25)] transition hover:brightness-110"
                    >
                      Ask the Guru ✦
                    </a>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <div className="grid min-w-[980px] grid-cols-4 divide-x divide-[rgba(255,255,255,0.06)] rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[#111116]">
                      {BROWSER_MOCKUP_PLAYERS.map((p) => (
                        <PlayerCard
                          key={p.name}
                          accent={p.accent}
                          name={p.name}
                          meta={`${p.position} · ${p.team}`}
                          grade={p.grade}
                          imageSrc={p.image}
                          teamBg={p.teamBg}
                          bars={[...p.bars]}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

