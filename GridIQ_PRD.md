# GridIQ — Product Requirements Document
**Version:** 1.0 | **Stack:** Next.js 14 + Supabase + Claude API + Pinecone  
**Aesthetic:** Ultra-dark premium sports analytics — think Bloomberg Terminal meets Apple × ESPN  
**Tagline:** "The NFL stats platform built for obsessives."

---

## 1. PRODUCT VISION

GridIQ is a natural-language-first NFL analytics platform. Instead of browsing menus to find stats, users type exactly what they want to know — like asking ChatGPT — and get instant, precise, beautifully visualized answers. It combines:
- **ESPN** (breadth + live data)
- **PFF** (advanced grades + prospect profiles)
- **Next Gen Stats** (tracking data: routes, speed, separation)
- **ChatGPT** (natural language interface)

The core insight: every NFL stats site forces you to browse *to* a stat. GridIQ lets you *ask for* a stat.

---

## 2. DESIGN SYSTEM

### 2.1 Color Palette (STRICT — never deviate)
```css
:root {
  /* Backgrounds */
  --bg-base:    #050507;   /* page background */
  --bg-card:    #0d0d10;   /* card surfaces */
  --bg-card2:   #111116;   /* elevated cards */
  --bg-hover:   #1c1c21;   /* hover states */

  /* Borders */
  --border:     rgba(255,255,255,0.06);
  --border-md:  rgba(255,255,255,0.10);
  --border-lg:  rgba(255,255,255,0.16);

  /* Text */
  --txt:        #f2f2f5;   /* primary text */
  --txt-2:      #8888a0;   /* secondary text */
  --txt-3:      #44445a;   /* muted/labels */

  /* Accent Colors — THE IDENTITY */
  --neon-green:  #00ff87;
  --neon-orange: #ff6b2b;
  --neon-blue:   #3b9eff;
  --neon-purple: #a855f7;

  /* Glow layers */
  --g-glow: rgba(0,255,135,0.25);
  --o-glow: rgba(255,107,43,0.25);
  --b-glow: rgba(59,158,255,0.20);
}
```

### 2.2 Typography
```css
/* Font: Inter (Google Fonts) */
/* Headlines: font-weight 800-900, letter-spacing -1px to -2px */
/* Body: font-weight 400-500, line-height 1.65 */
/* Labels: font-weight 600-700, text-transform uppercase, letter-spacing 0.5-1px */
/* Numbers/Stats: font-weight 700-800, letter-spacing -0.5px to -1px, tabular-nums */

/* Scale */
--text-hero:    clamp(40px, 6vw, 64px); /* hero headline */
--text-h1:      clamp(28px, 4vw, 40px);
--text-h2:      clamp(20px, 3vw, 28px);
--text-h3:      18px;
--text-body:    15px;
--text-sm:      13px;
--text-xs:      11px;
--text-stat:    clamp(24px, 3vw, 36px); /* stat numbers */
```

### 2.3 Visual Language
- **Grid lines:** Subtle CSS grid background, opacity 3-5%, masked with radial gradient
- **Neon accents:** Always use box-shadow glows on active elements: `0 0 20px var(--g-glow)`
- **Gradient stat boxes:** Each stat card has directional gradient from accent color (10-15%) to transparent
- **Top accent lines:** 2px top border gradient on cards (`linear-gradient(90deg, var(--neon-green), transparent)`)
- **Glassmorphism nav:** `backdrop-filter: blur(16px)` with semi-transparent background
- **Player silhouettes:** SVG shapes + gradient fills representing player position
- **NO white backgrounds ever.** NO light mode. Pure dark only.

### 2.4 Component Library
Use **21st.dev** components as base, then override with GridIQ design tokens.  
Use **shadcn/ui** for form primitives (inputs, selects, dropdowns).  
Install Framer Motion for page transitions and stat card animations.

---

## 3. FILE STRUCTURE

