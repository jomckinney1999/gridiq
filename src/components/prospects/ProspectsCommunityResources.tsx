type CardDef = {
  key: string;
  border: string;
  badge: { bg: string; fg: string; label: string };
  name: string;
  description: string;
  href?: string;
  buttonLabel?: string;
  philosophy?: boolean;
};

const CARDS: CardDef[] = [
  {
    key: "pff",
    border: "var(--green)",
    badge: { bg: "var(--green-light)", fg: "var(--green)", label: "Grades & Analytics" },
    name: "Pro Football Focus",
    description:
      "The industry standard for player grading and advanced analytics. Their prospect grades, positional rankings, and combine data are the closest thing to an objective truth in draft evaluation. If you're serious about prospects, PFF is non-negotiable.",
    href: "https://www.pff.com",
    buttonLabel: "Visit PFF →",
  },
  {
    key: "connor",
    border: "var(--blue)",
    badge: { bg: "var(--blue-light)", fg: "var(--blue)", label: "NFL Network / Podcast" },
    name: "Connor Rogers",
    description:
      "One of the most respected draft voices in the business. Connor's work at NFL Network and The Ringer brings genuine scouting perspective to every prospect conversation. His takes on scheme fit and NFL readiness go beyond the highlight tape.",
    href: "https://twitter.com/ConnorJRogers",
    buttonLabel: "Follow Connor →",
  },
  {
    key: "trevor",
    border: "var(--orange)",
    badge: { bg: "var(--orange-light)", fg: "var(--orange)", label: "PFF / Draft Analysis" },
    name: "Trevor Sikkema",
    description:
      "PFF's lead draft analyst and one of the most thorough prospect evaluators in the industry. Trevor's combine breakdowns, positional rankings, and tape-based grades are essential reading during draft season. A must-follow from now through April.",
    href: "https://twitter.com/TampaBayTre",
    buttonLabel: "Follow Trevor →",
  },
  {
    key: "nflse",
    border: "var(--purple)",
    badge: { bg: "var(--purple-light)", fg: "var(--purple)", label: "Podcast / Community" },
    name: "NFL Stock Exchange",
    description:
      "A unique and entertaining approach to prospect evaluation that treats draft stock like a financial market. Buy low, sell high — their framework for thinking about prospect value is genuinely different from anything else out there and makes draft season way more fun.",
    href: "https://open.spotify.com/search/nfl%20stock%20exchange%20podcast",
    buttonLabel: "Find the Show →",
  },
  {
    key: "mockdraftable",
    border: "var(--green)",
    badge: { bg: "var(--green-light)", fg: "var(--green)", label: "Free Tool" },
    name: "MockDraftable",
    description:
      "The best free tool for comparing NFL combine measurements and athleticism scores. If you want to know how a prospect's 40 time, vertical, and RAS score compare to every historical player at their position, this is your first stop.",
    href: "https://www.mockdraftable.com",
    buttonLabel: "Use the Tool →",
  },
  {
    key: "philosophy",
    border: "var(--txt-3)",
    badge: { bg: "var(--bg-secondary)", fg: "var(--txt-2)", label: "A Note" },
    name: "Data + Tape = Truth",
    description:
      "NFL Stat Guru gives you the numbers. But the best draft analysts combine metrics with film study, positional coaching knowledge, and character research. Use our data as a starting point — then go watch the tape.",
    philosophy: true,
  },
];

export function ProspectsCommunityResources() {
  return (
    <section id="resources" className="scroll-mt-28 border-t border-[var(--border)] pt-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">From the Community</p>
        <h2 className="mt-3 text-balance text-[26px] font-extrabold tracking-[-0.5px] text-[var(--txt)] sm:text-[30px]">
          Resources We Actually Recommend
        </h2>
        <p className="mt-4 text-[14px] leading-relaxed text-[var(--txt-2)]">
          The best draft analysis comes from people who watch every snap of tape. These are the voices and platforms we genuinely respect for prospect evaluation — no
          sponsorships, no affiliates, just good work.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <div
            key={card.key}
            className={[
              "relative flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]",
              "border-l-[3px]",
              card.philosophy ? "bg-[color-mix(in_srgb,var(--bg-base)_55%,var(--bg-card))]" : "",
            ].join(" ")}
            style={{ borderLeftColor: card.border }}
          >
            <div className="flex flex-1 flex-col p-5 pb-10">
              <span
                className="inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{ backgroundColor: card.badge.bg, color: card.badge.fg }}
              >
                {card.badge.label}
              </span>
              <h3 className="mt-3 text-[15px] font-bold text-[var(--txt)]">{card.name}</h3>
              <p
                className={[
                  "mt-2 text-[12.5px] leading-relaxed text-[var(--txt-2)]",
                  card.philosophy ? "italic text-[var(--txt-muted)]" : "line-clamp-[8]",
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

              <p className="absolute bottom-4 right-4 max-w-[55%] text-right text-[10px] leading-tight text-[var(--txt-3)]">
                Not affiliated
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-4 max-w-3xl text-center text-[11px] leading-relaxed text-[var(--txt-3)]">
        NFL Stat Guru is not affiliated with, sponsored by, or compensated by any of the above resources. These are genuine
        recommendations — one draft nerd to another. Support independent football analysis.
      </p>
    </section>
  );
}
