import Link from "next/link";

export default function GamesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6">
      <header className="mb-12 text-center">
        <h1 className="text-[32px] font-extrabold tracking-[-1px] text-[var(--txt)] sm:text-[40px]">
          Games
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--txt-2)]">
          Daily challenges and fun football debates
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <Link
          href="/trivia"
          className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 text-left shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--green)_35%,transparent)] hover:shadow-[var(--shadow-md)] sm:p-8"
        >
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-[var(--green)] opacity-90 transition group-hover:opacity-100"
          />
          <div className="pl-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[40px] leading-none" aria-hidden>
                ⚡
              </span>
              <span className="rounded-full border border-[var(--green-border)] bg-[var(--green-light)] px-3 py-1 text-[11px] font-semibold text-[var(--green)]">
                Daily · Resets at midnight
              </span>
            </div>
            <h2 className="mt-5 text-[22px] font-extrabold tracking-[-0.5px] text-[var(--txt)]">
              Daily Stat Grid
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--txt-2)]">
              Name the player behind each stat line. New puzzle every day. Build your streak.
            </p>
            <span className="mt-6 inline-flex items-center text-[13px] font-semibold text-[var(--green)] transition group-hover:gap-1">
              Play now
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </Link>

        <Link
          href="/tierlist"
          className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 text-left shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--blue)_35%,transparent)] hover:shadow-[var(--shadow-md)] sm:p-8"
        >
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-[var(--blue)] opacity-90 transition group-hover:opacity-100"
          />
          <div className="pl-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[40px] leading-none" aria-hidden>
                🏆
              </span>
              <span className="rounded-full border border-[color-mix(in_srgb,var(--blue)_30%,transparent)] bg-[var(--blue-light)] px-3 py-1 text-[11px] font-semibold text-[var(--blue)]">
                Share with friends
              </span>
            </div>
            <h2 className="mt-5 text-[22px] font-extrabold tracking-[-0.5px] text-[var(--txt)]">
              NFL Tier List Maker
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--txt-2)]">
              Rank QBs, WRs, RBs and more. Save and share your rankings with friends.
            </p>
            <span className="mt-6 inline-flex items-center text-[13px] font-semibold text-[var(--blue)] transition group-hover:gap-1">
              Open tier lists
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
