import type { TrendingApiResponse, TrendingFeedItem, TrendingPlayer } from "@/types/trending";
import { TEAM_FULL_DISPLAY } from "@/lib/trending/nfl-divisions";

const SOURCE_DISPLAY: Record<string, string> = {
  ESPN: "ESPN",
  NFL: "NFL Network",
  Beat: "Beat",
  Twitter: "X",
  Reddit: "Reddit",
  PFF: "PFF",
};

const src = (
  id: string,
  source: string,
  author: string,
  handle: string,
  headline: string,
  body: string,
  tags: string[],
  timeAgo: string,
  sentiment: TrendingFeedItem["sentiment"],
  engagement = { likes: 120, reposts: 34, views: 4200 },
): TrendingFeedItem => ({
  id,
  source,
  sourceName: SOURCE_DISPLAY[source] ?? source,
  author,
  authorHandle: handle,
  headline,
  body,
  playerTags: tags,
  engagement,
  timeAgo,
  url: "#",
  sentiment,
});

function players(...rows: [string, number][]): TrendingPlayer[] {
  return rows.map(([name, changePct], i) => ({
    id: `p-${i}-${name.replace(/\s/g, "")}`,
    name,
    changePct,
  }));
}

const wasPlayers = players(
  ["Jayden Daniels", 12.4],
  ["Terry McLaurin", 8.1],
  ["Brian Robinson Jr.", -2.3],
  ["Daron Payne", 5.6],
  ["Zach Ertz", 3.2],
);

const wasFeed: TrendingFeedItem[] = [
  src(
    "was-1",
    "ESPN",
    "Adam Schefter",
    "@AdamSchefter",
    "Commanders eye playoff positioning after strong December",
    "Washington has found rhythm on both sides of the ball. Sources say the staff is emphasizing situational football down the stretch.",
    ["Jayden Daniels", "Dan Quinn"],
    "12m",
    "positive",
  ),
  src(
    "was-2",
    "NFL",
    "NFL Network",
    "@NFLNetwork",
    "Commanders injury report: key DB limited in practice",
    "Secondary depth will be tested this week as the team prepares for a divisional matchup with playoff implications.",
    ["Kam Curl"],
    "1h",
    "neutral",
  ),
  src(
    "was-3",
    "Beat",
    "Ben Standig",
    "@BenStandig",
    "Inside the Commanders' red-zone evolution",
    "How Jayden Daniels' legs and improved play-action timing have changed the math inside the 20.",
    ["Jayden Daniels"],
    "2h",
    "positive",
  ),
  src(
    "was-4",
    "Twitter",
    "Field Yates",
    "@FieldYates",
    "Daniels continues to climb rookie QB efficiency charts",
    "Another week, another efficient outing. The rookie's decision-making under pressure has stood out.",
    ["Jayden Daniels"],
    "3h",
    "positive",
  ),
  src(
    "was-5",
    "Reddit",
    "r/Commanders",
    "u/HogsHaven",
    "McLaurin separation vs press — film thread",
    "Breaking down All-22 clips from the last two games. Terry's release package vs off coverage.",
    ["Terry McLaurin"],
    "4h",
    "neutral",
  ),
  src(
    "was-6",
    "PFF",
    "PFF NFL",
    "@PFF",
    "Washington OL ranks top 10 in pass-blocking efficiency",
    "Small sample swing, but the unit has stabilized with the current starting five.",
    ["Sam Cosmi"],
    "5h",
    "positive",
  ),
];

const dalFeed: TrendingFeedItem[] = [
  src(
    "dal-1",
    "ESPN",
    "Todd Archer",
    "@toddarcher",
    "Cowboys' playoff path narrows after NFC East shake-up",
    "Dallas needs help outside the building while cleaning up self-inflicted mistakes in the red zone.",
    ["Dak Prescott", "CeeDee Lamb"],
    "15m",
    "negative",
  ),
  src(
    "dal-2",
    "NFL",
    "Ian Rapoport",
    "@RapSheet",
    "Cowboys list two starters as questionable",
    "Both players logged limited participation; decision expected after Friday's practice.",
    ["Micah Parsons"],
    "45m",
    "neutral",
  ),
  src(
    "dal-3",
    "Beat",
    "Calvin Watkins",
    "@calvinwatkins",
    "Dak's timing with Lamb on intermediate crossers",
    "All-22 notes: footwork at the top of routes and how defenses are bracketing the boundary.",
    ["CeeDee Lamb", "Dak Prescott"],
    "2h",
    "neutral",
  ),
  src(
    "dal-4",
    "Twitter",
    "Jane Slater",
    "@SlaterNFL",
    "Micah Parsons win rate trending up again",
    "Pass-rush metrics back up the eye test from last week's tape.",
    ["Micah Parsons"],
    "3h",
    "positive",
  ),
  src(
    "dal-5",
    "Reddit",
    "r/cowboys",
    "u/StarHelmet",
    "Run defense vs 12 personnel — what changed?",
    "Charting opponent success rate by personnel grouping over the last three games.",
    [],
    "6h",
    "neutral",
  ),
];

