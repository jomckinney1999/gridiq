import Link from "next/link";
import { ConsensusRankingLoader } from "@/components/guru/ConsensusRanking";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlayerProfilePage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 py-8 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">NFL Stat Guru</p>
      <h1 className="mt-3 text-[clamp(22px,4vw,32px)] font-black text-[var(--txt)]">Player profile</h1>
      <p className="mt-2 max-w-xl text-[14px] text-[var(--txt-2)]">
        Deep stats and context for this player. Consensus rankings aggregate major outlets and fan signal.
      </p>
      <p className="mt-1 font-mono text-[12px] text-[var(--txt-muted)]">ID: {id}</p>

      <section className="mt-10">
        <h2 className="text-[16px] font-bold text-[var(--txt)]">Consensus rankings</h2>
        <p className="mt-1 text-[13px] text-[var(--txt-muted)]">Expert lists, ADP, and how stock moved through the season.</p>
        <div className="mt-4">
          <ConsensusRankingLoader playerId={id} />
        </div>
      </section>

      <Link
        href="/search"
        className="mt-10 inline-flex rounded-full bg-[var(--green)] px-5 py-2.5 text-[13px] font-semibold text-[var(--on-green)] transition hover:brightness-110"
      >
        Search stats
      </Link>
    </div>
  );
}
