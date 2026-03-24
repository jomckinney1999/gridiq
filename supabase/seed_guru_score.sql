-- Guru Score seed (Supabase SQL Editor). Requires `players` rows for these names.
-- 1) Current guru_scores snapshot
-- 2) 12-week guru_score_history

INSERT INTO guru_scores (
  player_id,
  player_name,
  week,
  season,
  game_date,
  overall_score,
  expert_score,
  fan_score,
  pff_grade,
  espn_qbr,
  analyst_consensus,
  stats_score,
  reddit_sentiment,
  fantasy_adp_score,
  tier_list_avg,
  social_buzz_pct,
  user_rating,
  score_change_week,
  score_direction,
  freshness_label
)
SELECT
  p.id,
  p.name,
  14,
  2024,
  CURRENT_DATE,
  v.overall_score,
  v.expert_score,
  v.fan_score,
  v.pff_grade,
  v.espn_qbr,
  v.analyst_consensus,
  v.stats_score,
  v.reddit_sentiment,
  v.fantasy_adp_score,
  v.tier_list_avg,
  v.social_buzz_pct,
  v.user_rating,
  v.score_change_week,
  v.score_direction,
  v.freshness_label
FROM players p
INNER JOIN (
  VALUES
    ('Jayden Daniels', 84, 86, 81, 82.4, 68.2, 85, 87, 0.42, 14, 'A', 71, 4.2, 3.2, 'up', '🍅 Certified Fresh'),
    ('CeeDee Lamb', 91, 92, 89, 91.0, NULL, 93, 90, 0.35, 6, 'S', 88, 4.6, -1.1, 'down', 'Fresh'),
    ('Saquon Barkley', 88, 87, 90, 86.0, NULL, 88, 86, 0.55, 8, 'A', 79, 4.5, 0.4, 'neutral', '🍅 Certified Fresh'),
    ('Rueben Bain', 71, 69, 74, 72.0, NULL, 68, 70, 0.12, 32, 'B', 54, 3.8, 5.8, 'up', 'Rising'),
    ('Patrick Mahomes', 94, 95, 92, 88.0, 72.1, 96, 94, 0.48, 3, 'S', 92, 4.8, -0.6, 'down', '🍅 Certified Fresh')
) AS v(
  pname,
  overall_score,
  expert_score,
  fan_score,
  pff_grade,
  espn_qbr,
  analyst_consensus,
  stats_score,
  reddit_sentiment,
  fantasy_adp_score,
  tier_list_avg,
  social_buzz_pct,
  user_rating,
  score_change_week,
  score_direction,
  freshness_label
) ON p.name = v.pname
ON CONFLICT (player_id, game_date) DO UPDATE SET
  overall_score = EXCLUDED.overall_score,
  expert_score = EXCLUDED.expert_score,
  fan_score = EXCLUDED.fan_score,
  pff_grade = EXCLUDED.pff_grade,
  espn_qbr = EXCLUDED.espn_qbr,
  analyst_consensus = EXCLUDED.analyst_consensus,
  stats_score = EXCLUDED.stats_score,
  reddit_sentiment = EXCLUDED.reddit_sentiment,
  fantasy_adp_score = EXCLUDED.fantasy_adp_score,
  tier_list_avg = EXCLUDED.tier_list_avg,
  social_buzz_pct = EXCLUDED.social_buzz_pct,
  user_rating = EXCLUDED.user_rating,
  score_change_week = EXCLUDED.score_change_week,
  score_direction = EXCLUDED.score_direction,
  freshness_label = EXCLUDED.freshness_label;

DO $$
DECLARE
  r RECORD;
  i INT;
  d DATE;
  base_o INT;
  base_e INT;
  base_f INT;
  o INT;
  e INT;
  f INT;
BEGIN
  FOR r IN
    SELECT id, name FROM players
    WHERE name IN ('Jayden Daniels', 'CeeDee Lamb', 'Saquon Barkley', 'Rueben Bain', 'Patrick Mahomes')
  LOOP
    base_o := 76;
    base_e := 78;
    base_f := 74;
    IF r.name = 'CeeDee Lamb' THEN base_o := 86; base_e := 88; base_f := 84;
    ELSIF r.name = 'Saquon Barkley' THEN base_o := 82; base_e := 81; base_f := 84;
    ELSIF r.name = 'Rueben Bain' THEN base_o := 64; base_e := 62; base_f := 68;
    ELSIF r.name = 'Patrick Mahomes' THEN base_o := 88; base_e := 90; base_f := 86;
    END IF;

    FOR i IN 0..11 LOOP
      d := (CURRENT_DATE - ((11 - i) * 7))::date;
      o := LEAST(100, GREATEST(52, base_o + floor(sin(i::float) * 5 + i)::int));
      e := LEAST(100, GREATEST(52, base_e + floor(cos((i * 0.8)::float) * 4 + i * 0.5)::int));
      f := LEAST(100, GREATEST(52, base_f + floor(sin((i * 0.5)::float) * 5 + i * 0.4)::int));

      INSERT INTO guru_score_history (player_id, player_name, score_date, overall_score, expert_score, fan_score)
      VALUES (r.id, r.name, d, o, e, f)
      ON CONFLICT (player_id, score_date) DO UPDATE SET
        overall_score = EXCLUDED.overall_score,
        expert_score = EXCLUDED.expert_score,
        fan_score = EXCLUDED.fan_score;
    END LOOP;
  END LOOP;
END $$;