```
gridiq/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              ← Landing page
│   │   └── layout.tsx
│   ├── (app)/
│   │   ├── search/page.tsx       ← Main AI search interface
│   │   ├── player/[id]/page.tsx  ← Player profile
│   │   ├── prospects/page.tsx    ← Draft prospect board
│   │   ├── advanced/page.tsx     ← Advanced stats explorer
│   │   └── layout.tsx            ← App shell with sidebar
│   └── api/
│       ├── query/route.ts        ← AI query endpoint (Claude)
│       ├── player/route.ts       ← Player data endpoint
│       └── prospects/route.ts    ← Prospect data endpoint
├── components/
│   ├── ui/                       ← shadcn base components
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── ProspectShowcase.tsx
│   │   ├── StatTicker.tsx
│   │   └── CTASection.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── AIResponseCard.tsx
│   │   └── QuickPills.tsx
│   ├── player/
│   │   ├── StatCard.tsx          ← Gradient accent stat boxes
│   │   ├── PlayerCard.tsx        ← Compact player card
│   │   ├── ProspectProfile.tsx   ← Full PFF-style profile
│   │   ├── GameLog.tsx           ← Game-by-game table
│   │   └── PercentileBar.tsx     ← Neon percentile bar
│   └── layout/
│       ├── TopNav.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── queries.ts            ← All DB queries
│   ├── ai/
│   │   ├── claude.ts             ← Claude API client
│   │   ├── systemPrompt.ts       ← The schema-aware system prompt
│   │   └── queryParser.ts        ← Intent classification
│   └── data/
│       ├── nflData.ts            ← nfl_data_py wrapper
│       └── espn.ts               ← ESPN hidden API calls
├── styles/
│   └── globals.css               ← CSS variables + base styles
└── .env.local
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY=
    ANTHROPIC_API_KEY=
    PINECONE_API_KEY=
```

---

## 4. PAGE SPECIFICATIONS

### 4.1 Landing Page (`/`)

**Purpose:** Convert visitors. Must be stunning. This is the product's first impression.

**Sections (in order):**

