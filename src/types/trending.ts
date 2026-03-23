export type TrendingSource = "ESPN" | "Twitter" | "Reddit" | "Beat" | "NFL" | "PFF";

export type TrendingSentiment = "positive" | "negative" | "neutral";

export type TrendingFeedItem = {
  id: string;
  source: TrendingSource;
  author: string;
  authorHandle: string;
  headline: string;
  body: string;
  playerTags: string[];
  engagement: { likes: number; reposts: number; views: number };
  timeAgo: string;
  url: string;
  sentiment: TrendingSentiment;
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
