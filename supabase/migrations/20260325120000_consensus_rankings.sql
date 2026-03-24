-- Expert / fan consensus position ranks (Guru Score + player profiles)
CREATE TABLE IF NOT EXISTS consensus_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  position TEXT NOT NULL,
  source TEXT NOT NULL,
  rank_value INT NOT NULL,
  rank_total INT NOT NULL,
  rank_date DATE DEFAULT CURRENT_DATE,
  season INT DEFAULT 2024,
  week INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  milestone_label TEXT,
  expert_rank INT,
  fan_rank INT,
  is_timeline BOOLEAN DEFAULT FALSE,
  source_url TEXT,
  position_percentile INT,
  historical_peer_pct INT,
  UNIQUE(player_id, source, rank_date)
);

CREATE INDEX IF NOT EXISTS idx_consensus_player ON consensus_rankings (player_id);
CREATE INDEX IF NOT EXISTS idx_consensus_timeline ON consensus_rankings (player_id, is_timeline, rank_date);

ALTER TABLE consensus_rankings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read consensus_rankings" ON consensus_rankings;
CREATE POLICY "Public read consensus_rankings" ON consensus_rankings FOR SELECT USING (true);