#### A. Navigation Bar
```
[G] GridIQ    Stats  Prospects  Advanced  Teams  Pricing    [Get Early Access →]
```
- Fixed, glassmorphism (`backdrop-filter: blur(16px)`)
- Logo: 32px rounded rect, linear-gradient(135deg, #00ff87, #3b9eff), white "G"
- Nav links: ghost style, hover shows subtle background
- CTA: solid neon-green background, bold font, hover glow effect
- Live indicator: pulsing green dot + "Live" label (right side)

#### B. Hero Section
```
[Live indicator badge]

The NFL Stats Platform
Built for Obsessives          ← gradient text: green→blue→orange

Ask anything. Get instant answers. From route counts to playoff 
fumbles — GridIQ answers the questions ESPN can't.

[Start Searching Free]  [Watch Demo ↗]

[2.8M+ plays] [1,847 players] [340+ metrics] [AI-powered] [1999–2024]
```
- Background: subtle CSS grid overlay, masked radially
- Three glow orbs: green (top center), blue (top right), orange (top left)
- H1: 64px, weight 900, `letter-spacing: -2px`
- Gradient text: `background: linear-gradient(90deg, #00ff87, #3b9eff, #ff6b2b)`
- Stat tickers: small chips with colored numbers
- Framer Motion: staggered fade-up animation on load (0.1s delay between elements)

#### C. AI Search Demo (interactive strip)
A fake browser frame showing the search interface in action:
- Browser chrome (colored dots, URL bar showing "gridiq.com/search")
- Search bar with animated cursor and sample query
- Below: 4 player cards in a row (QB, WR, WR, Prospect)

**Player Card spec (compact):**
```
[SVG silhouette avatar, position-colored]
Name          Position · Team
[Big grade number in accent color]
[3 attribute bars with labels, values, neon fill]
```

#### D. Feature Grid (6 cards, 3×2)
Cards for:
1. AI Natural Language Search (green icon)
2. Route & Tracking Data (orange icon)
3. Prospect Profiles (blue icon)
4. Advanced Metrics (purple icon)
5. Historical Depth 1999+ (green icon)
6. Fantasy Intelligence (blue icon)

Each card:
- Dark card background, 0.5px border
- Colored radial glow in bottom-right corner (opacity 8%)
- 34px icon container with 12% opacity colored background
- `hover: translateY(-2px)`, border brightens

#### E. Prospect Profile Showcase
Full-width PFF-style prospect card demonstrating depth:
- Player header: name, position, school, jersey, class, measurements
- Large grade number (neon green, glow text-shadow)
- Colored projection pill ("Round 2 · Pick 42–58")
- Tab navigation: Career Stats / Comparables / Grades by Game / Analysis
- 3-column stats grid (career year columns)
- Bottom: 6 gradient stat boxes with percentile bars
  - Each box: directional gradient, colored value, percentile text, thin progress bar

**Gradient stat box spec:**
```css
.stat-box-green {
  background: linear-gradient(135deg, rgba(0,255,135,0.12), rgba(0,255,135,0.03));
  border: 0.5px solid rgba(0,255,135,0.2);
}
/* Value: color: var(--neon-green), font-size: 24px, font-weight: 800 */
/* Percentile bar: 3px height, neon green fill */
```

#### F. CTA Section
```
Ready to know the real numbers?

Join analysts, fantasy players, and football obsessives
who use GridIQ to go deeper than any other platform.

[Start Free — No Card Needed]  [View Pricing]
```
- Full-width card, gradient border, radial green glow background
- Framer Motion: subtle float animation

---

### 4.2 Search Page (`/search`)

**Layout:** Fixed sidebar (196px) + main content area

**Sidebar:**
- Dark bg-card background
- Recent queries list (colored dots by accent color)
- Browse section: QB Rankings, Route Trees, Draft Board, etc.
- Tools section: Player Compare, Fantasy Optimizer

**Main Content:**

#### Search Bar
```
[✦ icon]  [query text with cursor]  [Ask GridIQ button]
[Quick pill suggestions]
```
- The `✦` icon in a small neon-green rounded square
- Border glows green on hover
- "Ask GridIQ" button: solid neon-green, bold
- Quick pills: ghost style, hover turns green-tinted

#### AI Response Card
```
[G avatar] GridIQ Analysis
[Natural language answer with bolded key stats, colored highlights]
```
- Left border: 2px solid var(--neon-green) (orange/blue for different query types)
- AI avatar: 20px rounded rect, gradient green→blue, bold "G"

#### Stat Cards Row (4 across)
```
LABEL
[Big number]
[Sub-text]
[Optional rank badge]
```
- Top border gradient line (2px, color → transparent)
- Colors cycle based on metric type (green=positive, orange=warning, blue=neutral)

#### Data Table
- Dark card, thin borders
- Column headers: 10px uppercase, muted color
- Highlight rows: neon-green-tinted background, green text
- Row hover: slight background lift
- Bar columns: mini inline bars with colored fills

---

### 4.3 Player / Prospect Profile (`/player/[id]`)

Full-page profile. Inspired by image reference (Fernando Mendoza PFF card).

**Layout:**
- Wide hero header: player name large, team, position, number
- School logo or team logo (right side)
- Large grade (right corner, neon green, glow)
- Projection pill

**Tab Navigation:** First Look | Stats | Trends | Analysis | Comparables

**Stats Tab:**
- Left column: career stats table (year-by-year)
- Center: advanced/comparable stats (gradient boxes, locked icon for premium)
- Right: Grades by Game (horizontal bar chart, game-by-game)

**Grades by Game (right column):**
- Each game: opponent logo, week number, horizontal bar
- Bar fills green for grades >85, orange for 70-85, red <70
- Animated fill on page load (Framer Motion)

---

### 4.4 Prospects Page (`/prospects`)

Draft board layout.

**Header:** 2025 NFL Draft Board with current date
**Filters:** Position, School, Round Projection, Grade Range
**View Toggle:** Board view | Table view | Compare mode

**Board View — Player Card:**
```
[Rank #]  [School logo]  [Name]  [Pos]  [Grade]  [Projection]  [Class]  [SH]
```

**Expanded Card (on click):**
Full profile panel slides in from right with complete stats

---

## 5. AI QUERY ENGINE

### 5.1 Architecture Flow
```
User types query
    ↓
/api/query (POST)
    ↓
Claude API with schema-aware system prompt
    ↓
Claude returns: { intent, sql_query, display_type, response_text }
    ↓
Execute SQL against Supabase
    ↓
Claude formats result into structured response
    ↓
Frontend renders appropriate component (StatCard / GameLog / ProspectProfile)
```

### 5.2 System Prompt Template
```typescript
// lib/ai/systemPrompt.ts
export const SYSTEM_PROMPT = `
You are GridIQ, an elite NFL analytics assistant. You answer precise football 
questions by querying a structured database. 

DATABASE SCHEMA:
---
Table: players
  - id (uuid)
  - name (text)
  - position (text: QB/WR/RB/TE/OL/DL/LB/CB/S/K/P)
  - team (text)
  - jersey_number (int)
  - status (text: active/practice_squad/free_agent/retired)
  - is_prospect (boolean)
  - school (text, null if pro)
  - draft_year (int, null if pro)

Table: player_game_stats  
  - player_id (uuid ref players.id)
  - game_id (uuid ref games.id)
  - season (int)
  - week (int)
  - snap_count (int)
  - routes_run (int)
  - targets (int)
  - receptions (int)
  - rec_yards (int)
  - touchdowns (int)
  - carries (int)
  - rush_yards (int)
  - completions (int, QB)
  - attempts (int, QB)
  - pass_yards (int, QB)
  - interceptions (int, QB)
  - fumbles (int)
  - fumbles_lost (int)
  - pass_rush_wins (int, DL)
  - tackles (int, LB/DB)
  - sacks (float)

Table: advanced_metrics
  - player_id (uuid)
  - season (int)
  - week (int, null = season total)
  - yprr (float)
  - epa_per_target (float)
  - separation_avg (float, yards)
  - air_yards_per_target (float)
  - yac_per_reception (float)
  - target_share (float, 0-1)
  - route_participation (float, 0-1)
  - cpoe (float, QB)
  - pressure_rate (float, QB)
  - pass_rush_win_rate (float, DL)
  - run_stop_rate (float, DL)

Table: games
  - id (uuid)
  - season (int)
  - week (int)
  - home_team (text)
  - away_team (text)
  - game_date (date)
  - game_type (text: regular/wild_card/divisional/conference/super_bowl)

Table: prospect_profiles
  - player_id (uuid)
  - draft_year (int)
  - school (text)
  - grade_overall (float)
  - grade_passing (float, QB)
  - grade_rushing (float)
  - grade_run_defense (float, DL)
  - grade_pass_rush (float, DL)
  - projection_round (int)
  - projection_pick_low (int)
  - projection_pick_high (int)
  - comparison_player (text)
  - ceiling (text)
  - floor (text)
  - scout_summary (text)
  - combine_forty (float)
  - combine_vertical (float)
  - combine_bench (int)
  - height_in (int)
  - weight_lbs (int)
---

INTENT TYPES:
- game_stat_lookup: specific player, specific game/week/season, specific stat
- season_stat_lookup: player season totals
- prospect_profile: full prospect breakdown
- advanced_stats: EPA, YPRR, separation, etc.
- ranking_query: top N players by metric
- comparison: player vs player
- trend_analysis: multi-week performance trend

RESPONSE FORMAT (always return valid JSON):
{
  "intent": "game_stat_lookup",
  "confidence": 0.95,
  "entities": {
    "player": "Jaylen Waddle",
    "season": 2023,
    "week": 7,
    "team": "MIA",
    "stat": "routes_run"
  },
  "sql_query": "SELECT pgs.routes_run, pgs.targets, pgs.receptions, pgs.rec_yards, pgs.snap_count, g.home_team, g.away_team, g.game_date FROM player_game_stats pgs JOIN players p ON p.id = pgs.player_id JOIN games g ON g.id = pgs.game_id WHERE p.name ILIKE '%Waddle%' AND pgs.season = 2023 AND pgs.week = 7",
  "display_type": "stat_cards_with_table",
  "response_text": "In Week 7 of 2023...",
  "highlight_metric": "routes_run",
  "highlight_value": 32
}

Rules:
- Always return valid SQL for Postgres
- Player name matching: use ILIKE with wildcards
- Season year: if not specified, assume current season (2024)
- Week: "playoffs" maps to game_type IN ('wild_card','divisional','conference','super_bowl')
- If data unavailable, say so clearly — never hallucinate numbers
- Keep response_text concise (2-3 sentences), bold key numbers with **
`;
```

### 5.3 Query API Route
```typescript
// app/api/query/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const { query } = await req.json();
  const client = new Anthropic();

  // Step 1: Parse query with Claude
  const parseResponse = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: query }]
  });

  const parsed = JSON.parse(parseResponse.content[0].text);

  // Step 2: Execute SQL
  const supabase = createClient();
  const { data, error } = await supabase.rpc('execute_query', { 
    query_text: parsed.sql_query 
  });

  // Step 3: Format response with Claude
  const formatResponse = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Query: "${query}"\nData: ${JSON.stringify(data)}\nWrite a 2-3 sentence natural language answer. Bold key numbers with **.`
    }]
  });

  return Response.json({
    intent: parsed.intent,
    displayType: parsed.display_type,
    responseText: formatResponse.content[0].text,
    data,
    entities: parsed.entities,
    highlightMetric: parsed.highlight_metric
  });
}
```

---

## 6. DATABASE SCHEMA (Supabase SQL)

```sql
-- Run in Supabase SQL Editor

