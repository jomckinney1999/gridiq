import Link from "next/link";
import { BannerDraft } from "@/components/games/GameHubView";
import { GamePlaceholder } from "@/components/games/GamePlaceholder";

export default function MockDraftPage() {
  return (
    <div>
      <div className="px-4 pt-8 sm:px-6">
        <Link href="/games" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
          ← Game Room
        </Link>
      </div>
      <GamePlaceholder
        title="Mock Draft Simulator"
        description="Full 32-team mock draft with clocks, trades, and war rooms. Build your board and run the clock."
        xpHint="Win earns +75 XP (coming soon)"
        source="Mock Draft Simulator"
        banner={<BannerDraft />}
      />
    </div>
  );
}
