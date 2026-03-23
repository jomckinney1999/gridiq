import Image from "next/image";

type Box = {
  label: string;
  value: string;
  pct: number;
  accent: "green" | "orange" | "blue";
  pctText: string;
};

const boxes: Box[] = [
  { label: "YPRR", value: "3.41", pct: 98, accent: "green", pctText: "98th pct" },
  {
    label: "EPA/Dropback",
    value: "+0.34",
    pct: 94,
    accent: "orange",
    pctText: "94th pct",
  },
  {
    label: "Adj Comp%",
    value: "74.2%",
    pct: 91,
    accent: "blue",
    pctText: "91st pct",
  },
  {
    label: "Big Time Throws",
    value: "18",
    pct: 88,
    accent: "green",
    pctText: "88th pct",
  },
  {
    label: "TWP Rate",
    value: "2.1%",
    pct: 85,
    accent: "orange",
    pctText: "85th pct",
  },
  {
    label: "Pressure to Sack",
    value: "31.4%",
    pct: 52,
    accent: "blue",
    pctText: "52nd pct",
  },
];

const ACCENT_VAR: Record<Box["accent"], string> = {
  green: "var(--green)",
  orange: "var(--orange)",
  blue: "var(--blue)",
};

function StatBox({ b }: { b: Box }) {
  const v = ACCENT_VAR[b.accent];
  return (
    <div
      className="rounded-[14px] border p-4"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${v} 12%, transparent), color-mix(in srgb, ${v} 5%, transparent))`,
        borderColor: `color-mix(in srgb, ${v} 20%, transparent)`,
      }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[var(--txt-3)]">
        {b.label}
      </div>
      <div className="mt-2 text-[22px] font-extrabold tracking-[-1px]" style={{ color: v }}>
        {b.value}
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] text-[var(--txt-2)]">
        <span>{b.pctText}</span>
        <span className="text-[var(--txt-3)]">Percentile</span>
      </div>
      <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-[var(--bg-subtle-2)]">
        <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: v }} />
      </div>
    </div>
  );
}

export function ProspectShowcase() {
  return (
    <section className="bg-[var(--bg-base)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[var(--green)]">
            Prospect Showcase
          </div>
          <h2 className="mt-3 text-balance text-[28px] font-extrabold tracking-[-1px] text-[var(--txt)] sm:text-[32px]">
            PFF-style depth, built into your workflow
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-[var(--txt-2)]">
            Grades, projections, scouting summary, and percentile metrics — all in a single, premium card.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[14px] border border-[var(--border-md)] bg-[var(--bg-card)]">
          {/* Header */}
          <div className="relative flex flex-col gap-6 overflow-hidden border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--green)_5%,transparent)] p-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Cinematic right-side background image */}
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 h-full w-[180px] bg-[var(--bg-card)]"
            >
              <Image
                src="/players/fernando-mendoza.png"
                alt=""
                fill
                priority={false}
                sizes="180px"
                className="prospect-image object-cover [image-rendering:pixelated]"
                style={{
                  objectPosition: "top center",
                  imageRendering: "pixelated",
                  maskImage: "linear-gradient(to right, transparent 0%, black 35%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 35%)",
                }}
              />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.6px] text-[var(--txt-3)]">
                Fernando Mendoza
              </div>
              <div className="mt-2 text-[22px] font-extrabold tracking-[-1px] text-[var(--txt)]">
                QB #15 · Indiana Hoosiers
              </div>
              <div className="mt-1 text-[13px] text-[var(--txt-2)]">
                RS Jr. · 6'3&quot; / 210lbs
              </div>
            </div>

            <div className="flex items-end gap-4 sm:justify-end">
              <div className="text-right">
                <div
                  className="text-[48px] font-black tracking-[-2px] text-[var(--green)]"
                  style={{
                    textShadow: "0 0 30px color-mix(in srgb, var(--green) 40%, transparent)",
                  }}
                >
                  91.6
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.6px] text-[var(--txt-3)]">
                  Overall Grade
                </div>
              </div>
              <div className="pb-2">
                <div className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--orange)_25%,transparent)] bg-[color-mix(in_srgb,var(--orange)_10%,transparent)] px-3 py-1 text-[11px] font-semibold text-[var(--orange)]">
                  Round 2 · Pick 42–58
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-6 border-b border-[var(--border)] px-6">
            {["Career Stats", "Comparables", "Grades by Game", "Analysis"].map((t, i) => (
              <div
                key={t}
                className={[
                  "py-4 text-[12px] font-semibold text-[var(--txt-2)]",
                  i === 0 ? "border-b-2 border-[var(--green)] text-[var(--txt)]" : "",
                ].join(" ")}
              >
                {t}
              </div>
            ))}
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 divide-y divide-[var(--border)] md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="p-6">
              <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[var(--txt)]">
                2025 Season
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                {[
                  ["Games", "16"],
                  ["Comp", "273"],
                  ["Att", "382"],
                  ["Comp%", "71.5", "green"],
                  ["Yards", "3536", "green"],
                  ["YPA", "9.3"],
                  ["TD", "41", "green"],
                  ["INT", "6", "orange"],
                  ["RTG", "129.4", "green"],
                ].map(([k, v, a]) => (
                  <div key={k} className="flex items-center justify-between gap-3">
                    <span className="text-[var(--txt-2)]">{k}</span>
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          a === "green"
                            ? "var(--green)"
                            : a === "orange"
                              ? "var(--orange)"
                              : "var(--txt)",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[var(--txt)]">
                2024 Season
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                {[
                  ["Games", "11"],
                  ["Comp", "265"],
                  ["Att", "390"],
                  ["Comp%", "67.9"],
                  ["Yards", "3004"],
                  ["YPA", "7.7"],
                  ["TD", "16"],
                  ["INT", "6", "orange"],
                  ["RTG", "98.1"],
                ].map(([k, v, a]) => (
                  <div key={k} className="flex items-center justify-between gap-3">
                    <span className="text-[var(--txt-2)]">{k}</span>
                    <span
                      className="font-semibold"
                      style={{
                        color: a === "orange" ? "var(--orange)" : "var(--txt)",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[var(--txt)]">
                Scout Summary
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 text-[12px]">
                {[
                  ["Ceiling", "WB2 starter", "green"],
                  ["Floor", "Quality backup"],
                  ["Arm Talent", "Elite", "green"],
                  ["Pocket Poise", "Above avg"],
                  ["Mobility", "Average"],
                  ["Comp", "Early Baker M."],
                  ["Projection", "Day 2", "orange"],
                ].map(([k, v, a]) => (
                  <div key={k} className="flex items-center justify-between gap-3">
                    <span className="text-[var(--txt-2)]">{k}</span>
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          a === "green"
                            ? "var(--green)"
                            : a === "orange"
                              ? "var(--orange)"
                              : "var(--txt)",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom stat boxes */}
          <div className="border-t border-[var(--border)] p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boxes.map((b) => (
                <StatBox key={b.label} b={b} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