-- Players
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  team TEXT,
  jersey_number INT,
  status TEXT DEFAULT 'active',
  is_prospect BOOLEAN DEFAULT FALSE,
  school TEXT,
  draft_year INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_players_name ON players USING gin(to_tsvector('english', name));
CREATE INDEX idx_players_team ON players(team);
CREATE INDEX idx_players_position ON players(position);

-- Games
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season INT NOT NULL,
  week INT NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  game_date DATE NOT NULL,
  game_type TEXT DEFAULT 'regular'
);
CREATE INDEX idx_games_season_week ON games(season, week);

-- Player Game Stats
CREATE TABLE player_game_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  season INT NOT NULL,
  week INT NOT NULL,
  snap_count INT DEFAULT 0,
  routes_run INT DEFAULT 0,
  targets INT DEFAULT 0,
  receptions INT DEFAULT 0,
  rec_yards INT DEFAULT 0,
  touchdowns INT DEFAULT 0,
  carries INT DEFAULT 0,
  rush_yards INT DEFAULT 0,
  completions INT DEFAULT 0,
  attempts INT DEFAULT 0,
  pass_yards INT DEFAULT 0,
  interceptions INT DEFAULT 0,
  fumbles INT DEFAULT 0,
  fumbles_lost INT DEFAULT 0,
  sacks FLOAT DEFAULT 0,
  tackles INT DEFAULT 0,
  pass_rush_wins INT DEFAULT 0,
  UNIQUE(player_id, game_id)
);
CREATE INDEX idx_pgs_player ON player_game_stats(player_id);
CREATE INDEX idx_pgs_season_week ON player_game_stats(season, week);

