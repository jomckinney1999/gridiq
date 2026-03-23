const features = [
  {
    title: "AI Natural Language Search",
    desc: "Ask exactly what you want. Get instant, precise answers.",
    accent: "green" as const,
  },
  {
    title: "Route & Tracking Data",
    desc: "Separation, speed, routes, and usage — not just box scores.",
    accent: "orange" as const,
  },
  {
    title: "Prospect Profiles",
    desc: "PFF-style depth with grades, comps, and projections.",
    accent: "blue" as const,
  },
  {
    title: "Advanced Metrics",
    desc: "EPA, YPRR, CPOE, win rates, and more — all in one place.",
    accent: "purple" as const,
  },
  {
    title: "Historical Depth 1999+",
    desc: "Decades of data for trends, comps, and context.",
    accent: "green" as const,
  },
  {
    title: "Fantasy Intelligence",
    desc: "Usage, matchups, and edge signals built for obsessives.",
    accent: "blue" as const,
  },
];

const ACCENT_ICON: Record<
  (typeof features)[number]["accent"],
  { bg: string; fg: string }
> = {
  green: { bg: "var(--green-light)", fg: "var(--green)" },
  orange: { bg: "var(--orange-light)", fg: "var(--orange)" },
  blue: { bg: "var(--blue-light)", fg: "var(--blue)" },
  purple: { bg: "var(--purple-light)", fg: "var(--purple)" },
};

export function FeatureGrid() {
  return (
    <section className="bg-[var(--bg-base)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[var(--green)]">
            Why NFL Stat Guru
          </div>
          <h2 className="mt-3 text-balance text-[28px] font-extrabold tracking-[-1px] text-[var(--txt)] sm:text-[32px]">
            Everything other sites won’t show you
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-[var(--txt-2)]">
            Premium, dark-first analytics with neon clarity — built for the
            questions that matter.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const icon = ACCENT_ICON[f.accent];
            return (
              <div key={f.title} className="feature-card">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                  style={{ backgroundColor: icon.bg }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: icon.fg }}
                    aria-hidden
                  />
                </div>
                <div className="mb-1.5 mt-4 text-[14px] font-bold text-[var(--txt)]">{f.title}</div>
                <div className="text-[12.5px] leading-[1.6] text-[var(--txt-2)]">{f.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
