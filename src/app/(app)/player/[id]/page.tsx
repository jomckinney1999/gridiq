import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlayerProfilePage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">NFL Stat Guru</p>
      <h1 className="mt-3 text-[22px] font-extrabold text-[var(--txt)]">Player profile</h1>
      <p className="mt-2 text-[14px] text-[var(--txt-2)]">
        Profile for <span className="font-mono text-[var(--txt)]">{id}</span> is coming soon.
      </p>
      <Link
        href="/search"
        className="mt-8 inline-flex rounded-full bg-[var(--green)] px-5 py-2.5 text-[13px] font-semibold text-[var(--on-green)] transition hover:brightness-110"
      >
        Search stats
      </Link>
    </div>
  );
}
