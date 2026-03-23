export function CTASection() {
  return (
    <section className="bg-[var(--bg-base)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-[14px] border p-8 sm:p-10"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--green) 8%, transparent), color-mix(in srgb, var(--blue) 6%, transparent), color-mix(in srgb, var(--orange) 6%, transparent))",
            borderColor: "color-mix(in srgb, var(--green) 20%, transparent)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--green) 22%, transparent), transparent 62%)",
              opacity: 0.75,
            }}
          />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="text-balance text-[24px] font-extrabold tracking-[-1px] text-[var(--txt)] sm:text-[28px]">
              Ready to know the real numbers?
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--txt-2)]">
              Join analysts, fantasy players, and football obsessives who use
              NFL Stat Guru to go deeper than any other platform.
            </p>

            <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#"
                className="inline-flex h-11 w-full max-w-[280px] items-center justify-center rounded-full bg-[var(--green)] px-5 text-[13px] font-semibold text-[var(--on-green)] shadow-[var(--shadow-glow-g)] transition hover:brightness-110 hover:shadow-[var(--shadow-glow-g)]"
              >
                Start Free — No Card Needed
              </a>
              <a
                href="#"
                className="inline-flex h-11 w-full max-w-[200px] items-center justify-center rounded-full border border-[var(--border-md)] bg-[var(--glass)] px-5 text-[13px] font-semibold text-[var(--txt)] transition hover:bg-[var(--bg-hover)]"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

