"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TEAM_COLORS } from "@/lib/trending/team-colors";
import { mapNewsFeedRow, type NewsFeedApiRow } from "@/lib/trending/news-feed-map";
import type { TrendingApiResponse, TrendingFeedItem } from "@/types/trending";
import { NewsCard, NewsCardSkeleton } from "@/components/trending/NewsCard";
import { SourceFilters } from "@/components/trending/SourceFilters";
import { TeamSidebar } from "@/components/trending/TeamSidebar";
import { TrendingPlayerStrip } from "@/components/trending/TrendingPlayerStrip";

const BEAT_TYPES = new Set(["PFT", "NBC", "BR", "PFR"]);

/** Official / wire column */
const OFFICIAL_TYPES = new Set(["ESPN", "NFL", "PFT", "NBC", "PFR", "BR", "PFF"]);
const SOCIAL_TYPES = new Set(["Reddit", "Twitter"]);

function matchesSourceFilter(item: TrendingFeedItem, filterId: string): boolean {
  if (filterId === "ALL") return true;
  const t = item.source;
  if (filterId === "ESPN") return t === "ESPN";
  if (filterId === "NFL") return t === "NFL";
  if (filterId === "PFF") return t === "PFF";
  if (filterId === "Reddit") return t === "Reddit";
  if (filterId === "Twitter") return t === "Twitter";
  if (filterId === "Beat") return BEAT_TYPES.has(t);
  return false;
}

function filterBySources(feed: TrendingFeedItem[], active: Set<string>): TrendingFeedItem[] {
  if (active.has("ALL") || active.size === 0) return feed;
  return feed.filter((f) => [...active].some((id) => id !== "ALL" && matchesSourceFilter(f, id)));
}

function splitColumns(feed: TrendingFeedItem[]) {
  const breaking = feed.filter((f) => OFFICIAL_TYPES.has(f.source));
  const social = feed.filter((f) => SOCIAL_TYPES.has(f.source));
  return { breaking, social };
}

type TrendingPageClientProps = {
  teamParam: string;
};

export function TrendingPageClient({ teamParam }: TrendingPageClientProps) {
  const team = teamParam.toUpperCase() === "ALL" ? "ALL" : teamParam.toUpperCase();

  const [data, setData] = useState<TrendingApiResponse | null>(null);
  const [feedItems, setFeedItems] = useState<TrendingFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(() => new Set(["ALL"]));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFeedError(null);
    try {
      const [metaRes, feedRes] = await Promise.all([
        fetch(`/api/trending/${encodeURIComponent(team)}`),
        fetch(`/api/trending/feed?team=${encodeURIComponent(team)}&source=all&limit=80`),
      ]);

      if (!metaRes.ok) throw new Error("Failed to load team info");
      const metaJson = (await metaRes.json()) as TrendingApiResponse;
      setData(metaJson);

      if (!feedRes.ok) {
        const errJson = (await feedRes.json().catch(() => ({}))) as { error?: string };
        setFeedItems([]);
        setFeedError(errJson.error ?? "Could not load news feed. Check Supabase configuration.");
        return;
      }

      const feedJson = (await feedRes.json()) as { all?: NewsFeedApiRow[]; error?: string };
      if (feedJson.error) {
        setFeedItems([]);
        setFeedError(feedJson.error);
        return;
      }
      const rows = feedJson.all ?? [];
      setFeedItems(rows.map(mapNewsFeedRow));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setData(null);
      setFeedItems([]);
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
    return filterBySources(feedItems, activeFilters);
  }, [feedItems, activeFilters]);

  const { breaking, social } = useMemo(() => splitColumns(filteredFeed), [filteredFeed]);

  const teamColor = team === "ALL" ? "var(--green)" : TEAM_COLORS[team] ?? "var(--txt-2)";

  return (
    <div className="flex h-full min-h-0 w-full flex-col md:flex-row">
      <TeamSidebar />

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          {loading ? (
            <div className="space-y-6">
              <div className="animate-pulse space-y-3">
                <div className="h-8 w-48 rounded bg-[var(--bg-subtle-2)]" />
                <div className="h-4 w-72 rounded bg-[var(--bg-subtle)]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--orange)_25%,transparent)] bg-[var(--orange-light)] px-4 py-3 text-[13px] text-[var(--orange)]">
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
              <p className="max-w-md text-[15px] leading-relaxed text-[var(--txt-2)]">
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
              <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div
                    className="h-14 w-14 shrink-0 rounded-lg shadow-[var(--shadow-md)]"
                    style={{ backgroundColor: teamColor }}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-[20px] font-extrabold tracking-[-0.5px] text-[var(--txt)]">
                        {data.teamName}
                      </h1>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--green-border)] bg-[var(--green-light)] px-2.5 py-1 text-[11px] font-semibold text-[var(--green)]">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--green)] opacity-40" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--green)]" />
                        </span>
                        Live Feed
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-[var(--txt-2)]">
                      {data.record} · {data.division}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[var(--txt-muted)]">{data.coaching}</p>
                  </div>
                </div>
              </header>

              <TrendingPlayerStrip players={data.trendingPlayers} />

              {feedError ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card2)] px-4 py-3 text-[13px] text-[var(--txt-2)]">
                  {feedError}
                </div>
              ) : null}

              <div>
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--txt-3)]">
                  Sources
                </div>
                <SourceFilters active={activeFilters} onToggle={toggleFilter} />
              </div>

              {filteredFeed.length === 0 && !loading ? (
                <p className="py-10 text-center text-[14px] text-[var(--txt-2)]">
                  {feedItems.length === 0
                    ? "No stories yet. Run the news fetcher (scripts/news/fetch_news.py) or check back after the next sync."
                    : "No stories match the selected filters. Try All Sources or adjust filters."}
                </p>
              ) : (
                <div className="grid gap-8 lg:grid-cols-2">
                  <section>
                    <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--txt-3)]">
                      Breaking &amp; official
                    </h2>
                    <div className="flex flex-col gap-4">
                      {breaking.length === 0 ? (
                        <p className="text-[13px] text-[var(--txt-muted)]">No items in this column for current filters.</p>
                      ) : (
                        breaking.map((item) => <NewsCard key={item.id} item={item} />)
                      )}
                    </div>
                  </section>
                  <section>
                    <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--txt-3)]">
                      Social &amp; community
                    </h2>
                    <div className="flex flex-col gap-4">
                      {social.length === 0 ? (
                        <p className="text-[13px] text-[var(--txt-muted)]">No items in this column for current filters.</p>
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
