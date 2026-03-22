import Image from "next/image";

type Accent = "green" | "orange" | "blue" | "purple";

type Player = {
  name: string;
  pos: string;
  team: string;
  grade: string;
  accent: Accent;
  imageSrc: string;
  teamLogoSrc?: string;
};

const players: Player[] = [
  {
    name: "Jayden Daniels",
    pos: "QB",
    team: "Washington",
    grade: "92.1",
    accent: "green",
    imageSrc: "/players/qb.jpg",
    teamLogoSrc: "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png",
  },
  {
    name: "Jaylen Waddle",
    pos: "WR",
    team: "Miami",
    grade: "87.4",
    accent: "orange",
    imageSrc: "/players/wr.jpg",
    teamLogoSrc: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png",
  },
  {
    name: "CeeDee Lamb",
    pos: "WR",
    team: "Dallas",
    grade: "94.8",
    accent: "blue",
    imageSrc: "/players/wr.jpg",
    teamLogoSrc: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png",
  },
  {
    name: "Rueben Bain",
    pos: "DT/DE",
    team: "2025 Draft",
    grade: "B+",
    accent: "purple",
    imageSrc: "/players/dt.jpg",
  },
];

function accentColor(accent: Accent) {
  switch (accent) {
    case "green":
      return "#00ff87";
    case "orange":
      return "#ff6b2b";
    case "blue":
      return "#3b9eff";
    case "purple":
      return "#a855f7";
  }
}

export function FeaturedPlayers() {
  return (
    <section className="bg-[#050507] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#00ff87]">
            Featured Players
          </div>
          <h2 className="mt-3 text-balance text-[28px] font-extrabold tracking-[-1px] text-[#f2f2f5] sm:text-[32px]">
            Real imagery, premium cards
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-[#8888a0]">
            Cinematic visuals with neon-grade clarity — designed for quick scanning.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {players.map((p) => {
            const c = accentColor(p.accent);
            return (
              <div
                key={p.name}
                className="group relative h-[280px] overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[#0d0d10] transition duration-200 ease-out hover:border-[rgba(255,255,255,0.10)]"
              >
                {/* Top accent line */}
                <div
                  className="absolute inset-x-0 top-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, ${c}, transparent)` }}
                />

                {/* Grade badge */}
                <div
                  className="absolute right-3 top-3 z-20 rounded-full border px-2.5 py-1 text-[11px] font-bold"
                  style={{
                    color: c,
                    backgroundColor: `${c}1a`,
                    borderColor: `${c}33`,
                  }}
                >
                  {p.grade}
                </div>

                {/* Team logo (top-left) */}
                {p.teamLogoSrc ? (
                  <div className="absolute left-3 top-3 z-20">
                    <div className="relative h-8 w-8 overflow-hidden rounded-[10px] border border-[rgba(255,255,255,0.10)] bg-[#0d0d10]">
                      <Image
                        src={p.teamLogoSrc}
                        alt={`${p.team} logo`}
                        fill
                        sizes="32px"
                        className="object-contain p-1"
                      />
                    </div>
                  </div>
                ) : null}

                {/* Image top 60% */}
                <div className="relative h-[60%] w-full overflow-hidden">
                  <Image
                    src={p.imageSrc}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                    priority={false}
                  />
                </div>

                {/* Bottom gradient overlay + text */}
                <div className="relative h-[40%]">
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(5,5,7,1) 0%, rgba(5,5,7,0) 90%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-[14px] font-bold text-[#f2f2f5]">
                      {p.name}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.6px] text-[#8888a0]">
                      {p.pos} · {p.team}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

