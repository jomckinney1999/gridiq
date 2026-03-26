import { CTASection } from "@/components/landing/CTASection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { FeaturedPlayers } from "@/components/landing/FeaturedPlayers";
import { Hero } from "@/components/landing/Hero";
import { HomeClient } from "@/components/landing/HomeClient";
import { ProspectShowcase } from "@/components/landing/ProspectShowcase";
import { ScrollingBanner } from "@/components/landing/ScrollingBanner";
import { TopNav } from "@/components/landing/TopNav";
import { getFeaturedPlayersForHome } from "@/lib/server/featured-players";

export const revalidate = 1800;

export default async function HomePage() {
  const featured = await getFeaturedPlayersForHome();

  return (
    <div className="min-h-dvh bg-[var(--bg-base)] text-[var(--txt)]">
      <TopNav />
      <main className="pt-[72px]">
        <ScrollingBanner />
        <Hero trendingPlayers={featured} />
        <FeatureGrid />
        <FeaturedPlayers players={featured} />
        <ProspectShowcase />
        <HomeClient />
        <CTASection />
      </main>
    </div>
  );
}
