import { Logo } from "@/components/ui/Logo";

export default function MarketingHomePage() {
  return (
    <div className="min-h-dvh gridiq-grid">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 backdrop-blur-[16px]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-6">
              <Logo />
              <nav className="hidden items-center gap-4 text-[12px] font-medium text-[color:var(--txt-2)] md:flex">
                <a className="hover:text-[color:var(--txt)]" href="/search">
                  Stats
                </a>
                <a className="hover:text-[color:var(--txt)]" href="/prospects">
                  Prospects
                </a>
                <a className="hover:text-[color:var(--txt)]" href="/advanced">
                  Advanced
                </a>
              </nav>
            </div>
          </div>
          <a
            href="/search"
            className="rounded-full bg-[color:var(--neon-green)] px-3.5 py-2 text-[12px] font-semibold text-[color:var(--bg-base)] shadow-[0_0_20px_var(--g-glow)] hover:brightness-110"
          >
            Get Early Access →
          </a>
        </div>

        <div className="mt-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.6px] text-[color:var(--neon-green)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--neon-green)] shadow-[0_0_14px_var(--g-glow)]" />
            Live
          </div>

          <h1 className="mt-5 text-[length:var(--text-hero)] font-black tracking-[-2px] text-[color:var(--txt)]">
            The NFL Stats Platform
            <br />
            <span className="bg-gradient-to-r from-[color:var(--neon-green)] via-[color:var(--neon-blue)] to-[color:var(--neon-orange)] bg-clip-text text-transparent">
              Built for Obsessives
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-[1.65] text-[color:var(--txt-2)]">
            Ask the Guru anything. From route counts to playoff fumbles — NFL Stat
            Guru answers the questions ESPN can’t.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="/search"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--neon-green)] px-5 text-[13px] font-semibold text-[color:var(--bg-base)] shadow-[0_0_24px_var(--g-glow)] hover:brightness-110"
            >
              Start Searching Free
            </a>
            <a
              href="#"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.02] px-5 text-[13px] font-semibold text-[color:var(--txt)] hover:bg-white/[0.04]"
            >
              Watch Demo ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

