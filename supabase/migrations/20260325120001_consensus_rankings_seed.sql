-- Seed consensus snapshots + timelines (skipped if player row missing)

-- Jayden Daniels — current sources + timeline arc
INSERT INTO consensus_rankings (
  player_id, player_name, position, source, rank_value, rank_total, rank_date, season, week,
  is_timeline, milestone_label, expert_rank, fan_rank, source_url, position_percentile, historical_peer_pct
)
SELECT p.id, p.name, p.position, v.source, v.rv, v.rt, v.rd::date, 2024, v.wk,
  v.it, v.ml, v.er, v.fr, v.su, v.pp, v.hp
FROM players p
INNER JOIN (
  VALUES
    ('PFF Rankings', 3, 32, '2025-03-20', NULL::int, false, NULL::text, NULL::int, NULL::int, 'https://www.pff.com/grades/nfl-player', 88, 76),
    ('ESPN Rankings', 4, 32, '2025-03-20', NULL::int, false, NULL::text, NULL::int, NULL::int, 'https://www.espn.com/nfl/story', 88, 76),
    ('NFL.com Power Rankings', 3, 32, '2025-03-20', NULL::int, false, NULL::text, NULL::int, NULL::int, 'https://www.nfl.com/news', 88, 76),
    ('FantasyPros Consensus', 3, 32, '2025-03-20', NULL::int, false, NULL::text, NULL::int, NULL::int, 'https://www.fantasypros.com', 88, 76),
    ('Sleeper ADP Rank', 2, 32, '2025-03-20', NULL::int, false, NULL::text, NULL::int, NULL::int, 'https://sleeper.com', 88, 76),
    ('NFL Stat Guru Fan Rank', 4, 32, '2025-03-20', NULL::int, false, NULL::text, NULL::int, NULL::int, NULL, 88, 76),
    ('Consensus Timeline', 22, 32, '2024-08-20', NULL::int, true, 'Preseason', 24, 20, NULL, NULL, NULL),
    ('Consensus Timeline', 18, 32, '2024-09-29', 4::int, true, 'Week 4', 20, 17, NULL, NULL, NULL),
    ('Consensus Timeline', 12, 32, '2024-10-27', 8::int, true, 'Week 8', 13, 11, NULL, NULL, NULL),
    ('Consensus Timeline', 7, 32, '2024-11-24', 12::int, true, 'Week 12', 8, 6, NULL, NULL, NULL),
    ('Consensus Timeline', 5, 32, '2024-12-29', 17::int, true, 'Week 17', 5, 5, NULL, NULL, NULL),
    ('Consensus Timeline', 4, 32, '2025-01-12', NULL::int, true, 'Playoffs', 4, 4, NULL, NULL, NULL),
    ('Consensus Timeline', 3, 32, '2025-03-20', NULL::int, true, 'Now', 3, 4, NULL, NULL, NULL)
) AS v(source, rv, rt, rd, wk, it, ml, er, fr, su, pp, hp)
ON p.name = 'Jayden Daniels'
ON CONFLICT (player_id, source, rank_date) DO UPDATE SET
  rank_value = EXCLUDED.rank_value,
  rank_total = EXCLUDED.rank_total,
  milestone_label = EXCLUDED.milestone_label,
  expert_rank = EXCLUDED.expert_rank,
  fan_rank = EXCLUDED.fan_rank,
  is_timeline = EXCLUDED.is_timeline,
  position_percentile = COALESCE(EXCLUDED.position_percentile, consensus_rankings.position_percentile),
  historical_peer_pct = COALESCE(EXCLUDED.historical_peer_pct, consensus_rankings.historical_peer_pct);

-- Patrick Mahomes — steady top tier
INSERT INTO consensus_rankings (
  player_id, player_name, position, source, rank_value, rank_total, rank_date, season, is_timeline, milestone_label, expert_rank, fan_rank, source_url, position_percentile, historical_peer_pct
)
SELECT p.id, p.name, p.position, v.source, v.rv, v.rt, v.rd::date, 2024, v.it, v.ml, v.er, v.fr, v.su, v.pp, v.hp
FROM players p
INNER JOIN (
  VALUES
    ('PFF Rankings', 1, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, 'https://www.pff.com', 98, 94),
    ('ESPN Rankings', 2, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 98, 94),
    ('NFL.com Power Rankings', 1, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 98, 94),
    ('FantasyPros Consensus', 1, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 98, 94),
    ('Sleeper ADP Rank', 2, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 98, 94),
    ('NFL Stat Guru Fan Rank', 1, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 98, 94),
    ('Consensus Timeline', 2, 32, '2024-08-20', true, 'Preseason', 2, 2, NULL, NULL, NULL),
    ('Consensus Timeline', 1, 32, '2024-09-29', true, 'Week 4', 1, 2, NULL, NULL, NULL),
    ('Consensus Timeline', 1, 32, '2024-10-27', true, 'Week 8', 1, 1, NULL, NULL, NULL),
    ('Consensus Timeline', 2, 32, '2024-11-24', true, 'Week 12', 2, 2, NULL, NULL, NULL),
    ('Consensus Timeline', 1, 32, '2024-12-29', true, 'Week 17', 1, 1, NULL, NULL, NULL),
    ('Consensus Timeline', 1, 32, '2025-01-12', true, 'Playoffs', 1, 1, NULL, NULL, NULL),
    ('Consensus Timeline', 1, 32, '2025-03-20', true, 'Now', 1, 2, NULL, NULL, NULL)
) AS v(source, rv, rt, rd, it, ml, er, fr, su, pp, hp)
ON p.name = 'Patrick Mahomes'
ON CONFLICT (player_id, source, rank_date) DO UPDATE SET
  rank_value = EXCLUDED.rank_value,
  rank_total = EXCLUDED.rank_total,
  milestone_label = EXCLUDED.milestone_label,
  expert_rank = EXCLUDED.expert_rank,
  fan_rank = EXCLUDED.fan_rank,
  is_timeline = EXCLUDED.is_timeline,
  position_percentile = COALESCE(EXCLUDED.position_percentile, consensus_rankings.position_percentile),
  historical_peer_pct = COALESCE(EXCLUDED.historical_peer_pct, consensus_rankings.historical_peer_pct);

