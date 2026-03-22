const features = [
  {
    title: "AI Natural Language Search",
    desc: "Ask exactly what you want. Get instant, precise answers.",
    accent: "green",
    motif: "ai",
  },
  {
    title: "Route & Tracking Data",
    desc: "Separation, speed, routes, and usage — not just box scores.",
    accent: "orange",
    motif: "routes",
  },
  {
    title: "Prospect Profiles",
    desc: "PFF-style depth with grades, comps, and projections.",
    accent: "blue",
    motif: "profiles",
  },
  {
    title: "Advanced Metrics",
    desc: "EPA, YPRR, CPOE, win rates, and more — all in one place.",
    accent: "purple",
    motif: "metrics",
  },
  {
    title: "Historical Depth 1999+",
    desc: "Decades of data for trends, comps, and context.",
    accent: "green",
    motif: "history",
  },
  {
    title: "Fantasy Intelligence",
    desc: "Usage, matchups, and edge signals built for obsessives.",
    accent: "blue",
    motif: "fantasy",
  },
] as const;

function accentColor(accent: (typeof features)[number]["accent"]) {
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

function svgDataUri(svg: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function motifSvg(
  motif: (typeof features)[number]["motif"],
  color: string,
) {
  const stroke = color;
  const faint = `${color}55`;

  switch (motif) {
    case "routes":
      return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${stroke}" stop-opacity="0.14"/>
      <stop offset="1" stop-color="${stroke}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M80 300 C 160 220, 250 260, 320 180 S 470 120, 540 180 S 640 280, 700 170"
        fill="none" stroke="url(#g)" stroke-width="3"/>
  <path d="M60 120 C 140 160, 220 120, 300 150 S 420 240, 520 220 S 620 150, 700 240"
        fill="none" stroke="${faint}" stroke-width="2" stroke-dasharray="6 10" opacity="0.55"/>
  <g fill="${stroke}" opacity="0.12">
    <circle cx="80" cy="300" r="5"/><circle cx="320" cy="180" r="5"/><circle cx="540" cy="180" r="5"/><circle cx="700" cy="170" r="5"/>
    <circle cx="60" cy="120" r="4"/><circle cx="300" cy="150" r="4"/><circle cx="520" cy="220" r="4"/><circle cx="700" cy="240" r="4"/>
  </g>
  <g stroke="${stroke}" opacity="0.08">
    <path d="M120 360 h520" />
    <path d="M120 80 h520" />
    <path d="M160 80 v280" />
    <path d="M560 80 v280" />
  </g>
</svg>`);

    case "metrics":
      return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">
  <g stroke="${stroke}" opacity="0.10">
    <path d="M80 330 H680" />
    <path d="M80 90 H680" />
    <path d="M80 90 V330" />
    <path d="M680 90 V330" />
    <path d="M160 90 V330" />
    <path d="M240 90 V330" />
    <path d="M320 90 V330" />
    <path d="M400 90 V330" />
    <path d="M480 90 V330" />
    <path d="M560 90 V330" />
  </g>
  <path d="M90 290 C 150 260, 200 310, 260 250 S 380 210, 440 230 S 560 320, 680 160"
        fill="none" stroke="${stroke}" stroke-width="3" opacity="0.16"/>
  <path d="M90 250 C 160 220, 220 260, 280 210 S 420 170, 520 200 S 610 250, 680 210"
        fill="none" stroke="${faint}" stroke-width="2" stroke-dasharray="5 9" opacity="0.60"/>
  <g fill="${stroke}" opacity="0.12">
    <circle cx="90" cy="290" r="4"/><circle cx="260" cy="250" r="4"/><circle cx="440" cy="230" r="4"/><circle cx="680" cy="160" r="4"/>
  </g>
</svg>`);

    case "profiles":
      return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">
  <g stroke="${stroke}" opacity="0.10">
    <rect x="90" y="90" width="540" height="240" rx="18" fill="none" />
    <path d="M140 140 H600" />
    <path d="M140 175 H520" />
    <path d="M140 210 H600" />
    <path d="M140 245 H520" />
    <path d="M140 280 H600" />
  </g>
  <g opacity="0.12" fill="${stroke}">
    <circle cx="150" cy="145" r="16"/>
    <path d="M120 220c8-30 22-44 30-44s22 14 30 44" />
  </g>
  <g stroke="${stroke}" opacity="0.08">
    <path d="M520 120 V300" />
    <path d="M560 120 V300" />
    <path d="M600 120 V300" />
  </g>
</svg>`);

    case "history":
      return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">
  <path d="M110 240 H610" stroke="${stroke}" stroke-width="3" opacity="0.12"/>
  <g stroke="${stroke}" stroke-width="2" opacity="0.12">
    <path d="M160 220 V260" />
    <path d="M230 220 V260" />
    <path d="M300 220 V260" />
    <path d="M370 220 V260" />
    <path d="M440 220 V260" />
    <path d="M510 220 V260" />
    <path d="M580 220 V260" />
  </g>
  <g fill="${stroke}" opacity="0.10">
    <circle cx="160" cy="240" r="5"/><circle cx="300" cy="240" r="5"/><circle cx="440" cy="240" r="5"/><circle cx="580" cy="240" r="5"/>
  </g>
  <path d="M140 160 C 230 120, 300 180, 390 140 S 540 160, 620 120"
        fill="none" stroke="${faint}" stroke-width="2" stroke-dasharray="6 10" opacity="0.60"/>
</svg>`);

    case "fantasy":
      return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">
  <g stroke="${stroke}" opacity="0.10">
    <path d="M120 300 H620" />
    <path d="M120 120 H620" />
    <path d="M120 120 V300" />
    <path d="M620 120 V300" />
  </g>
  <path d="M140 270 C 220 220, 260 280, 340 210 S 460 190, 520 240 S 580 260, 620 170"
        fill="none" stroke="${stroke}" stroke-width="3" opacity="0.16"/>
  <g fill="${stroke}" opacity="0.12">
    <path d="M540 145l8 18 19 2-14 13 4 19-17-10-17 10 4-19-14-13 19-2z" />
  </g>
  <g stroke="${faint}" opacity="0.60">
    <path d="M420 140 h160" stroke-dasharray="7 10" />
    <path d="M420 165 h130" stroke-dasharray="7 10" />
    <path d="M420 190 h150" stroke-dasharray="7 10" />
  </g>
</svg>`);

    case "ai":
    default:
      return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">
  <defs>
    <radialGradient id="r" cx="0.35" cy="0.35" r="0.9">
      <stop offset="0" stop-color="${stroke}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${stroke}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <g stroke="${stroke}" opacity="0.10">
    <path d="M120 120 H600" />
    <path d="M120 180 H600" />
    <path d="M120 240 H600" />
    <path d="M120 300 H600" />
    <path d="M180 90 V330" />
    <path d="M300 90 V330" />
    <path d="M420 90 V330" />
    <path d="M540 90 V330" />
  </g>
  <circle cx="270" cy="170" r="110" fill="url(#r)" opacity="0.9"/>
  <g fill="${stroke}" opacity="0.12">
    <path d="M520 140l6 14 15 2-11 10 3 15-13-8-13 8 3-15-11-10 15-2z" />
    <path d="M580 230l5 11 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2z" />
  </g>
</svg>`);
  }
}

