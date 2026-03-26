-- NFL Stat Guru Games Hub — core tables (idempotent)

CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type TEXT NOT NULL,
  room_code TEXT UNIQUE,
  host_session_id TEXT NOT NULL,
  status TEXT DEFAULT 'waiting',
  max_players INT DEFAULT 20,
  current_players INT DEFAULT 1,
  game_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_session_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  score INT DEFAULT 0,
  rank INT,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS xp_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id TEXT NOT NULL,
  xp_amount INT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  total_xp INT DEFAULT 0,
  weekly_xp INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  games_played INT DEFAULT 0,
  games_won INT DEFAULT 0,
  badges JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mind_reader_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  questions_asked JSONB DEFAULT '[]',
  final_guess TEXT,
  was_correct BOOLEAN,
  player_was TEXT,
  questions_to_solve INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stat_grid_puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_date DATE UNIQUE NOT NULL,
  cells JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trivia_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  question TEXT NOT NULL,
  hint TEXT,
  answers JSONB NOT NULL,
  correct_index INT NOT NULL,
  explanation TEXT NOT NULL,
  active_date DATE,
  times_shown INT DEFAULT 0,
  correct_rate FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trivia_daily_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_date DATE UNIQUE NOT NULL,
  question_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trivia_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  game_date DATE NOT NULL,
  score INT NOT NULL,
  time_taken_seconds INT,
  answers JSONB,
  streak INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trivia_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_played DATE,
  total_games INT DEFAULT 0,
  total_correct INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tier_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  position_filter TEXT DEFAULT 'QB',
  tiers JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  views INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS trade_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id TEXT NOT NULL,
  choice TEXT NOT NULL CHECK (choice IN ('deal', 'no_deal')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_session_id)
);

CREATE INDEX IF NOT EXISTS idx_game_players_session ON game_players(session_id);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_user ON xp_ledger(user_session_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly ON leaderboard(weekly_xp DESC);
CREATE INDEX IF NOT EXISTS idx_trade_votes_choice ON trade_votes(choice);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_reader_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE stat_grid_puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivia_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivia_daily_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivia_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivia_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public all game_sessions" ON game_sessions;
CREATE POLICY "Public all game_sessions" ON game_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public all game_players" ON game_players;
CREATE POLICY "Public all game_players" ON game_players FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public all xp_ledger" ON xp_ledger;
CREATE POLICY "Public all xp_ledger" ON xp_ledger FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public all leaderboard" ON leaderboard;
CREATE POLICY "Public all leaderboard" ON leaderboard FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public all mind_reader" ON mind_reader_games;
CREATE POLICY "Public all mind_reader" ON mind_reader_games FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read puzzles" ON stat_grid_puzzles;
CREATE POLICY "Public read puzzles" ON stat_grid_puzzles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read trivia_q" ON trivia_questions;
CREATE POLICY "Public read trivia_q" ON trivia_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public all trivia_sets" ON trivia_daily_sets;
CREATE POLICY "Public all trivia_sets" ON trivia_daily_sets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public all trivia_results" ON trivia_results;
CREATE POLICY "Public all trivia_results" ON trivia_results FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public all trivia_streaks" ON trivia_streaks;
CREATE POLICY "Public all trivia_streaks" ON trivia_streaks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public all tier_lists" ON tier_lists;
CREATE POLICY "Public all tier_lists" ON tier_lists FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public all trade_votes" ON trade_votes;
CREATE POLICY "Public all trade_votes" ON trade_votes FOR ALL USING (true) WITH CHECK (true);
