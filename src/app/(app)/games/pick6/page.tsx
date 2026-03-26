import Link from "next/link";
import { BannerPick6 } from "@/components/games/GameHubView";
import { GamePlaceholder } from "@/components/games/GamePlaceholder";

export default function Pick6Page() {
  return (
    <div>
      <div className="px-4 pt-8 sm:px-6">
        <Link href="/games" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
          ← Game Room
        </Link>
      </div>
      <GamePlaceholder
        title="Pick 6 Props"
        description="Six props each week — nail overs and unders to climb the board."
        xpHint="Perfect card earns +150 XP (coming soon)"
        source="Pick 6 Props"
        banner={<BannerPick6 />}
      />
    </div>
  );
}