export function FeatureGrid() {
  return (
    <section className="bg-[#050507] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#00ff87]">
            Why GridIQ
          </div>
          <h2 className="mt-3 text-balance text-[28px] font-extrabold tracking-[-1px] text-[#f2f2f5] sm:text-[32px]">
            Everything other sites won’t show you
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-[#8888a0]">
            Premium, dark-first analytics with neon clarity — built for the
            questions that matter.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const c = accentColor(f.accent);
            return (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d10] p-5 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.10)] hover:bg-[#1c1c21]"
              >
                {/* Full-bleed background "image" + cinematic readability overlays */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.20] transition-opacity duration-200 ease-out group-hover:opacity-[0.26]"
                  style={{
                    backgroundImage: `${motifSvg(f.motif, c)}, radial-gradient(circle at 30% 30%, ${c}22, transparent 62%)`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    transform: "scale(1.02)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(13,13,16,0.25) 0%, rgba(13,13,16,0.82) 55%, rgba(13,13,16,0.98) 100%)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 20%, rgba(255,255,255,0.05), transparent 55%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.55), transparent 60%)",
                  }}
                />

                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-10 -right-10 h-[180px] w-[180px] rounded-full blur-[32px]"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${c}14, transparent 62%)`,
                    opacity: 0.08,
                  }}
                />

                <div
                  className="relative z-10 flex h-[34px] w-[34px] items-center justify-center rounded-[12px]"
                  style={{ backgroundColor: `${c}1f` }}
                >
                  <div
                    className="h-3 w-3 rounded-[4px]"
                    style={{ backgroundColor: c }}
                  />
                </div>

                <div className="relative z-10 mt-4 text-[14px] font-bold text-[#f2f2f5]">
                  {f.title}
                </div>
                <div className="relative z-10 mt-2 text-[12px] leading-relaxed text-[#8888a0]">
                  {f.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

