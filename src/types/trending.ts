/** @deprecated narrow union — feed rows use `source_type` from DB (e.g. PFT, NBC, BR). */
export type TrendingSource = "ESPN" | "Twitter" | "Reddit" | "Beat" | "NFL" | "PFF";

export type TrendingSentiment = "positive" | "negative" | "neutral";

export type TrendingFeedItem = {
  id: string;
  /** `news_feed.source_type` (ESPN, NFL, PFT, Reddit, …) */
  source: string;
  /** Original outlet label for attribution, e.g. "ESPN NFL" */
  sourceName: string;
  author: string;
  authorHandle?: string;
  headline: string;
  body: string;
  /** Longer preview (e.g. Reddit selftext) */
  bodyFull?: string;
  playerTags: string[];
  teamTags?: string[];
  engagement: { likes: number; reposts: number; views: number };
  timeAgo: string;
  /** ISO from DB for sorting */
  publishedAt?: string | null;
  url: string;
  sentiment: TrendingSentiment;
  isReddit?: boolean;
  isVerified?: boolean;
  imageUrl?: string | null;
  redditSubreddit?: string;
  redditUsername?: string;
  redditFlair?: string | null;
  isTwitter?: boolean;
  twitterDisplayHandle?: string;
  twitterOrg?: string;
  journalistColor?: string;
};

export type TrendingPlayer = {
  id: string;
  name: string;
  changePct: number;
};

export type TrendingApiResponse = {
  team: string;
  teamName: string;
  record?: string;
  division?: string;
  coaching?: string;
  trendingPlayers: TrendingPlayer[];
  feed: TrendingFeedItem[];
  comingSoon?: boolean;
  message?: string;
};