-- Josh Allen
INSERT INTO consensus_rankings (
  player_id, player_name, position, source, rank_value, rank_total, rank_date, season, is_timeline, milestone_label, expert_rank, fan_rank, source_url, position_percentile, historical_peer_pct
)
SELECT p.id, p.name, p.position, v.source, v.rv, v.rt, v.rd::date, 2024, v.it, v.ml, v.er, v.fr, v.su, v.pp, v.hp
FROM players p
INNER JOIN (
  VALUES
    ('PFF Rankings', 2, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, 'https://www.pff.com', 96, 91),
    ('ESPN Rankings', 1, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 96, 91),
    ('NFL.com Power Rankings', 2, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 96, 91),
    ('FantasyPros Consensus', 2, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 96, 91),
    ('Sleeper ADP Rank', 1, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 96, 91),
    ('NFL Stat Guru Fan Rank', 2, 32, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 96, 91),
    ('Consensus Timeline', 3, 32, '2024-08-20', true, 'Preseason', 3, 3, NULL, NULL, NULL),
    ('Consensus Timeline', 2, 32, '2024-09-29', true, 'Week 4', 2, 3, NULL, NULL, NULL),
    ('Consensus Timeline', 2, 32, '2024-10-27', true, 'Week 8', 2, 2, NULL, NULL, NULL),
    ('Consensus Timeline', 1, 32, '2024-11-24', true, 'Week 12', 1, 2, NULL, NULL, NULL),
    ('Consensus Timeline', 2, 32, '2024-12-29', true, 'Week 17', 2, 1, NULL, NULL, NULL),
    ('Consensus Timeline', 2, 32, '2025-01-12', true, 'Playoffs', 2, 2, NULL, NULL, NULL),
    ('Consensus Timeline', 2, 32, '2025-03-20', true, 'Now', 2, 3, NULL, NULL, NULL)
) AS v(source, rv, rt, rd, it, ml, er, fr, su, pp, hp)
ON p.name = 'Josh Allen'
ON CONFLICT (player_id, source, rank_date) DO UPDATE SET
  rank_value = EXCLUDED.rank_value,
  rank_total = EXCLUDED.rank_total,
  milestone_label = EXCLUDED.milestone_label,
  expert_rank = EXCLUDED.expert_rank,
  fan_rank = EXCLUDED.fan_rank,
  is_timeline = EXCLUDED.is_timeline,
  position_percentile = COALESCE(EXCLUDED.position_percentile, consensus_rankings.position_percentile),
  historical_peer_pct = COALESCE(EXCLUDED.historical_peer_pct, consensus_rankings.historical_peer_pct);

-- CeeDee Lamb (WR)
INSERT INTO consensus_rankings (
  player_id, player_name, position, source, rank_value, rank_total, rank_date, season, is_timeline, milestone_label, expert_rank, fan_rank, source_url, position_percentile, historical_peer_pct
)
SELECT p.id, p.name, p.position, v.source, v.rv, v.rt, v.rd::date, 2024, v.it, v.ml, v.er, v.fr, v.su, v.pp, v.hp
FROM players p
INNER JOIN (
  VALUES
    ('PFF Rankings', 1, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, 'https://www.pff.com', 99, 96),
    ('ESPN Rankings', 1, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 99, 96),
    ('NFL.com Power Rankings', 1, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 99, 96),
    ('FantasyPros Consensus', 1, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 99, 96),
    ('Sleeper ADP Rank', 1, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 99, 96),
    ('NFL Stat Guru Fan Rank', 1, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 99, 96),
    ('Consensus Timeline', 2, 80, '2024-09-08', true, 'Week 1', 2, 3, NULL, NULL, NULL),
    ('Consensus Timeline', 1, 80, '2024-10-27', true, 'Week 8', 1, 1, NULL, NULL, NULL),
    ('Consensus Timeline', 1, 80, '2025-03-20', true, 'Now', 1, 1, NULL, NULL, NULL)
) AS v(source, rv, rt, rd, it, ml, er, fr, su, pp, hp)
ON p.name = 'CeeDee Lamb'
ON CONFLICT (player_id, source, rank_date) DO UPDATE SET
  rank_value = EXCLUDED.rank_value,
  rank_total = EXCLUDED.rank_total,
  milestone_label = EXCLUDED.milestone_label,
  expert_rank = EXCLUDED.expert_rank,
  fan_rank = EXCLUDED.fan_rank,
  is_timeline = EXCLUDED.is_timeline,
  position_percentile = COALESCE(EXCLUDED.position_percentile, consensus_rankings.position_percentile),
  historical_peer_pct = COALESCE(EXCLUDED.historical_peer_pct, consensus_rankings.historical_peer_pct);

