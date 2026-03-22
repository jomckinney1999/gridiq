"use client";

import { useMemo, useState } from "react";
import { EPACalculator } from "@/components/education/EPACalculator";
import { StatCard, type StatCardModel } from "@/components/education/StatCard";

type Category = "All" | "Passing" | "Receiving" | "Rushing" | "Defense" | "Fantasy";

const STATS: StatCardModel[] = [
  {
    abbreviation: "EPA",
    fullName: "Expected Points Added",
    category: "Passing",
    inPlainEnglish:
      "Every play starts with an expected score based on where you are on the field. EPA measures if the play beat or hurt that expectation. Think of it like a grade for each individual play — did it help or hurt your team's chances of scoring?",
    realExample:
      "3rd and 1 at midfield. Expected points: 2.1. Mahomes hits a 30-yard strike. New expected points: 4.8. That play had EPA of +2.7 — it added almost 3 points of value in one throw.",
    whyItMatters:
      "Box score yards can lie. A 5-yard gain on 4th and 4 is worth way more than 5 yards on 1st and 10.",
    benchmarks: [
      { label: "Good", rule: ">0.15" },
      { label: "Great", rule: ">0.25" },
      { label: "Elite", rule: ">0.35" },
    ],
  },
  {
    abbreviation: "CPOE",
    fullName: "Completion % Over Expected",
    category: "Passing",
    inPlainEnglish:
      "Not all completions are equal. A 2-yard checkdown is easy to complete. A 40-yard bomb is hard. CPOE adjusts for that — it measures if a QB completes passes at a higher rate than an average QB would on the same throws.",
    realExample:
      "If a QB attempts a throw that AI models say should be completed 55% of the time, and he completes it, that's +45 CPOE on that throw. Average those across a season and you get true passing accuracy.",
    whyItMatters: "Some QBs have high completion % because they only throw short, safe passes. CPOE exposes that.",
    benchmarks: [
      { label: "Good", rule: ">+2%" },
      { label: "Great", rule: ">+5%" },
      { label: "Elite", rule: ">+8%" },
    ],
  },
  {
    abbreviation: "AIR YDS",
    fullName: "Air Yards",
    category: "Passing",
    inPlainEnglish:
      "How far did the ball travel through the air — measured from the line of scrimmage to where it was caught (or dropped/incomplete). YAC (yards after catch) is NOT included.",
    realExample:
      "A QB throws to a WR 15 yards downfield. The WR catches it and runs 8 more yards. Air yards = 15. YAC = 8. Total yards = 23.",
    whyItMatters:
      "High air yards QBs push the ball downfield. Low air yards QBs rely on their receivers to do the work after the catch.",
    benchmarks: [
      { label: "Good", rule: "Deep >20 yds" },
      { label: "Great", rule: "Intermediate 10-20" },
      { label: "Elite", rule: "Short <10" },
    ],
  },
  {
    abbreviation: "YPRR",
    fullName: "Yards Per Route Run",
    category: "Receiving",
    inPlainEnglish:
      "Every time a receiver runs a route, they get a chance to produce yards. YPRR averages their total receiving yards across every single route they ran — not just the plays they were targeted.",
    realExample:
      "CeeDee Lamb runs 150 routes in a month and gets 300 receiving yards. YPRR = 2.0. Another WR runs 150 routes but only gets 90 yards. YPRR = 0.6. Same opportunity, massively different production.",
    whyItMatters:
      "It's the most honest measure of a receiver's value because it accounts for every snap, not just the ones where he got the ball.",
    benchmarks: [
      { label: "Good", rule: ">1.8" },
      { label: "Great", rule: ">2.4" },
      { label: "Elite", rule: ">3.0" },
    ],
  },
  {
    abbreviation: "SEP",
    fullName: "Separation (yards)",
    category: "Receiving",
    inPlainEnglish:
      "How much space in yards did the receiver create between himself and the nearest defender at the moment the ball arrived? Tracked by NFL Next Gen Stats using player GPS chips.",
    realExample:
      "Tyreek Hill catches a pass with 4.2 yards between him and the cornerback. A possession receiver might catch a slant with only 1.1 yards of separation — just enough to make the catch.",
    whyItMatters:
      "Separation = open. The more separation a receiver creates, the easier the QB's job is and the harder it is for defenses to cover him.",
    benchmarks: [
      { label: "Good", rule: ">2.0 yds" },
      { label: "Great", rule: ">2.8 yds" },
      { label: "Elite", rule: ">3.5 yds" },
    ],
  },
  {
    abbreviation: "TGT SH",
    fullName: "Target Share",
    category: "Receiving",
    inPlainEnglish:
      "Out of every pass thrown by his team, what percentage was thrown to this receiver? If a team throws 40 passes and 12 go to one WR, his target share is 30%.",
    realExample:
      "Justin Jefferson had a 28% target share in 2022 — meaning nearly 1 in 3 of every Vikings pass was thrown his way. That's elite WR1 usage.",
    whyItMatters:
      "Targets = opportunity. More targets = more chances to produce. High target share is a strong predictor of fantasy and real-world value.",
    benchmarks: [
      { label: "Good", rule: "WR2 >15%" },
      { label: "Great", rule: "WR1 >22%" },
      { label: "Elite", rule: "Elite WR1 >28%" },
    ],
  },
  {
    abbreviation: "YAC",
    fullName: "Yards After Contact",
    category: "Rushing",
    inPlainEnglish:
      "How many yards did the ball carrier gain AFTER being touched by a defender? This separates runners who fall at first contact from those who break tackles and create extra yards.",
    realExample:
      "Derrick Henry gets hit 2 yards past the line of scrimmage but keeps running for 6 more yards. YAC = 6. A lesser back gets tackled immediately — YAC = 0.",
    whyItMatters:
      "YAC separates powerful, elusive backs from those who depend on their offensive line.",
    benchmarks: [
      { label: "Good", rule: ">2.5" },
      { label: "Great", rule: ">3.5" },
      { label: "Elite", rule: ">4.5" },
    ],
  },
  {
    abbreviation: "PR WIN",
    fullName: "Pass Rush Win Rate",
    category: "Defense",
    inPlainEnglish:
      "On every pass rush attempt, did the defender beat his blocker within 2.5 seconds? Win rate is the percentage of rushes where he got past the blocker before the QB had time to throw.",
    realExample:
      "Micah Parsons wins his matchup against the tackle 22% of the time. An average DE wins about 8-10% of rushes. That gap is why Parsons is considered elite.",
    whyItMatters:
      "Sacks are lucky. Win rate measures consistent pressure generation every single play.",
    benchmarks: [
      { label: "Good", rule: ">10%" },
      { label: "Great", rule: ">15%" },
      { label: "Elite", rule: ">20%" },
    ],
  },
  {
    abbreviation: "SNAP%",
    fullName: "Snap Count %",
    category: "Fantasy",
    inPlainEnglish:
      "Out of every offensive play his team ran, what percentage was this player on the field? A player can't produce if he's on the bench.",
    realExample:
      "A rookie RB plays 30% of snaps in week 1, then 55% in week 2, then 72% in week 3. That rising snap count is a major signal he's taking over the starting role before the box score shows it.",
    whyItMatters:
      "The single best leading indicator for fantasy breakouts. Rising snap counts = rising opportunity before it shows up in stats.",
    benchmarks: [
      { label: "Good", rule: "Backup <40%" },
      { label: "Great", rule: "Starter >55%" },
      { label: "Elite", rule: "Feature >75%" },
    ],
  },
];

