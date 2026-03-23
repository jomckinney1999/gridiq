import { safeStringArray, safeText } from "@/lib/safe-text";
import type { TrendingFeedItem, TrendingSentiment } from "@/types/trending";

export type NewsFeedApiRow = {
  id: string;
  source_name: string;
  source_type: string;
  author: string | null;
  headline: string;
  body: string | null;
  url: string | null;
  player_tags: string[] | null;
  team_tags: string[] | null;
  sentiment: string | null;
  published_at: string | null;
  upvotes: number | null;
  comments: number | null;
  views: number | null;
  is_verified: boolean | null;
};

export function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (Number.isNaN(diff)) return "—";
  if (diff < 0) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function sentimentFrom(s: string | null): TrendingSentiment {
  if (s === "positive" || s === "negative" || s === "neutral") return s;
  return "neutral";
}

export function mapNewsFeedRow(row: NewsFeedApiRow): TrendingFeedItem {
  const isReddit = row.source_type === "Reddit";
  const rawBody = safeText(row.body, "").replace(/\s+/g, " ").trim();
  const bodyPreview = rawBody.slice(0, 120) + (rawBody.length > 120 ? "…" : "");

  const authorRaw = safeText(row.author, "").trim() || safeText(row.source_name, "News");

  return {
    id: String(row.id),
    source: safeText(row.source_type, "unknown"),
    sourceName: safeText(row.source_name, "Source"),
    author: authorRaw,
    authorHandle: "",
    headline: safeText(row.headline, "Untitled"),
    body: bodyPreview,
    playerTags: safeStringArray(row.player_tags),
    url: safeText(row.url, "").trim() || "#",
    timeAgo: timeAgo(row.published_at),
    sentiment: sentimentFrom(row.sentiment),
    isReddit,
    isVerified: row.is_verified ?? false,
    engagement: {
      likes: row.upvotes ?? 0,
      reposts: row.comments ?? 0,
      views: row.views ?? 0,
    },
  };
}