-- Advanced Metrics (season-level + week-level)
CREATE TABLE advanced_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  season INT NOT NULL,
  week INT,
  yprr FLOAT,
  epa_per_target FLOAT,
  separation_avg FLOAT,
  air_yards_per_target FLOAT,
  yac_per_reception FLOAT,
  target_share FLOAT,
  route_participation FLOAT,
  cpoe FLOAT,
  pressure_rate FLOAT,
  pass_rush_win_rate FLOAT,
  run_stop_rate FLOAT,
  UNIQUE(player_id, season, week)
);

-- Prospect Profiles
CREATE TABLE prospect_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  draft_year INT NOT NULL,
  grade_overall FLOAT,
  grade_passing FLOAT,
  grade_rushing FLOAT,
  grade_run_defense FLOAT,
  grade_pass_rush FLOAT,
  projection_round INT,
  projection_pick_low INT,
  projection_pick_high INT,
  comparison_player TEXT,
  ceiling TEXT,
  floor TEXT,
  scout_summary TEXT,
  combine_forty FLOAT,
  combine_vertical FLOAT,
  combine_bench INT,
  height_in INT,
  weight_lbs INT,
  UNIQUE(player_id, draft_year)
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE advanced_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access (free tier can see basic stats)
CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
CREATE POLICY "Public read games" ON games FOR SELECT USING (true);
CREATE POLICY "Public read basic stats" ON player_game_stats FOR SELECT USING (true);
-- Advanced metrics: require auth (pro tier via Supabase Auth + Stripe)
CREATE POLICY "Auth read advanced" ON advanced_metrics FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth read prospects" ON prospect_profiles FOR SELECT USING (auth.uid() IS NOT NULL);
```

---

## 7. DATA PIPELINE (Free / $25/month max)

### 7.1 Free Data Sources
```python
# scripts/etl/load_nfl_data.py
# Run: pip install nfl-data-py pandas supabase

