CREATE TABLE IF NOT EXISTS tier_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  position_filter TEXT DEFAULT 'QB',
  tiers JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  views INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_tier_lists_share_id ON tier_lists (share_id);
