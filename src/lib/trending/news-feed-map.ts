import { safeStringArray, safeText } from "@/lib/safe-text";
import { lookupJournalist } from "@/lib/trending/journalists";
import type { TrendingFeedItem, TrendingSentiment } from "@/types/trending";

export type NewsFeedApiRow = {
  id: string;
  source_name: string;
  source_type: string;
  author: string | null;
  headline: string;
  body: string | null;
  url: string | null;
  image_url?: string | null;
  player_tags: string[] | null;
  team_tags: string[] | null;
  sentiment: string | null;
  published_at: string | null;
  upvotes: number | null;
  comments: number | null;
  views: number | null;
  is_verified: boolean | null;
  reddit_flair?: string | null;
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

function parseRedditSubreddit(sourceName: string): string | undefined {
  const m = /^r\/(\w+)/i.exec(sourceName.trim());
  return m ? m[1] : undefined;
}

function normalizeRedditAuthor(author: string): string {
  const a = author.trim();
  if (a.startsWith("t2_")) return "reddit_user";
  return a;
}

export function mapNewsFeedRow(row: NewsFeedApiRow): TrendingFeedItem {
  const isReddit = row.source_type === "Reddit";
  const isTwitter = row.source_type === "Twitter";
  const rawBody = safeText(row.body, "").replace(/\s+/g, " ").trim();
  const bodyPreview = isReddit
    ? rawBody.slice(0, 220) + (rawBody.length > 220 ? "…" : "")
    : rawBody.slice(0, 120) + (rawBody.length > 120 ? "…" : "");

  let authorRaw = safeText(row.author, "").trim() || safeText(row.source_name, "News");
  if (isReddit) authorRaw = normalizeRedditAuthor(authorRaw);

  const j = lookupJournalist(authorRaw);
  const twitterHandleFromAuthor = () => {
    const a = authorRaw.replace(/^@/, "");
    return a ? `@${a.replace(/\s+/g, "")}` : "@unknown";
  };
  const twitterHandle = isTwitter ? (j?.handle ?? twitterHandleFromAuthor()) : "";
  const twitterOrg = isTwitter ? j?.org : undefined;
  const journalistColor = j?.color;

  const subreddit = isReddit ? parseRedditSubreddit(safeText(row.source_name, "")) : undefined;

  return {
    id: String(row.id),
    source: safeText(row.source_type, "unknown"),
    sourceName: safeText(row.source_name, "Source"),
    author: authorRaw,
    authorHandle: twitterHandle,
    headline: safeText(row.headline, "Untitled"),
    body: bodyPreview,
    bodyFull: isReddit ? rawBody : undefined,
    playerTags: safeStringArray(row.player_tags),
    teamTags: safeStringArray(row.team_tags),
    url: safeText(row.url, "").trim() || "#",
    publishedAt: row.published_at,
    timeAgo: timeAgo(row.published_at),
    sentiment: sentimentFrom(row.sentiment),
    isReddit,
    isTwitter,
    isVerified: row.is_verified ?? false,
    imageUrl: row.image_url ? safeText(row.image_url, "").trim() || null : null,
    redditSubreddit: subreddit,
    redditUsername: isReddit ? authorRaw.replace(/^u\//, "") : undefined,
    redditFlair: row.reddit_flair ? safeText(row.reddit_flair, "").trim() || null : null,
    twitterDisplayHandle: isTwitter ? (j?.handle ?? twitterHandleFromAuthor()) : undefined,
    twitterOrg,
    journalistColor,
    engagement: {
      likes: row.upvotes ?? 0,
      reposts: row.comments ?? 0,
      views: row.views ?? 0,
    },
  };
}
