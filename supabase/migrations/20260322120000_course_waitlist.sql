-- Waitlist for upcoming "Learn to Code Through Football" courses
CREATE TABLE IF NOT EXISTS course_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE course_waitlist IS 'Email signups for NFL Stat Guru coding courses (waitlist).';
