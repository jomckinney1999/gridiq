"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

type Accent = "green" | "orange" | "blue" | "purple";

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
  accent,
}: {
  src: string;
  alt: string;
  accent: Accent;
}) {
  const border =
    accent === "green"
      ? "rgba(0,255,135,0.30)"
      : accent === "orange"
        ? "rgba(255,107,43,0.30)"
        : accent === "blue"
          ? "rgba(59,158,255,0.30)"
          : "rgba(168,85,247,0.30)";

  return (
    <div
      className="relative h-12 w-12 overflow-hidden rounded-[10px] border bg-[#111116]"
      style={{ borderColor: border }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="48px"
        priority
        className="object-cover object-top"
      />
    </div>
  );
}

function AttributeBar({
  label,
  value,
  pct,
  accent,
}: {
  label: string;
  value: string;
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
        <span className="text-[9px] font-semibold text-[#8888a0]">{value}</span>
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
  teamLogoSrc,
}: {
  accent: Accent;
  name: string;
  meta: string;
  grade: string;
  bars: Array<{ label: string; value: string; pct: number }>;
  imageSrc: string;
  teamLogoSrc?: string;
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
        <PlayerImage src={imageSrc} alt={name} accent={accent} />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold text-[#f2f2f5]">
            {name}
          </div>
          <div className="flex items-center gap-2">
            {teamLogoSrc ? (
              <span className="relative h-4 w-4 overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.10)] bg-[#0d0d10]">
                <Image
                  src={teamLogoSrc}
                  alt=""
                  fill
                  sizes="16px"
                  className="object-contain"
                />
              </span>
            ) : null}
            <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#44445a]">
              {meta}
            </div>
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
            value={b.value}
            pct={b.pct}
            accent={accent}
          />
        ))}
      </div>
    </div>
  );
}

export function Hero() {
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
              Ask anything. Get instant answers. From route counts to playoff
              fumbles — GridIQ answers the questions other sites can’t.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <a
                href="/search"
                className="inline-flex h-11 w-full max-w-[260px] items-center justify-center rounded-full bg-[#00ff87] px-5 text-[13px] font-semibold text-[#050507] shadow-[0_0_24px_rgba(0,255,135,0.25)] transition hover:brightness-110 hover:shadow-[0_0_28px_rgba(0,255,135,0.35)]"
              >
                Start Searching Free
              </a>
              <a
                href="#"
                className="inline-flex h-11 w-full max-w-[260px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(13,13,16,0.35)] px-5 text-[13px] font-semibold text-[#f2f2f5] transition hover:bg-[#1c1c21]"
              >
                Watch Demo ↗
              </a>
            </motion.div>

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
                      <span className="truncate">gridiq.com/search</span>
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
                      Ask GridIQ
                    </a>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <div className="grid min-w-[980px] grid-cols-4 divide-x divide-[rgba(255,255,255,0.06)] rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[#111116]">
                      <PlayerCard
                        accent="green"
                        name="Jayden Daniels"
                        meta="QB · Washington"
                        grade="92.1"
                        imageSrc="/players/qb.jpg"
                        teamLogoSrc="https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png"
                        bars={[
                          { label: "Passing", value: "91%", pct: 91 },
                          { label: "Running", value: "88%", pct: 88 },
                          { label: "Pressure", value: "84%", pct: 84 },
                        ]}
                      />
                      <PlayerCard
                        accent="orange"
                        name="Jaylen Waddle"
                        meta="WR · Miami"
                        grade="87.4"
                        imageSrc="/players/wr.jpg"
                        teamLogoSrc="https://a.espncdn.com/i/teamlogos/nfl/500/mia.png"
                        bars={[
                          { label: "Routes", value: "85%", pct: 85 },
                          { label: "Sep", value: "82%", pct: 82 },
                          { label: "YAC", value: "79%", pct: 79 },
                        ]}
                      />
                      <PlayerCard
                        accent="blue"
                        name="CeeDee Lamb"
                        meta="WR · Dallas"
                        grade="94.8"
                        imageSrc="/players/wr.jpg"
                        teamLogoSrc="https://a.espncdn.com/i/teamlogos/nfl/500/dal.png"
                        bars={[
                          { label: "YPRR", value: "98%", pct: 98 },
                          { label: "Target", value: "96%", pct: 96 },
                          { label: "EPA", value: "94%", pct: 94 },
                        ]}
                      />
                      <PlayerCard
                        accent="purple"
                        name="Rueben Bain"
                        meta="DT/DE · 2025 Draft"
                        grade="B+"
                        imageSrc="/players/dt.jpg"
                        bars={[
                          { label: "PR Win", value: "82%", pct: 82 },
                          { label: "Motor", value: "94%", pct: 94 },
                          { label: "Run D", value: "55%", pct: 55 },
                        ]}
                      />
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

