import Image from "next/image";
import Link from "next/link";

type Accent = "green" | "orange" | "blue" | "purple";

type FeaturedPlayer = {
  id: string;
  name: string;
  pos: string;
  team: string;
  grade: string;
  accent: Accent;
  image: string;
  teamBg: string;
};

const featuredPlayers: FeaturedPlayer[] = [
  {
    id: "jayden-daniels",
    name: "Jayden Daniels",
    pos: "QB",
    team: "Washington Commanders",
    grade: "92.1",
    accent: "green",
    image: "/players/jayden-daniels.png",
    teamBg: "#5a1414",
  },
  {
    id: "ceedee-lamb",
    name: "CeeDee Lamb",
    pos: "WR",
    team: "Dallas Cowboys",
    grade: "94.8",
    accent: "blue",
    image: "/players/ceedee-lamb.png",
    teamBg: "#003594",
  },
  {
    id: "rueben-bain",
    name: "Rueben Bain",
    pos: "DT/DE",
    team: "2025 Draft",
    grade: "B+",
    accent: "purple",
    image: "/players/reuben-bain.png",
    teamBg: "#f47321",
  },
  {
    id: "fernando-mendoza",
    name: "Fernando Mendoza",
    pos: "QB",
    team: "Indiana Hoosiers",
    grade: "91.6",
    accent: "orange",
    image: "/players/fernando-mendoza.png",
    teamBg: "#990000",
  },
];

function accentVar(accent: Accent) {
  switch (accent) {
    case "green":
      return "var(--green)";
    case "orange":
      return "var(--orange)";
    case "blue":
      return "var(--blue)";
    case "purple":
      return "var(--purple)";
  }
}

export function FeaturedPlayers() {
  return (
    <section className="bg-[var(--bg-base)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[var(--green)]">
            This Week
          </div>
          <h2 className="mt-3 text-balance text-[28px] font-extrabold tracking-[-1px] text-[var(--txt)] sm:text-[32px]">
            Featured Players
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredPlayers.map((p) => {
            const c = accentVar(p.accent);
            return (
              <Link
                key={p.id}
                href={`/player/${p.id}`}
                className="group relative block h-[260px] overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--bg-card)] transition duration-200 ease-out"
              >
                {/* Hover: accent border */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-30 rounded-[14px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ boxShadow: `inset 0 0 0 1px ${c}` }}
                />

                {/* Top accent line */}
                <div
                  className="absolute inset-x-0 top-0 z-10 h-[2px]"
                  style={{ background: `linear-gradient(90deg, ${c}, transparent)` }}
                />

                {/* Team color dot */}
                <div
                  className="absolute left-3 top-3 z-20 h-2.5 w-2.5 rounded-full ring-2 ring-[color-mix(in_srgb,var(--txt)_45%,transparent)]"
                  style={{ backgroundColor: p.teamBg }}
                />

                {/* Grade badge */}
                <div
                  className={`absolute right-3 top-3 z-20 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                    p.accent === "green"
                      ? "border-[var(--green-border)] bg-[var(--green-light)] text-[var(--green)]"
                      : p.accent === "orange"
                        ? "border-[color-mix(in_srgb,var(--orange)_25%,transparent)] bg-[var(--orange-light)] text-[var(--orange)]"
                        : p.accent === "blue"
                          ? "border-[color-mix(in_srgb,var(--blue)_25%,transparent)] bg-[var(--blue-light)] text-[var(--blue)]"
                          : "border-[color-mix(in_srgb,var(--purple)_25%,transparent)] bg-[var(--purple-light)] text-[var(--purple)]"
                  }`}
                >
                  {p.grade}
                </div>

                {/* Top 55% — pixel art */}
                <div
                  className="relative h-[55%] w-full overflow-hidden"
                  style={{ backgroundColor: p.teamBg }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover object-top transition-transform duration-300 ease-out [image-rendering:pixelated] group-hover:scale-[1.08]"
                    style={{ imageRendering: "pixelated" }}
                    priority={false}
                  />
                </div>

                {/* Bottom 45% — gradient + text */}
                <div className="relative h-[45%]">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[color-mix(in_srgb,var(--bg-card)_80%,transparent)] to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                    <div className="text-[16px] font-bold text-[var(--txt)]">{p.name}</div>
                    <div className="mt-1 text-[12px] text-[var(--txt-2)]">
                      {p.pos} · {p.team}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
