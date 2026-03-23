-- Aggregated NFL news from RSS + Reddit (ingested by scripts/news/fetch_news.py)
CREATE TABLE IF NOT EXISTS news_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  author TEXT,
  headline TEXT NOT NULL,
  body TEXT,
  url TEXT,
  image_url TEXT,
  player_tags TEXT[] DEFAULT '{}',
  team_tags TEXT[] DEFAULT '{}',
  sentiment TEXT DEFAULT 'neutral',
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  upvotes INT DEFAULT 0,
  comments INT DEFAULT 0,
  views INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_news_published ON news_feed (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_teams ON news_feed USING gin (team_tags);
CREATE INDEX IF NOT EXISTS idx_news_players ON news_feed USING gin (player_tags);
CREATE INDEX IF NOT EXISTS idx_news_source ON news_feed (source_type);
