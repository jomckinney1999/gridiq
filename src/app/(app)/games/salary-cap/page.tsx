import Link from "next/link";
import { BannerSalary } from "@/components/games/GameHubView";
import { GamePlaceholder } from "@/components/games/GamePlaceholder";

export default function SalaryCapPage() {
  return (
    <div>
      <div className="px-4 pt-8 sm:px-6">
        <Link href="/games" className="text-[13px] font-semibold text-[var(--green)] hover:underline">
          ← Game Room
        </Link>
      </div>
      <GamePlaceholder
        title="$50M Salary Cap Challenge"
        description="Build the best weekly lineup under a hard cap. Leaderboard resets every Tuesday."
        xpHint="Win earns +75 XP (coming soon)"
        source="Salary Cap Challenge"
        banner={<BannerSalary />}
      />
    </div>
  );
}
