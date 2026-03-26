import Link from "next/link";
import { BannerMindReader } from "@/components/games/GameHubView";
import { GamePlaceholder } from "@/components/games/GamePlaceholder";

export default function WhoAmIPage() {
  return (
    <div>
      <div className="px-4 pt-8 sm:px-6">
        <Link href="/games" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
          ← Game Room
        </Link>
      </div>
      <GamePlaceholder
        title="Who Am I?"
        description="Clue-based mystery player game — reveal clues and guess before you run out of tries."
        xpHint="First clue +100 XP · Complete +20 XP (coming soon)"
        source="Who Am I"
        banner={<BannerMindReader />}
      />
    </div>
  );
}
