-- Newsletter signups from Content hub and other pages
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'content_page',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE newsletter_subscribers IS 'Email newsletter subscribers (Film Room, etc.).';
