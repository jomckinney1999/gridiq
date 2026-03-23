import type { ContentCategory } from "./categories";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "code"; text: string };

export type ContentArticle = {
  slug: string;
  title: string;
  category: ContentCategory;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  author: { name: string; initials: string };
  blocks: ArticleBlock[];
};

export const ARTICLES: ContentArticle[] = [
  {
    slug: "what-is-epa-why-fantasy-players-care",
    title: "What Is EPA and Why Should Fantasy Players Care?",
    category: "Advanced Stats",
    excerpt:
      "Expected Points Added is the single most important stat most fantasy players have never heard of. Here's why it predicts future performance better than touchdowns ever could...",
    readTime: "5 min read",
    publishedAt: "March 8, 2025",
    author: { name: "NFL Stat Guru", initials: "NS" },
    blocks: [
      {
        type: "p",
        text: "If you only look at touchdowns and yards, you're grading receivers on whether their quarterback threw a good ball and whether the defense blew a coverage. EPA strips that noise away and asks a simpler question: did this play increase or decrease your team's expected points on the scoreboard?",
      },
      {
        type: "h2",
        text: "Why fantasy players should care",
      },
      {
        type: "p",
        text: "Touchdowns are volatile week to week. EPA per snap and EPA per target tend to stabilize faster and correlate better with next-season fantasy output than raw TD counts. When you're deciding between two WR2s on waivers, the one winning routes and earning high-value targets — even without scores — is often the better bet.",
      },
      {
        type: "blockquote",
        text: "EPA is not a fantasy stat. It's a truth stat. Fantasy points are just lagging indicators of the same underlying process.",
      },
      {
        type: "p",
        text: "Start by sorting your positions by EPA per route run or EPA per dropback allowed (for QBs) alongside the box score. When the two disagree, trust the efficiency metrics over counting stats in small samples.",
      },
      {
        type: "h2",
        text: "Quick checklist",
      },
      {
        type: "p",
        text: "Look for positive EPA on high-volume roles, red-zone usage that matches opportunity (not just TD luck), and coaching schemes that manufacture easy throws. That's the pipeline that turns into fantasy points before your league mates notice.",
      },
    ],
  },
  {
    slug: "five-advanced-stats-predicted-2024-fantasy-breakouts",
    title: "The 5 Advanced Stats That Predicted Every 2024 Fantasy Breakout",
    category: "Fantasy",
    excerpt:
      "Target share spikes, snap count trends, and YPRR were screaming these names before anyone was paying attention. Here's the exact process we used...",
    readTime: "8 min read",
    publishedAt: "February 20, 2025",
    author: { name: "NFL Stat Guru", initials: "NS" },
    blocks: [
      {
        type: "p",
        text: "Every breakout looks obvious in hindsight. The job is to build a repeatable screen so you're holding the right shares before the price spikes. Here's the five-stat filter we used heading into 2024.",
      },
      {
        type: "h2",
        text: "1. Target share trajectory",
      },
      {
        type: "p",
        text: "We flagged players whose target share increased three consecutive weeks while snap share stayed above 75%. That combination usually means the offense is intentionally funneling through the player — not just a one-off game script.",
      },
      {
        type: "h2",
        text: "2. YPRR with volume",
      },
      {
        type: "p",
        text: "Elite efficiency without routes is a tease. We required top-quartile YPRR on at least a 20% routes-per-dropback share so the signal wasn't a tiny sample.",
      },
      {
        type: "code",
        text: "-- Example filter: rank WRs by YPRR min 20 routes/game, last 3 weeks",
      },
      {
        type: "p",
        text: "The names that hit every filter before draft season were the same ones climbing ADP by October — but the process was visible in August if you knew where to look.",
      },
    ],
  },
  {
    slug: "rueben-bain-film-room-underrated-2025-draft",
    title: "Rueben Bain Film Room: The Most Underrated Prospect in the 2025 Draft",
    category: "Prospects",
    excerpt:
      "His pass rush win rate of 21.4% is elite by any measure. His get-off quickness consistently beats guards at the snap. So why is he still a Day 2 pick?",
    readTime: "6 min read",
    publishedAt: "March 12, 2025",
    author: { name: "NFL Stat Guru", initials: "NS" },
    blocks: [
      {
        type: "p",
        text: "The box doesn't always match the tape. Bain's production profile is noisy because offenses slid protection and chipped him all season. When you isolate true pass sets, the win rate and pressure timing are in the same bucket as first-round edge rushers.",
      },
      {
        type: "h2",
        text: "What the film shows",
      },
      {
        type: "p",
        text: "His first step is consistently upfield — he's not guessing — which forces tackles to open their hips early. That sets up inside counters and cross-chop finishes that showed up more in the second half of the season.",
      },
      {
        type: "blockquote",
        text: "Day 2 talk is about projection. The tape says his hands and plan are already NFL-caliber.",
      },
      {
        type: "p",
        text: "If he lands in a rotation that lets him rush on obvious passing downs early, the counting stats could catch up to the process metrics faster than the market expects.",
      },
    ],
  },
  {
    slug: "sharp-bettors-epa-player-props-value",
    title: "How Sharp Bettors Use EPA to Find Value on Player Props",
    category: "Betting",
    excerpt:
      "The betting market is slow to adjust to advanced metrics. Here's how savvy bettors exploit the gap between traditional box score stats and EPA...",
    readTime: "10 min read",
    publishedAt: "March 3, 2025",
    author: { name: "NFL Stat Guru", initials: "NS" },
    blocks: [
      {
        type: "p",
        text: "Books set lines the public understands: yards, touchdowns, completions. Those numbers lag coaching changes, role shifts, and opponent quality. EPA adjusts for context faster than the market prices it in.",
      },
      {
        type: "h2",
        text: "Where the edge shows up",
      },
      {
        type: "p",
        text: "Look for mismatches between EPA per attempt and passing yardage props when a quarterback faces a defense that has allowed explosive plays but not raw volume. The yardage line might look 'fair' while the efficiency profile screams overs on chunk completions.",
      },
      {
        type: "p",
        text: "Same idea for running backs: if EPA per carry is positive but carries are capped, rushing yard lines can be inflated while anytime-TD or alt receiving props stay sleepy.",
      },
    ],
  },
  {
    slug: "yprr-only-receiver-stat-fantasy-betting",
    title: "YPRR: The Only Receiver Stat You Need for Fantasy and Betting",
    category: "Advanced Stats",
    excerpt:
      "Yards Per Route Run removes all the noise from target share, touchdown luck, and offensive scheme. If you only track one advanced stat, make it this one...",
    readTime: "4 min read",
    publishedAt: "February 28, 2025",
    author: { name: "NFL Stat Guru", initials: "NS" },
    blocks: [
      {
        type: "p",
        text: "YPRR measures how much production a receiver earns every time they run a route — not every time they're targeted. That matters because targets can be inflated by scheme or game script, but routes show true usage.",
      },
      {
        type: "h2",
        text: "Fantasy application",
      },
      {
        type: "p",
        text: "Pair YPRR with target share. High YPRR on low volume is a breakout signal; high volume with collapsing YPRR is often an injury or usage warning.",
      },
      {
        type: "h2",
        text: "Betting application",
      },
      {
        type: "p",
        text: "For receiving yard props, compare YPRR trends against the opponent's yards allowed per route covered. If both sides point the same direction, you're not just reading a narrative — you're reading the efficiency math.",
      },
    ],
  },
  {
    slug: "why-teaching-sql-fantasy-football-works",
    title: "Why I'm Teaching SQL Through Fantasy Football (And Why It Works)",
    category: "Courses",
    excerpt:
      "Traditional SQL courses lose students in week 2 because the examples are boring. Querying NFL player data to find fantasy value? Nobody falls asleep for that...",
    readTime: "3 min read",
    publishedAt: "March 15, 2025",
    author: { name: "NFL Stat Guru", initials: "NS" },
    blocks: [
      {
        type: "p",
        text: "The hardest part of learning SQL isn't the syntax — it's caring about the result. Fantasy football gives you a built-in reason to join tables, filter by week, and aggregate targets across seasons.",
      },
      {
        type: "blockquote",
        text: "When you write a query that surfaces a waiver wire name your league hasn't seen yet, you remember the JOIN forever.",
      },
      {
        type: "p",
        text: "That's why the upcoming course track starts with schema design for leagues and players, then builds real dashboards — not toy HR databases. The same skills transfer to any analytics job; the motivation is just easier to find on Sunday.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): ContentArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function relatedArticles(slug: string, take = 3): ContentArticle[] {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, take);
}