import nfl_data_py as nfl
import pandas as pd
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Pull play-by-play (historical)
pbp = nfl.import_pbp_data([2022, 2023, 2024])

# Pull weekly player stats
weekly = nfl.import_weekly_data([2022, 2023, 2024])

# Pull rosters
rosters = nfl.import_rosters([2024])

# Pull NGS tracking data (speed, separation, route data)
ngs_receiving = nfl.import_ngs_data(stat_type='receiving', years=[2022, 2023, 2024])
ngs_rushing = nfl.import_ngs_data(stat_type='rushing', years=[2022, 2023, 2024])
ngs_passing = nfl.import_ngs_data(stat_type='passing', years=[2022, 2023, 2024])

# Transform and load into Supabase...
# (see /scripts/etl/ for full transform logic)
```

### 7.2 Live Data (ESPN Hidden API)
```typescript
// lib/data/espn.ts
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';

export async function getLiveScoreboard() {
  const res = await fetch(`${ESPN_BASE}/scoreboard`);
  return res.json();
}

export async function getPlayerProfile(playerId: string) {
  const res = await fetch(`${ESPN_BASE}/athletes/${playerId}`);
  return res.json();
}
```

### 7.3 GitHub Actions Cron (Free automated ETL)
```yaml
# .github/workflows/nfl-data-sync.yml
name: NFL Data Sync
on:
  schedule:
    - cron: '0 6 * * 2'  # Every Tuesday 6am (after Monday Night Football)
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with: { python-version: '3.11' }
      - run: pip install nfl-data-py pandas supabase
      - run: python scripts/etl/load_nfl_data.py
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

### 7.4 Budget Breakdown
| Service | Cost |
|---------|------|
| Supabase (free tier: 500MB, 2GB transfer) | $0/mo |
| Pinecone (free: 1 index, 100k vectors) | $0/mo |
| Vercel (free: hobby tier) | $0/mo |
| Claude API (est. 500 queries/day × $0.003) | ~$15-20/mo |
| RapidAPI / Tank01 NFL (starter plan) | $10/mo |
| Domain (gridiq.com, annual) | ~$1/mo |
| **TOTAL** | **~$26-31/mo** |

---

## 8. KEY COMPONENTS CODE