const dalPlayers = players(
  ["CeeDee Lamb", 9.8],
  ["Micah Parsons", 6.2],
  ["Dak Prescott", -4.1],
  ["Jake Ferguson", 3.0],
);

const phiFeed: TrendingFeedItem[] = [
  src(
    "phi-1",
    "ESPN",
    "Tim McManus",
    "@Tim_McManus",
    "Eagles' offense finds answers in two-minute drill",
    "Philadelphia leaned on tempo packages late in halves with strong results.",
    ["Jalen Hurts", "A.J. Brown"],
    "20m",
    "positive",
  ),
  src(
    "phi-2",
    "NFL",
    "Tom Pelissero",
    "@TomPelissero",
    "Eagles elevate practice squad OL for depth",
    "Move comes as the team manages bumps along the interior.",
    [],
    "1h",
    "neutral",
  ),
  src(
    "phi-3",
    "Beat",
    "Zach Berman",
    "@ZBerm",
    "How Philly is using 11 vs 12 personnel in the red zone",
    "Tendencies shifting week to week as defenses adjust to the run game.",
    ["Saquon Barkley"],
    "2h",
    "neutral",
  ),
  src(
    "phi-4",
    "Twitter",
    "Jeff McLane",
    "@Jeff_McLane",
    "Hurts' rushing usage — smart management or overdue?",
    "Discussion around designed runs vs scrambles in high-leverage spots.",
    ["Jalen Hurts"],
    "4h",
    "neutral",
  ),
  src(
    "phi-5",
    "Reddit",
    "r/eagles",
    "u/BirdGang",
    "Film: A.J. Brown vs off-man — stem variety",
    "Compilation of releases that created separation on third down.",
    ["A.J. Brown"],
    "5h",
    "positive",
  ),
];

const phiPlayers = players(
  ["Jalen Hurts", 7.4],
  ["A.J. Brown", 5.1],
  ["Saquon Barkley", 11.2],
  ["DeVonta Smith", -1.8],
);

const kcFeed: TrendingFeedItem[] = [
  src(
    "kc-1",
    "ESPN",
    "Jeremy Fowler",
    "@JFowlerESPN",
    "Chiefs' offense clicks in two-minute as playoffs approach",
    "Kansas City continues to lean on situational mastery and defensive takeaways.",
    ["Patrick Mahomes", "Travis Kelce"],
    "8m",
    "positive",
  ),
  src(
    "kc-2",
    "NFL",
    "James Palmer",
    "@JamesPalmerTV",
    "Chiefs list WR as questionable for Saturday",
    "Team expects a game-time decision after a limited week.",
    ["Rashee Rice"],
    "50m",
    "neutral",
  ),
  src(
    "kc-3",
    "Beat",
    "Herbie Teope",
    "@HerbieTeope",
    "Steve Spagnuolo's pressure packages vs 11 personnel",
    "How KC is mixing simulated pressures to muddy QB reads.",
    ["Chris Jones"],
    "2h",
    "positive",
  ),
  src(
    "kc-4",
    "Twitter",
    "Nate Taylor",
    "@ByNateTaylor",
    "Mahomes EPA per dropback — rolling 4-week look",
    "Efficiency trending up as the line settles and Kelce finds space in the seams.",
    ["Patrick Mahomes"],
    "3h",
    "positive",
  ),
  src(
    "kc-5",
    "Reddit",
    "r/KansasCityChiefs",
    "u/ArrowheadPride",
    "Isiah Pacheco usage — early-down vs passing downs",
    "Snap and route participation breakdown from the last three games.",
    ["Isiah Pacheco"],
    "7h",
    "neutral",
  ),
  src(
    "kc-6",
    "PFF",
    "PFF Chiefs",
    "@PFF_Chiefs",
    "Chris Jones ranks top 3 in pass-rush win rate",
    "Interior disruption numbers remain elite even with extra attention.",
    ["Chris Jones"],
    "8h",
    "positive",
  ),
];

const kcPlayers = players(
  ["Patrick Mahomes", 4.2],
  ["Travis Kelce", 6.8],
  ["Chris Jones", 3.5],
  ["Rashee Rice", -3.0],
);

