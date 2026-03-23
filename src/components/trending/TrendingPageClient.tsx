"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TEAM_COLORS } from "@/lib/trending/team-colors";
import type { TrendingApiResponse, TrendingFeedItem } from "@/types/trending";
import { NewsCard, NewsCardSkeleton } from "@/components/trending/NewsCard";
import { SourceFilters } from "@/components/trending/SourceFilters";
import { TeamSidebar } from "@/components/trending/TeamSidebar";
import { TrendingPlayerStrip } from "@/components/trending/TrendingPlayerStrip";

const OFFICIAL_SOURCES = new Set(["ESPN", "NFL", "Beat", "PFF"]);
const SOCIAL_SOURCES = new Set(["Twitter", "Reddit"]);

function filterBySources(feed: TrendingFeedItem[], active: Set<string>): TrendingFeedItem[] {
  if (active.has("ALL") || active.size === 0) return feed;
  return feed.filter((f) => active.has(f.source));
}

function splitColumns(feed: TrendingFeedItem[]) {
  const breaking = feed.filter((f) => OFFICIAL_SOURCES.has(f.source));
  const social = feed.filter((f) => SOCIAL_SOURCES.has(f.source));
  return { breaking, social };
}

type TrendingPageClientProps = {
  teamParam: string;
};

export function TrendingPageClient({ teamParam }: TrendingPageClientProps) {
  const team = teamParam.toUpperCase() === "ALL" ? "ALL" : teamParam.toUpperCase();

  const [data, setData] = useState<TrendingApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(() => new Set(["ALL"]));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/trending/${encodeURIComponent(team)}`);
      if (!res.ok) throw new Error("Failed to load trending feed");
      const json = (await res.json()) as TrendingApiResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [team]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleFilter = useCallback((id: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (id === "ALL") {
        return new Set(["ALL"]);
      }
      next.delete("ALL");
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 0) return new Set(["ALL"]);
      return next;
    });
  }, []);

  const filteredFeed = useMemo(() => {
    if (!data?.feed) return [];
    return filterBySources(data.feed, activeFilters);
  }, [data?.feed, activeFilters]);

  const { breaking, social } = useMemo(() => splitColumns(filteredFeed), [filteredFeed]);

  const teamColor = team === "ALL" ? "#00ff87" : TEAM_COLORS[team] ?? "#8888a0";

  return (
    <div className="flex h-full min-h-0 w-full flex-col md:flex-row">
      <TeamSidebar />

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          {loading ? (
            <div className="space-y-6">
              <div className="animate-pulse space-y-3">
                <div className="h-8 w-48 rounded bg-[rgba(255,255,255,0.06)]" />
                <div className="h-4 w-72 rounded bg-[rgba(255,255,255,0.04)]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[rgba(255,107,43,0.25)] bg-[rgba(255,107,43,0.08)] px-4 py-3 text-[13px] text-[#ff6b2b]">
              {error}
            </div>
          ) : data?.comingSoon ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div
                className="mb-4 h-14 w-14 rounded-lg"
                style={{ backgroundColor: teamColor, opacity: 0.85 }}
              />
              <p className="max-w-md text-[15px] leading-relaxed text-[#8888a0]">
                {data.message ??
                  `We're building out ${data.teamName} coverage. Check back soon.`}
              </p>
            </motion.div>
          ) : data ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <header className="flex flex-col gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div
                    className="h-14 w-14 shrink-0 rounded-lg shadow-[0_0_24px_rgba(0,0,0,0.35)]"
                    style={{ backgroundColor: teamColor }}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-[20px] font-extrabold tracking-[-0.5px] text-[#f2f2f5]">
                        {data.teamName}
                      </h1>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,255,135,0.25)] bg-[rgba(0,255,135,0.08)] px-2.5 py-1 text-[11px] font-semibold text-[#00ff87]">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ff87] opacity-40" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ff87]" />
                        </span>
                        Live Feed
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-[#8888a0]">
                      {data.record} · {data.division}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#55556a]">{data.coaching}</p>
                  </div>
                </div>
              </header>

              <TrendingPlayerStrip players={data.trendingPlayers} />

              <div>
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#44445a]">
                  Sources
                </div>
                <SourceFilters active={activeFilters} onToggle={toggleFilter} />
              </div>

              {filteredFeed.length === 0 && !loading ? (
                <p className="py-10 text-center text-[14px] text-[#8888a0]">
                  No stories match the selected filters. Try All Sources or adjust filters.
                </p>
              ) : (
                <div className="grid gap-8 lg:grid-cols-2">
                  <section>
                    <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#44445a]">
                      Breaking &amp; official
                    </h2>
                    <div className="flex flex-col gap-4">
                      {breaking.length === 0 ? (
                        <p className="text-[13px] text-[#55556a]">No items in this column for current filters.</p>
                      ) : (
                        breaking.map((item) => <NewsCard key={item.id} item={item} />)
                      )}
                    </div>
                  </section>
                  <section>
                    <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#44445a]">
                      Social &amp; community
                    </h2>
                    <div className="flex flex-col gap-4">
                      {social.length === 0 ? (
                        <p className="text-[13px] text-[#55556a]">No items in this column for current filters.</p>
                      ) : (
                        social.map((item) => <NewsCard key={item.id} item={item} />)
                      )}
                    </div>
                  </section>
                </div>
              )}
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
