DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM trivia_questions LIMIT 1) THEN
  INSERT INTO trivia_questions (category, difficulty, question, answers, correct_index, explanation) VALUES
    ('Advanced Stats', 'medium', 'Which WR led the NFL in YPRR in 2024?', '["Tyreek Hill","CeeDee Lamb","Justin Jefferson","Davante Adams"]'::jsonb, 1, 'CeeDee Lamb led all WRs with 3.41 YPRR in 2024 — one of the highest marks ever recorded.'),
    ('NFL History', 'hard', 'What year did the NFL adopt the two-point conversion?', '["1990","1994","1999","2002"]'::jsonb, 1, 'The NFL adopted the two-point conversion in 1994, following the college football model.'),
    ('Fantasy Football', 'medium', 'What does ''air yards'' measure?', '["Total passing yards","Distance ball travels through the air","Yards after catch","Target distance"]'::jsonb, 1, 'Air yards measures how far the ball traveled through the air from line of scrimmage to the catch point.'),
    ('Draft & Prospects', 'easy', 'What does ''Day 2 pick'' mean in NFL Draft?', '["Round 1","Rounds 2-3","Rounds 4-5","Rounds 6-7"]'::jsonb, 1, 'Day 1 = Round 1 only. Day 2 = Rounds 2-3. Day 3 = Rounds 4-7.'),
    ('Advanced Stats', 'hard', 'A QB has CPOE of +6.2%. What does this mean?', '["Completes 6.2% more passes than expected","His completion rate is 6.2%","Throws 6.2% more deep passes","QBR is 6.2 above average"]'::jsonb, 0, 'CPOE measures completion % above what''s expected given throw difficulty — +6.2% means elite accuracy.'),
    ('NFL History', 'medium', 'Who holds the NFL record for most receiving yards in a single season?', '["Jerry Rice","Calvin Johnson","Randy Moss","Julio Jones"]'::jsonb, 1, 'Calvin Johnson set the single-season record with 1,964 yards in 2012 for the Detroit Lions.'),
    ('Fantasy Football', 'medium', 'In PPR scoring, which position benefits MOST from the format?', '["QB","RB","WR","TE"]'::jsonb, 1, 'RBs benefit most from PPR because it rewards their pass-catching role, elevating receiving backs dramatically.'),
    ('Advanced Stats', 'medium', 'What does ''pass rush win rate'' measure?', '["How often a rusher sacks the QB","How often rusher beats blocker in 2.5 seconds","His total pressures per game","Snap count on passing downs"]'::jsonb, 1, 'Pass rush win rate measures what % of pass rush reps a defender beats his blocker within 2.5 seconds.'),
    ('Draft & Prospects', 'medium', 'What does the three-cone drill measure at the Combine?', '["Straight-line speed","Change of direction and agility","Vertical jump","Hand strength"]'::jsonb, 1, 'The three-cone (L-drill) measures change of direction — considered the best drill for predicting WR route running.'),
    ('NFL History', 'medium', 'Who was the first QB to throw for 5,000 yards in a season?', '["Dan Marino","Warren Moon","Dan Fouts","Joe Montana"]'::jsonb, 0, 'Dan Marino threw for 5,084 yards with the Miami Dolphins in 1984 — same season he threw 48 TDs.');
  END IF;
END $$;