export default function StatsSchoolPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STATS.filter((s) => {
      const matchesCategory = category === "All" ? true : s.category === category;
      const matchesQuery =
        q.length === 0
          ? true
          : s.fullName.toLowerCase().includes(q) || s.abbreviation.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const categories: Category[] = ["All", "Passing", "Receiving", "Rushing", "Defense", "Fantasy"];

  return (
    <div className="w-full">
      {/* Hero */}
      <header className="mx-auto max-w-6xl">
        <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#00ff87]">
          Stats School
        </div>
        <h1 className="mt-3 text-[40px] font-black tracking-[-2px] bg-gradient-to-r from-[#00ff87] via-[#3b9eff] to-[#ff6b2b] bg-clip-text text-transparent sm:text-[64px]">
          Advanced Stats, Plain English
        </h1>
        <p className="mt-3 max-w-[720px] text-[15px] leading-relaxed text-[#8888a0]">
          No jargon. No math degree required. Just football.
        </p>
      </header>

      <EPACalculator />

      {/* Search + filters */}
      <div className="mx-auto mt-6 max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stats by name…"
              className="w-full rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d10] px-4 py-3 text-[14px] text-[#f2f2f5] outline-none focus:border-[rgba(0,255,135,0.28)] focus:shadow-[0_0_0_1px_rgba(0,255,135,0.55),0_0_24px_rgba(0,255,135,0.25)]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.6px] transition ${
                    active
                      ? "border-[rgba(255,107,43,0.35)] bg-[rgba(255,107,43,0.12)] text-[#ff6b2b]"
                      : "border-[rgba(255,255,255,0.06)] bg-[#0d0d10] text-[#8888a0] hover:border-[rgba(255,255,255,0.10)]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <section className="mx-auto mt-8 max-w-6xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <StatCard key={s.abbreviation + s.fullName} card={s} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto mt-10 max-w-6xl px-0">
        <div className="relative overflow-hidden rounded-[14px] border border-[rgba(0,255,135,0.2)] bg-[#050507] px-6 py-8 sm:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(0,255,135,0.22), transparent 62%)",
              opacity: 0.75,
            }}
          />

          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,255,135,0.08), rgba(59,158,255,0.06), rgba(255,107,43,0.06))",
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-[24px] font-extrabold tracking-[-1px] text-[#f2f2f5] sm:text-[28px]">
              Ready to see these stats in action?
            </h2>
            <a
              href="/search"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#00ff87] px-6 text-[13px] font-semibold text-[#050507] shadow-[0_0_24px_rgba(0,255,135,0.25)] transition hover:brightness-110 hover:shadow-[0_0_28px_rgba(0,255,135,0.35)]"
            >
              Search Any Player
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

