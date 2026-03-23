-- Stat Grid daily puzzles (JSONB cells). Seed from app or run INSERT after deploy.
CREATE TABLE IF NOT EXISTS stat_grid_puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_date DATE UNIQUE NOT NULL,
  cells JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stat_grid_puzzles_game_date ON stat_grid_puzzles (game_date);

COMMENT ON TABLE stat_grid_puzzles IS 'Daily Stat Grid puzzles; cells match StatGridCell[] in src/types/stat-grid.ts';
