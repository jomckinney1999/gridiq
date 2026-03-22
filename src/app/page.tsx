import { CTASection } from "@/components/landing/CTASection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { FeaturedPlayers } from "@/components/landing/FeaturedPlayers";
import { Hero } from "@/components/landing/Hero";
import { ProspectShowcase } from "@/components/landing/ProspectShowcase";
import { ScrollingBanner } from "@/components/landing/ScrollingBanner";
import { TopNav } from "@/components/landing/TopNav";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#050507] text-[#f2f2f5]">
      <TopNav />
      <main className="pt-[72px]">
        <ScrollingBanner />
        <Hero />
        <FeatureGrid />
        <FeaturedPlayers />
        <ProspectShowcase />
        <CTASection />
      </main>
    </div>
  );
}