### 8.1 StatCard Component
```tsx
// components/player/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  badge?: string;
  accent: 'green' | 'orange' | 'blue' | 'purple';
}

export function StatCard({ label, value, sub, badge, accent }: StatCardProps) {
  const colors = {
    green: { line: 'from-[#00ff87]', val: 'text-[#00ff87]', badge: 'bg-[#00ff87]/10 text-[#00ff87] border-[#00ff87]/20' },
    orange: { line: 'from-[#ff6b2b]', val: 'text-[#ff6b2b]', badge: 'bg-[#ff6b2b]/10 text-[#ff6b2b] border-[#ff6b2b]/20' },
    blue: { line: 'from-[#3b9eff]', val: 'text-[#3b9eff]', badge: 'bg-[#3b9eff]/10 text-[#3b9eff] border-[#3b9eff]/20' },
    purple: { line: 'from-[#a855f7]', val: 'text-[#a855f7]', badge: 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/20' },
  };
  const c = colors[accent];

  return (
    <div className="relative bg-[#0d0d10] border border-white/[0.06] rounded-xl p-3.5 overflow-hidden">
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${c.line} to-transparent`} />
      <p className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[#44445a] mb-1">{label}</p>
      <p className={`text-2xl font-bold tracking-tight ${c.val}`}>{value}</p>
      {sub && <p className="text-[11px] text-[#8888a0] mt-0.5">{sub}</p>}
      {badge && (
        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1.5 ${c.badge}`}>
          {badge}
        </span>
      )}
    </div>
  );
}
```

### 8.2 PercentileBar Component
```tsx
// components/player/PercentileBar.tsx
interface PercentileBarProps {
  label: string;
  value: string | number;
  percentile: number;  // 0-100
  accent?: 'green' | 'orange' | 'blue';
}

export function PercentileBar({ label, value, percentile, accent = 'green' }: PercentileBarProps) {
  const fillColors = { green: '#00ff87', orange: '#ff6b2b', blue: '#3b9eff' };
  const textColors = { green: 'text-[#00ff87]', orange: 'text-[#ff6b2b]', blue: 'text-[#3b9eff]' };
  
  const color = percentile >= 80 ? 'green' : percentile >= 60 ? 'orange' : 'blue';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center text-[11px]">
        <span className="text-[#44445a] font-semibold uppercase tracking-[0.4px]">{label}</span>
        <span className={`font-bold ${textColors[color]}`}>{value}</span>
      </div>
      <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentile}%`, background: fillColors[color] }}
        />
      </div>
    </div>
  );
}
```

### 8.3 AIResponseCard Component
```tsx
// components/search/AIResponseCard.tsx
'use client';
import { useEffect, useState } from 'react';

interface AIResponseCardProps {
  text: string;
  accent?: 'green' | 'orange' | 'blue';
  streaming?: boolean;
}

