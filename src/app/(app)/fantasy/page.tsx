import { FantasyCommunityResources } from "@/components/fantasy/FantasyCommunityResources";

export default function FantasyPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <section className="border-b border-[var(--border)] pb-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">NFL Stat Guru</p>
          <h1 className="mt-3 text-balance text-[28px] font-extrabold tracking-[-0.5px] text-[var(--txt)] sm:text-[32px]">
            Fantasy
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--txt-2)]">
            Coming soon — we&apos;re building fantasy tools and workflows here. Check back shortly.
          </p>
          <div
            aria-hidden
            className="mx-auto mt-10 h-px max-w-[200px] bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--green)_35%,transparent)] to-transparent"
          />
        </div>
      </section>

      <FantasyCommunityResources />
    </div>
  );
}
