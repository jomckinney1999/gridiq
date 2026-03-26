import Link from "next/link";
import { BannerSurvivor } from "@/components/games/GameHubView";
import { GamePlaceholder } from "@/components/games/GamePlaceholder";

export default function SurvivorPage() {
  return (
    <div>
      <div className="px-4 pt-8 sm:px-6">
        <Link href="/games" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
          ← Game Room
        </Link>
      </div>
      <GamePlaceholder
        title="NFL Survivor Pick'em"
        description="Create or join a private league. One winner per week — last standing takes the pot."
        xpHint="Survive earns +40 XP (coming soon)"
        source="Survivor Pick'em"
        banner={<BannerSurvivor />}
      />
    </div>
  );
}