export function AIResponseCard({ text, accent = 'green', streaming = false }: AIResponseCardProps) {
  const accentColors = {
    green: { border: 'border-l-[#00ff87]', label: 'text-[#00ff87]' },
    orange: { border: 'border-l-[#ff6b2b]', label: 'text-[#ff6b2b]' },
    blue: { border: 'border-l-[#3b9eff]', label: 'text-[#3b9eff]' },
  };
  const c = accentColors[accent];

  return (
    <div className={`bg-[#0d0d10] border border-white/[0.06] border-l-2 ${c.border} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-[6px] bg-gradient-to-br from-[#00ff87] to-[#3b9eff] flex items-center justify-center text-[10px] font-black text-[#050507]">G</div>
        <span className={`text-[11px] font-bold uppercase tracking-[0.5px] ${c.label}`}>GridIQ Analysis</span>
        {streaming && <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse" />}
      </div>
      <p className="text-[13px] text-[#8888a0] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#f2f2f5] font-medium">$1</strong>') }}
      />
    </div>
  );
}
```

### 8.4 Animated Hero (Framer Motion)
```tsx
// components/landing/Hero.tsx
'use client';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export function Hero() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="...">
      <motion.div variants={fadeUp}>
        {/* Badge */}
      </motion.div>
      <motion.h1 variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        The NFL Stats Platform<br />
        <span className="bg-gradient-to-r from-[#00ff87] via-[#3b9eff] to-[#ff6b2b] bg-clip-text text-transparent">
          Built for Obsessives
        </span>
      </motion.h1>
      {/* ... rest of hero */}
    </motion.div>
  );
}
```

---

## 9. ANIMATIONS & INTERACTIONS

### 9.1 Page Transitions (layout.tsx)
```tsx
// Use Framer Motion AnimatePresence for route transitions
// Fade + slight upward slide: duration 300ms, ease-out
```

### 9.2 Stat Card Reveal
- On mount: bars animate from 0 to target width (700ms, ease-out)
- Numbers count up with React useEffect + requestAnimationFrame
- Staggered: each card delays by 50ms

### 9.3 Search Interaction
- On focus: search bar border glows green
- On submit: loading pulse animation in avatar
- Results: fade-up with stagger (50ms between sections)

### 9.4 Player Card Hover
- `transform: translateY(-3px)` + border color change
- Duration: 200ms cubic-bezier

---

## 10. CURSOR / CLAUDE CODE PROMPTS

### Prompt 1 — Project Init
```
Create a Next.js 14 project with App Router called "gridiq" with:
- TypeScript
- Tailwind CSS
- shadcn/ui (dark theme)
- Framer Motion
- Supabase client

Set up the folder structure exactly as specified in the GridIQ PRD.
Create globals.css with all CSS variables from the design system.
Set up the Supabase client (client.ts and server.ts).
```

### Prompt 2 — Landing Page
```
Build the GridIQ landing page at app/(marketing)/page.tsx exactly matching the PRD design spec:
- Dark premium aesthetic with CSS variables from globals.css
- Hero with grid background, glow orbs, gradient headline, stat tickers
- Interactive browser frame demo with 4 player cards
- 6-card feature grid with hover animations
- Full prospect profile showcase (Fernando Mendoza style from reference image)
- Gradient stat boxes with percentile bars
- CTA section with gradient border
- All Framer Motion animations as specified
Use Inter font. Reference: background #050507, neon green #00ff87, orange #ff6b2b, blue #3b9eff.
```

### Prompt 3 — Search Interface
```
Build the main search interface at app/(app)/search/page.tsx:
- Fixed sidebar with recent queries and navigation
- AI search bar with neon green cursor animation
- Quick suggestion pills
- Dynamic result rendering: AIResponseCard, 4-column StatCard grid, DataTable
- All components should receive data as props (mock data for now)
- Implement the search bar animation on focus (green border glow)
```

### Prompt 4 — Player Profile
```
Build the player/prospect profile page at app/(app)/player/[id]/page.tsx:
- PFF-style layout inspired by reference image (Fernando Mendoza card)
- Large gradient header with school/team logo area
- Big neon-green overall grade with glow text-shadow  
- Tab navigation: Career Stats / Comparables / Grades / Analysis
- Year-by-year stats table (3 columns: 2025/2024/2023)
- 6 gradient stat boxes with percentile bars (locked for non-auth users)
- Horizontal game-by-game grade chart on the right
- Animated bar fills on page load
```

### Prompt 5 — API Route
```
Build the AI query API at app/api/query/route.ts using:
- @anthropic-ai/sdk
- The system prompt from the PRD (full schema description)
- 2-step Claude calls: (1) parse intent + generate SQL, (2) format response
- Execute SQL via Supabase service client
- Return structured JSON with { intent, displayType, responseText, data, entities }
```

---

## 11. ASSETS & THIRD-PARTY

### Player Visuals
- **Option A (recommended):** Use CSS/SVG abstract player silhouettes (included in component code above) — no licensing issues, loads instantly, perfectly on-brand with the dark aesthetic
- **Option B:** Use Midjourney or Leonardo.ai to generate dark, cinematic player silhouettes for each position — add as Next.js Image components with `priority` loading
- **Option C:** Envato Elements subscription ($16/mo) for licensed sports photography — use as background textures behind stat cards

### Team Logos
```
https://a.espncdn.com/i/teamlogos/nfl/500/{TEAM_ABBREV}.png
```
Use ESPN's CDN — free, always updated, no licensing needed for display.

### College Logos (for prospects)
```
https://a.espncdn.com/i/teamlogos/ncaa/500/{SCHOOL_ID}.png
```

### Icons
- **Lucide React** (already in shadcn) for UI icons
- Custom SVG for the GridIQ logo mark
- Phosphor Icons for stat category icons

---

## 12. LAUNCH CHECKLIST

- [ ] Supabase project created, schema applied
- [ ] Pinecone index created (for prospect report embeddings)
- [ ] `nfl_data_py` ETL script run for 2022-2024 seasons
- [ ] `.env.local` populated with all keys
- [ ] Landing page built + deployed to Vercel
- [ ] Search interface functional with mock data
- [ ] Claude API query engine connected
- [ ] Player profile page built
- [ ] GitHub Actions cron set up for weekly data sync
- [ ] Custom domain connected (gridiq.com)
- [ ] Vercel Analytics enabled
- [ ] Resend email set up for waitlist/alerts

---

*PRD Version 1.0 — GridIQ by [Your Name]*  
*Built with Next.js 14, Supabase, Claude API, Pinecone*  
*Design System: Dark premium sports analytics*
