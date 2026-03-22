export function CTASection() {
  return (
    <section className="bg-[#050507] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-[14px] border p-8 sm:p-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,255,135,0.08), rgba(59,158,255,0.06), rgba(255,107,43,0.06))",
            borderColor: "rgba(0,255,135,0.2)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(0,255,135,0.22), transparent 62%)",
              opacity: 0.75,
            }}
          />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="text-balance text-[24px] font-extrabold tracking-[-1px] text-[#f2f2f5] sm:text-[28px]">
              Ready to know the real numbers?
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-[#8888a0]">
              Join analysts, fantasy players, and football obsessives who use
              NFL Stat Guru to go deeper than any other platform.
            </p>

            <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#"
                className="inline-flex h-11 w-full max-w-[280px] items-center justify-center rounded-full bg-[#00ff87] px-5 text-[13px] font-semibold text-[#050507] shadow-[0_0_24px_rgba(0,255,135,0.25)] transition hover:brightness-110 hover:shadow-[0_0_28px_rgba(0,255,135,0.35)]"
              >
                Start Free — No Card Needed
              </a>
              <a
                href="#"
                className="inline-flex h-11 w-full max-w-[200px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(13,13,16,0.35)] px-5 text-[13px] font-semibold text-[#f2f2f5] transition hover:bg-[#1c1c21]"
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

