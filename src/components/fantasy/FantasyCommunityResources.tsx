type ResourceCard = {
  accent: "green" | "blue" | "orange" | "purple";
  badge: string;
  name: string;
  description: string;
  href?: string;
  buttonLabel?: string;
  /** Card 4 style — philosophy note */
  philosophy?: boolean;
};

const ACCENT: Record<ResourceCard["accent"], string> = {
  green: "var(--green)",
  blue: "var(--blue)",
  orange: "var(--orange)",
  purple: "var(--purple)",
};

const CARDS: ResourceCard[] = [
  {
    accent: "green",
    badge: "Podcast / Analysis",
    name: "Legendary Upside",
    description:
      "One of the sharpest fantasy football minds in the game. Deep-dive analysis, prospect breakdowns, and takes that go well beyond the surface stats. If you're serious about fantasy, this is required listening.",
    href: "https://open.spotify.com/search/Legendary%20Upside%20podcast",
    buttonLabel: "Find on Spotify →",
  },
  {
    accent: "blue",
    badge: "Film Study / Newsletter",
    name: "Reception Perception",
    description:
      "The gold standard for wide receiver film analysis. Matt Harmon's route-running grades and coverage data go deeper than any algorithm — a must-read for anyone drafting WRs in fantasy or real-life scouting.",
    href: "https://www.receptionperception.com",
    buttonLabel: "Read More →",
  },
  {
    accent: "orange",
    badge: "Platform / Best Ball",
    name: "Underdog Network",
    description:
      "The best platform for best ball fantasy and high-stakes drafts. Their ADP data, draft tools, and fantasy content are genuinely class-leading. If you play best ball, this is your home base.",
    href: "https://underdognetwork.com",
    buttonLabel: "Visit Underdog →",
  },
  {
    accent: "purple",
    badge: "Philosophy",
    name: "Beyond the Algorithm",
    description:
      "Data and AI are powerful tools — but the best fantasy players combine analytics with film study, beat reporter intel, and genuine football knowledge. NFL Stat Guru gives you the data layer. These resources give you the rest.",
    philosophy: true,
  },
];

export function FantasyCommunityResources() {
  return (
    <section className="mt-16 border-t border-[var(--border)] pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">From the Community</p>
        <h2 className="mt-3 text-balance text-[26px] font-extrabold tracking-[-0.5px] text-[var(--txt)] sm:text-[30px]">
          Resources We Actually Recommend
        </h2>
        <p className="mt-4 text-[14px] leading-relaxed text-[var(--txt-2)]">
          Some of the best football analysis comes from people, not algorithms. These are voices and platforms we genuinely
          respect — no sponsorships, no affiliates, just good work.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {CARDS.map((card) => {
          const border = ACCENT[card.accent];
          const isPhilosophy = card.philosophy === true;

          return (
            <div
              key={card.name}
              className={[
                "flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]",
                "border-l-4",
                isPhilosophy ? "bg-[color-mix(in_srgb,var(--bg-base)_60%,var(--bg-card))]" : "",
              ].join(" ")}
              style={{ borderLeftColor: border }}
            >
              <div className="flex flex-1 flex-col p-5">
                <span className="inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--bg-card2)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--txt-2)]">
                  {card.badge}
                </span>
                <h3 className="mt-3 text-[16px] font-bold text-[var(--txt)]">{card.name}</h3>
                <p
                  className={[
                    "mt-2 flex-1 text-[13px] leading-relaxed text-[var(--txt-2)]",
                    isPhilosophy ? "italic text-[var(--txt-muted)]" : "line-clamp-[8]",
                  ].join(" ")}
                >
                  {card.description}
                </p>

                {card.href && card.buttonLabel ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-fit items-center rounded-lg border border-[var(--border-md)] bg-transparent px-4 py-2 text-[13px] font-semibold text-[var(--txt)] transition hover:border-[var(--green-border)] hover:bg-[var(--green-light)] hover:text-[var(--green)]"
                  >
                    {card.buttonLabel}
                  </a>
                ) : null}

                <p className="mt-4 text-[10px] leading-snug text-[var(--txt-3)]">Not affiliated — editorial pick only.</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-[12px] leading-relaxed text-[var(--txt-3)]">
        NFL Stat Guru is not affiliated with, sponsored by, or paid by any of the above. These are genuine recommendations
        from one football analytics nerd to another.
      </p>
    </section>
  );
}
