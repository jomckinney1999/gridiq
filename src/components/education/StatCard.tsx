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
  Passing: { accent: "var(--green)", glow: "var(--g-glow)" },
  Receiving: { accent: "var(--orange)", glow: "var(--o-glow)" },
  Rushing: { accent: "var(--blue)", glow: "var(--b-glow)" },
  Defense: { accent: "var(--purple)", glow: "color-mix(in srgb, var(--purple) 22%, transparent)" },
  Fantasy: { accent: "var(--blue)", glow: "var(--b-glow)" },
};

export function StatCard({ card }: { card: StatCardModel }) {
  const { accent } = CATEGORY_ACCENT[card.category];

  return (
    <article
      className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 transition duration-200 ease-out hover:-translate-y-[3px] hover:border-[var(--border-md)]"
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
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1">
          <div
            className="text-[32px] font-extrabold tracking-[-1px]"
            style={{
              color: accent,
              textShadow: `0 0 30px ${CATEGORY_ACCENT[card.category].glow}`,
            }}
          >
            {card.abbreviation}
          </div>
          <div className="mt-1 text-[16px] font-semibold text-[var(--txt)]">
            {card.fullName}
          </div>
        </div>

        {/* Category pill */}
        <div className="mt-1 rounded-full border border-[color-mix(in_srgb,var(--orange)_25%,transparent)] bg-[var(--orange-light)] px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.6px] text-[var(--orange)]">
          {card.category}
        </div>
      </div>

      <div className="mt-2">
        <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[var(--txt-3)]">
          In Plain English
        </div>
        <div className="mt-2 text-[15px] leading-[1.8] text-[var(--txt)]">
          {card.inPlainEnglish}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[var(--txt-3)]">
          Real Example
        </div>
        <div
          className="mt-2 rounded-lg bg-[var(--green-light)] p-[14px] italic"
          style={{
            borderLeft: "2px solid var(--green)",
          }}
        >
          {card.realExample}
        </div>
      </div>

      <div className="mt-4 text-[13px] text-[var(--txt-3)]">
        <span className="text-[var(--txt-2)]">Why it matters:</span> {card.whyItMatters}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {card.benchmarks.map((b) => {
          const chipAccent =
            b.label === "Good"
              ? "var(--txt-2)"
              : b.label === "Great"
                ? accent
                : "var(--green)";
          return (
            <span
              key={b.label}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-base)] px-3 py-1 text-[11px] font-bold"
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

