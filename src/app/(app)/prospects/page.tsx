import { ProspectsCommunityResources } from "@/components/prospects/ProspectsCommunityResources";

export default function ProspectsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6">
      <header className="flex flex-col gap-3 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">NFL Stat Guru</p>
          <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.5px] text-[var(--txt)] sm:text-[32px]">Prospects</h1>
        </div>
        <nav aria-label="Prospects page sections">
          <a
            href="#resources"
            className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-[13px] font-semibold text-[var(--txt-2)] transition hover:border-[var(--green-border)] hover:bg-[var(--green-light)] hover:text-[var(--green)]"
          >
            Resources
          </a>
        </nav>
      </header>

      <section className="border-b border-[var(--border)] py-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--txt-2)]">
            Coming soon — we&apos;re building prospect profiles, grades, and scouting tools here. Check back shortly.
          </p>
          <div
            aria-hidden
            className="mx-auto mt-10 h-px max-w-[200px] bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--green)_35%,transparent)] to-transparent"
          />
        </div>
      </section>

      <ProspectsCommunityResources />
    </div>
  );
}
