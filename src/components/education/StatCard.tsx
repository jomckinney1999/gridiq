import type { ReactNode } from "react";

type Category = "Passing" | "Receiving" | "Rushing" | "Defense" | "Fantasy";

export type Benchmark = {
  label: "Good" | "Great" | "Elite";
  rule: string; // e.g. ">0.15"
};

export type StatCardModel = {
  abbreviation: string;
  fullName: string;
  category: Category;
  inPlainEnglish: ReactNode;
  realExample: ReactNode;
  whyItMatters: ReactNode;
  benchmarks: [Benchmark, Benchmark, Benchmark];
};

const CATEGORY_ACCENT: Record<Category, { accent: string; glow: string }> = {
  Passing: { accent: "#00ff87", glow: "rgba(0,255,135,0.25)" },
  Receiving: { accent: "#ff6b2b", glow: "rgba(255,107,43,0.25)" },
  Rushing: { accent: "#3b9eff", glow: "rgba(59,158,255,0.22)" },
  Defense: { accent: "#a855f7", glow: "rgba(168,85,247,0.22)" },
  Fantasy: { accent: "#3b9eff", glow: "rgba(59,158,255,0.22)" },
};

export function StatCard({ card }: { card: StatCardModel }) {
  const { accent } = CATEGORY_ACCENT[card.category];

  return (
    <article
      className="group relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d10] p-6 transition duration-200 ease-out hover:-translate-y-[3px] hover:border-[rgba(255,255,255,0.10)]"
      aria-label={`${card.fullName} education card`}
    >
      {/* Top accent line */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />

      {/* Abbreviation badge (top-left) */}
      <div className="relative mb-4 flex items-start justify-between gap-4">
        <div className="rounded-lg bg-[rgba(255,255,255,0.02)] px-3 py-1 border border-[rgba(255,255,255,0.06)]">
          <div
            className="text-[32px] font-extrabold tracking-[-1px]"
            style={{
              color: accent,
              textShadow: `0 0 30px ${CATEGORY_ACCENT[card.category].glow}`,
            }}
          >
            {card.abbreviation}
          </div>
          <div className="mt-1 text-[16px] font-semibold text-[#f2f2f5]">
            {card.fullName}
          </div>
        </div>

        {/* Category pill */}
        <div className="mt-1 rounded-full border border-[rgba(255,107,43,0.25)] bg-[rgba(255,107,43,0.08)] px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.6px] text-[#ff6b2b]">
          {card.category}
        </div>
      </div>

      <div className="mt-2">
        <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#44445a]">
          In Plain English
        </div>
        <div className="mt-2 text-[15px] leading-[1.8] text-[#f2f2f5]">
          {card.inPlainEnglish}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#44445a]">
          Real Example
        </div>
        <div
          className="mt-2 rounded-lg bg-[rgba(0,255,135,0.06)] p-[14px] italic"
          style={{
            borderLeft: `2px solid #00ff87`,
          }}
        >
          {card.realExample}
        </div>
      </div>

      <div className="mt-4 text-[13px] text-[#44445a]">
        <span className="text-[#8888a0]">Why it matters:</span> {card.whyItMatters}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {card.benchmarks.map((b) => {
          const chipAccent =
            b.label === "Good"
              ? "#8888a0"
              : b.label === "Great"
                ? accent
                : "#00ff87";
          return (
            <span
              key={b.label}
              className="rounded-full border border-[rgba(255,255,255,0.06)] bg-[#050507] px-3 py-1 text-[11px] font-bold"
              style={{ color: chipAccent }}
            >
              {b.label}: {b.rule}
            </span>
          );
        })}
      </div>
    </article>
  );
}

