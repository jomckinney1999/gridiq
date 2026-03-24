-- Guru Score tables (run in Supabase SQL Editor if not applied via migration)

CREATE TABLE IF NOT EXISTS guru_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  player_name TEXT NOT NULL,
  week INT,
  season INT DEFAULT 2024,
  game_date DATE DEFAULT CURRENT_DATE,

  overall_score INT,
  expert_score INT,
  fan_score INT,

  pff_grade FLOAT,
  espn_qbr FLOAT,
  analyst_consensus INT,
  stats_score INT,

  reddit_sentiment FLOAT,
  fantasy_adp_score INT,
  tier_list_avg TEXT,
  social_buzz_pct INT,
  user_rating FLOAT,

  score_change_week FLOAT DEFAULT 0,
  score_direction TEXT DEFAULT 'neutral',
  freshness_label TEXT DEFAULT 'Fresh',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, game_date)
);

CREATE TABLE IF NOT EXISTS guru_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  player_name TEXT NOT NULL,
  score_date DATE NOT NULL,
  overall_score INT,
  expert_score INT,
  fan_score INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, score_date)
);

CREATE TABLE IF NOT EXISTS user_player_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  session_id TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, session_id)
);

ALTER TABLE guru_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE guru_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_player_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read guru" ON guru_scores;
CREATE POLICY "Public read guru" ON guru_scores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read history" ON guru_score_history;
CREATE POLICY "Public read history" ON guru_score_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert ratings" ON user_player_ratings;
CREATE POLICY "Public insert ratings" ON user_player_ratings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read ratings" ON user_player_ratings;
CREATE POLICY "Public read ratings" ON user_player_ratings FOR SELECT USING (true);