-- Saquon Barkley (RB)
INSERT INTO consensus_rankings (
  player_id, player_name, position, source, rank_value, rank_total, rank_date, season, is_timeline, milestone_label, expert_rank, fan_rank, source_url, position_percentile, historical_peer_pct
)
SELECT p.id, p.name, p.position, v.source, v.rv, v.rt, v.rd::date, 2024, v.it, v.ml, v.er, v.fr, v.su, v.pp, v.hp
FROM players p
INNER JOIN (
  VALUES
    ('PFF Rankings', 2, 48, '2025-03-20', false, NULL::text, NULL::int, NULL::int, 'https://www.pff.com', 94, 88),
    ('ESPN Rankings', 3, 48, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 94, 88),
    ('NFL.com Power Rankings', 2, 48, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 94, 88),
    ('FantasyPros Consensus', 2, 48, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 94, 88),
    ('Sleeper ADP Rank', 3, 48, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 94, 88),
    ('NFL Stat Guru Fan Rank', 2, 48, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 94, 88),
    ('Consensus Timeline', 4, 48, '2024-08-20', true, 'Preseason', 5, 4, NULL, NULL, NULL),
    ('Consensus Timeline', 3, 48, '2024-10-27', true, 'Week 8', 3, 3, NULL, NULL, NULL),
    ('Consensus Timeline', 2, 48, '2025-03-20', true, 'Now', 2, 2, NULL, NULL, NULL)
) AS v(source, rv, rt, rd, it, ml, er, fr, su, pp, hp)
ON p.name = 'Saquon Barkley'
ON CONFLICT (player_id, source, rank_date) DO UPDATE SET
  rank_value = EXCLUDED.rank_value,
  rank_total = EXCLUDED.rank_total,
  milestone_label = EXCLUDED.milestone_label,
  expert_rank = EXCLUDED.expert_rank,
  fan_rank = EXCLUDED.fan_rank,
  is_timeline = EXCLUDED.is_timeline,
  position_percentile = COALESCE(EXCLUDED.position_percentile, consensus_rankings.position_percentile),
  historical_peer_pct = COALESCE(EXCLUDED.historical_peer_pct, consensus_rankings.historical_peer_pct);

-- Justin Jefferson (WR)
INSERT INTO consensus_rankings (
  player_id, player_name, position, source, rank_value, rank_total, rank_date, season, is_timeline, milestone_label, expert_rank, fan_rank, source_url, position_percentile, historical_peer_pct
)
SELECT p.id, p.name, p.position, v.source, v.rv, v.rt, v.rd::date, 2024, v.it, v.ml, v.er, v.fr, v.su, v.pp, v.hp
FROM players p
INNER JOIN (
  VALUES
    ('PFF Rankings', 2, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, 'https://www.pff.com', 97, 95),
    ('ESPN Rankings', 2, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 97, 95),
    ('NFL.com Power Rankings', 3, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 97, 95),
    ('FantasyPros Consensus', 2, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 97, 95),
    ('Sleeper ADP Rank', 2, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 97, 95),
    ('NFL Stat Guru Fan Rank', 3, 80, '2025-03-20', false, NULL::text, NULL::int, NULL::int, NULL, 97, 95),
    ('Consensus Timeline', 3, 80, '2024-09-08', true, 'Week 1', 3, 4, NULL, NULL, NULL),
    ('Consensus Timeline', 2, 80, '2024-10-27', true, 'Week 8', 2, 2, NULL, NULL, NULL),
    ('Consensus Timeline', 2, 80, '2025-03-20', true, 'Now', 2, 2, NULL, NULL, NULL)
) AS v(source, rv, rt, rd, it, ml, er, fr, su, pp, hp)
ON p.name = 'Justin Jefferson'
ON CONFLICT (player_id, source, rank_date) DO UPDATE SET
  rank_value = EXCLUDED.rank_value,
  rank_total = EXCLUDED.rank_total,
  milestone_label = EXCLUDED.milestone_label,
  expert_rank = EXCLUDED.expert_rank,
  fan_rank = EXCLUDED.fan_rank,
  is_timeline = EXCLUDED.is_timeline,
  position_percentile = COALESCE(EXCLUDED.position_percentile, consensus_rankings.position_percentile),
  historical_peer_pct = COALESCE(EXCLUDED.historical_peer_pct, consensus_rankings.historical_peer_pct);
