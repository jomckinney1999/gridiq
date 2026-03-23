"use client";

export function ScrollingBanner() {
  const items = [
    { icon: "✦", iconColor: "green", text: <><strong>AI Search</strong> — ask any NFL question in plain English</> },
    { icon: "📈", iconColor: "orange", text: <><span className="text-[var(--orange)] font-bold">Trending</span> — <strong>Josh Allen</strong> leads all QBs in EPA/play this week</> },
    { icon: "🏈", iconColor: "green", text: <><strong>Fantasy Intel</strong> — snap counts, target share & usage trends</> },
    { icon: "⚡", iconColor: "blue", text: <><span className="text-[var(--blue)] font-semibold">Advanced Stats</span> — YPRR, EPA, CPOE, separation & more</> },
    { icon: "◈", iconColor: "purple", text: <><strong>2025 Draft Board</strong> — prospect profiles updated weekly</> },
    { icon: "🔥", iconColor: "orange", text: <><span className="text-[var(--orange)] font-bold">Hot</span> — <strong>CeeDee Lamb</strong> YPRR <span className="text-[var(--green)] font-bold">3.41</span> — #1 all WRs in 2024</> },
    { icon: "📊", iconColor: "green", text: <><strong>Stats School</strong> — advanced stats explained in plain English</> },
    { icon: "🗂", iconColor: "blue", text: <><strong>Historical Data</strong> — every NFL player & game since 1999</> },
    { icon: "▲", iconColor: "purple", text: <><span className="text-[var(--purple)] font-bold">Prospect Alert</span> — <strong>Rueben Bain</strong> pass rush win rate <span className="text-[var(--green)] font-bold">21.4%</span></> },
    { icon: "🎯", iconColor: "orange", text: <><strong>Route Tracking</strong> — routes run, separation & coverage data per game</> },
    { icon: "💡", iconColor: "green", text: <><span className="text-[var(--green)] font-bold">New</span> — player comparison tool now live</> },
    { icon: "🏆", iconColor: "blue", text: <><strong>Rankings</strong> — QB, WR, RB, TE updated after every game</> },
  ];

  const iconBg = {
    green: "bg-[var(--green)]/10 text-[var(--green)]",
    orange: "bg-[var(--orange)]/10 text-[var(--orange)]",
    blue: "bg-[var(--blue)]/10 text-[var(--blue)]",
    purple: "bg-[var(--purple)]/10 text-[var(--purple)]",
  };

  const styleSheet = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .banner-scroll {
    animation: marquee 35s linear infinite;
  }
  .banner-scroll:hover {
    animation-play-state: paused;
  }
`;

  return (
    <div className="relative overflow-hidden border-b border-t border-[var(--border)] bg-[var(--bg-card)]">
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />
      {/* Fade left edge */}
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-[var(--bg-card)] to-transparent" />
      {/* Fade right edge */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-[var(--bg-card)] to-transparent" />

      <div className="flex items-center py-2.5 w-max banner-scroll">
        {/* Render items twice for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center">
            <div className="inline-flex items-center gap-2 px-6 text-[12.5px] font-medium whitespace-nowrap text-[var(--txt-2)]">
              <div
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[5px] text-[11px] ${iconBg[item.iconColor as keyof typeof iconBg]}`}
              >
                {item.icon}
              </div>
              <span>{item.text}</span>
            </div>
            <div className="mx-1 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--txt-3)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