const bufFeed: TrendingFeedItem[] = [
  src(
    "buf-1",
    "ESPN",
    "Alaina Getzenberg",
    "@agetzenberg",
    "Bills' defense tightening red-zone stands late in season",
    "Buffalo has held opponents to field goals in key moments during the playoff push.",
    ["Josh Allen", "Matt Milano"],
    "18m",
    "positive",
  ),
  src(
    "buf-2",
    "NFL",
    "Mike Garafolo",
    "@MikeGarafolo",
    "Bills elevate DB from practice squad",
    "Move adds depth with a division game looming.",
    [],
    "1h",
    "neutral",
  ),
  src(
    "buf-3",
    "Beat",
    "Joe Buscaglia",
    "@JoeBuscaglia",
    "Josh Allen's deep ball accuracy — tracking data",
    "Air yards and completion probability vs man coverage on throws 20+ yards.",
    ["Josh Allen"],
    "2h",
    "positive",
  ),
  src(
    "buf-4",
    "Twitter",
    "Maddy Glab",
    "@MadGlab",
    "James Cook workload trending up in December",
    "Snap share and goal-line usage both up week over week.",
    ["James Cook"],
    "4h",
    "positive",
  ),
  src(
    "buf-5",
    "Reddit",
    "r/buffalobills",
    "u/BillsMafia",
    "Stefon Diggs target share — any concern?",
    "Discussion thread with charts from the last four games.",
    ["Stefon Diggs"],
    "6h",
    "negative",
  ),
];

const bufPlayers = players(
  ["Josh Allen", 8.9],
  ["James Cook", 10.4],
  ["Stefon Diggs", -5.2],
  ["Matt Milano", 2.1],
);

const MOCK_FULL: Record<
  string,
  Omit<TrendingApiResponse, "comingSoon" | "message"> & {
    record: string;
    division: string;
    coaching: string;
  }
> = {
  WAS: {
    team: "WAS",
    teamName: "Washington Commanders",
    record: "12-5",
    division: "NFC East",
    coaching: "HC Dan Quinn · OC Kliff Kingsbury · DC Joe Whitt Jr.",
    trendingPlayers: wasPlayers,
    feed: wasFeed,
  },
  DAL: {
    team: "DAL",
    teamName: "Dallas Cowboys",
    record: "7-10",
    division: "NFC East",
    coaching: "HC Mike McCarthy · OC Brian Schottenheimer · DC Mike Zimmer",
    trendingPlayers: dalPlayers,
    feed: dalFeed,
  },
  PHI: {
    team: "PHI",
    teamName: "Philadelphia Eagles",
    record: "14-3",
    division: "NFC East",
    coaching: "HC Nick Sirianni · OC Kellen Moore · DC Vic Fangio",
    trendingPlayers: phiPlayers,
    feed: phiFeed,
  },
  KC: {
    team: "KC",
    teamName: "Kansas City Chiefs",
    record: "15-2",
    division: "AFC West",
    coaching: "HC Andy Reid · OC Matt Nagy · DC Steve Spagnuolo",
    trendingPlayers: kcPlayers,
    feed: kcFeed,
  },
  BUF: {
    team: "BUF",
    teamName: "Buffalo Bills",
    record: "13-4",
    division: "AFC East",
    coaching: "HC Sean McDermott · OC Joe Brady · DC Bobby Babich",
    trendingPlayers: bufPlayers,
    feed: bufFeed,
  },
};

export function getMockTrending(team: string): TrendingApiResponse {
  const key = team.toUpperCase();
  if (key === "ALL") {
    const mergedFeed = [...wasFeed, ...dalFeed, ...phiFeed, ...kcFeed, ...bufFeed].slice(0, 24);
    const mergedPlayers = [...wasPlayers, ...dalPlayers, ...phiPlayers, ...kcPlayers, ...bufPlayers].slice(
      0,
      12,
    );
    return {
      team: "ALL",
      teamName: "All NFL",
      record: "—",
      division: "League",
      coaching: "Aggregated feed across featured teams",
      trendingPlayers: mergedPlayers,
      feed: mergedFeed,
    };
  }

  const full = MOCK_FULL[key];
  if (full) {
    return { ...full };
  }

  const display = TEAM_FULL_DISPLAY[key] ?? `Team ${key}`;
  return {
    team: key,
    teamName: display,
    trendingPlayers: [],
    feed: [],
    comingSoon: true,
    message: `We're building out ${display} coverage. Check back soon.`,
  };
}
