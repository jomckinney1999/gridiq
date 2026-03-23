type ComingSoonPlaceholderProps = {
  title: string;
};

export function ComingSoonPlaceholder({ title }: ComingSoonPlaceholderProps) {
  return (
    <div className="flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">NFL Stat Guru</p>
        <h1 className="mt-3 text-balance text-[28px] font-extrabold tracking-[-0.5px] text-[var(--txt)] sm:text-[32px]">
          {title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--txt-2)]">
          Coming soon — we&apos;re building this experience. Check back shortly.
        </p>
        <div
          aria-hidden
          className="mx-auto mt-10 h-px max-w-[200px] bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--green)_35%,transparent)] to-transparent"
        />
      </div>
    </div>
  );
}
