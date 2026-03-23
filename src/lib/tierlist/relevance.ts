import type { PositionFilter, TierListPlayer } from "@/types/tierlist";

/** Curated order (lower index = more relevant) for tier list surfacing. */
const QB_ORDER: string[] = [
  "Patrick Mahomes",
  "Josh Allen",
  "Lamar Jackson",
  "Joe Burrow",
  "Jalen Hurts",
  "Jayden Daniels",
  "C.J. Stroud",
  "Jordan Love",
  "Dak Prescott",
  "Kirk Cousins",
  "Brock Purdy",
  "Jared Goff",
  "Matthew Stafford",
  "Tua Tagovailoa",
  "Justin Herbert",
  "Aaron Rodgers",
  "Kyler Murray",
  "Bo Nix",
  "Derek Carr",
  "Geno Smith",
  "Russell Wilson",
  "Baker Mayfield",
  "Justin Fields",
  "Anthony Richardson",
  "Caleb Williams",
  "Drake Maye",
  "Michael Penix",
  "Trevor Lawrence",
  "Will Levis",
  "Sam Darnold",
  "Daniel Jones",
  "Mac Jones",
];

const WR_ORDER: string[] = [
  "CeeDee Lamb",
  "Justin Jefferson",
  "Tyreek Hill",
  "Davante Adams",
  "Ja'Marr Chase",
  "Jaylen Waddle",
  "Terry McLaurin",
  "A.J. Brown",
  "Amon-Ra St. Brown",
  "Mike Evans",
  "Chris Godwin",
  "Stefon Diggs",
  "DeVonta Smith",
  "DK Metcalf",
  "Garrett Wilson",
  "Puka Nacua",
  "Cooper Kupp",
  "Brandon Aiyuk",
  "Deebo Samuel",
  "DJ Moore",
  "Keenan Allen",
  "Calvin Ridley",
  "Tyler Lockett",
  "Courtland Sutton",
  "Nico Collins",
  "Marvin Harrison",
  "Malik Nabers",
  "Rome Odunze",
  "Xavier Worthy",
  "Brian Thomas",
  "Zay Flowers",
  "Drake London",
];

const RB_ORDER: string[] = [
  "Christian McCaffrey",
  "Saquon Barkley",
  "Derrick Henry",
  "Bijan Robinson",
  "Jahmyr Gibbs",
  "Jonathan Taylor",
  "Kyren Williams",
  "James Cook",
  "Josh Jacobs",
  "Alvin Kamara",
  "De'Von Achane",
  "Breece Hall",
  "Travis Etienne",
  "Tony Pollard",
  "Rachaad White",
  "Aaron Jones",
  "David Montgomery",
  "Kenneth Walker",
  "Chuba Hubbard",
  "Joe Mixon",
  "Isiah Pacheco",
  "James Conner",
  "Zamir White",
  "Jaylen Wright",
  "RJ Harvey",
  "Bucky Irving",
  "Chase Brown",
  "Tyler Allgeier",
  "Zack Moss",
  "Jerome Ford",
  "Nick Chubb",
  "Austin Ekeler",
];

const TE_ORDER: string[] = [
  "Travis Kelce",
  "George Kittle",
  "Mark Andrews",
  "Sam LaPorta",
  "Trey McBride",
  "T.J. Hockenson",
  "Dallas Goedert",
  "Evan Engram",
  "Jake Ferguson",
  "David Njoku",
  "Cole Kmet",
  "Dalton Kincaid",
  "Kyle Pitts",
  "Brock Bowers",
  "Jonnu Smith",
  "Hunter Henry",
  "Pat Freiermuth",
  "Luke Musgrave",
  "Tucker Kraft",
  "Isaiah Likely",
  "Cade Otton",
  "Chig Okonkwo",
  "Juwan Johnson",
  "Tyler Warren",
  "Harold Fannin",
  "Mason Taylor",
  "Ja'Tavion Sanders",
  "Theo Johnson",
  "Michael Mayer",
  "Tanner Hudson",
  "Noah Fant",
  "Greg Dulcich",
];

const EDGE_ORDER: string[] = [
  "Myles Garrett",
  "Micah Parsons",
  "Nick Bosa",
  "Maxx Crosby",
  "T.J. Watt",
  "Khalil Mack",
  "Danielle Hunter",
  "Brian Burns",
  "Will Anderson",
  "Aidan Hutchinson",
  "Montez Sweat",
  "Haason Reddick",
  "Bradley Chubb",
  "Rashan Gary",
  "Travon Walker",
  "Kayvon Thibodeaux",
  "Jaelan Phillips",
  "Alex Highsmith",
  "Jonathan Greenard",
  "Carl Granderson",
  "George Karlaftis",
  "DeMarcus Lawrence",
  "Za'Darius Smith",
  "Preston Smith",
  "Leonard Floyd",
  "Josh Uche",
  "Bryce Huff",
  "Jonathon Cooper",
  "Andrew Van Ginkel",
  "Nik Bonitto",
  "Odafe Oweh",
  "Uchenna Nwosu",
];

const OL_ORDER: string[] = [
  "Trent Williams",
  "Lane Johnson",
  "Zack Martin",
  "Quenton Nelson",
  "Frank Ragnow",
  "Jason Kelce",
  "Creed Humphrey",
  "Tyron Smith",
  "Penei Sewell",
  "Andrew Thomas",
  "Rashawn Slater",
  "Tristan Wirfs",
  "Ryan Ramczyk",
  "Joel Bitonio",
  "Joe Thuney",
  "Chris Lindstrom",
  "Alijah Vera-Tucker",
  "Tyler Smith",
  "Jordan Mailata",
  "Terron Armstead",
  "Ronnie Stanley",
  "Taylor Moton",
  "Brian O'Neill",
  "Bradley Bozeman",
  "Tyler Linderbaum",
  "Josh Myers",
  "Cole Strange",
  "Kevin Zeitler",
  "Elgton Jenkins",
  "Laremy Tunsil",
  "Dion Dawkins",
  "Charles Cross",
];

const DB_ORDER: string[] = [
  "Patrick Surtain II",
  "Sauce Gardner",
  "Denzel Ward",
  "Jalen Ramsey",
  "Darius Slay",
  "Marlon Humphrey",
  "Jaire Alexander",
  "Trevon Diggs",
  "Marshon Lattimore",
  "Xavien Howard",
  "Derwin James",
  "Minkah Fitzpatrick",
  "Jessie Bates",
  "Antoine Winfield",
  "Justin Simmons",
  "Kyle Hamilton",
  "Xavier McKinney",
  "Harrison Smith",
  "Budda Baker",
  "Jevon Holland",
  "Talanoa Hufanga",
  "Jordan Poyer",
  "Micah Hyde",
  "Kevin Byard",
  "Eddie Jackson",
  "Quay Walker",
  "Fred Warner",
  "Roquan Smith",
  "Bobby Wagner",
  "Zaire Franklin",
  "Demario Davis",
  "Lavonte David",
];

const ALL_TIME_ORDER: string[] = [
  ...QB_ORDER.slice(0, 8),
  ...WR_ORDER.slice(0, 8),
  ...RB_ORDER.slice(0, 8),
  ...TE_ORDER.slice(0, 8),
];

export function orderForFilter(filter: PositionFilter): string[] {
  switch (filter) {
    case "QB":
      return QB_ORDER;
    case "WR":
      return WR_ORDER;
    case "RB":
      return RB_ORDER;
    case "TE":
      return TE_ORDER;
    case "EDGE":
      return EDGE_ORDER;
    case "OL":
      return OL_ORDER;
    case "DB":
      return DB_ORDER;
    case "All-Time":
      return ALL_TIME_ORDER;
    default:
      return QB_ORDER;
  }
}

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Lower score = higher relevance. Unknown names sort after known, alphabetically.
 */
export function relevanceScore(name: string, filter: PositionFilter): number {
  const order = orderForFilter(filter);
  const n = normalizeName(name);
  for (let i = 0; i < order.length; i++) {
    if (normalizeName(order[i]) === n) return i;
  }
  for (let i = 0; i < order.length; i++) {
    if (n.includes(normalizeName(order[i])) || normalizeName(order[i]).includes(n)) {
      return i + 0.5;
    }
  }
  return 1000 + n.charCodeAt(0);
}

export function sortPlayersByRelevance<T extends { name: string }>(
  rows: T[],
  filter: PositionFilter,
): T[] {
  return [...rows].sort(
    (a, b) => relevanceScore(a.name, filter) - relevanceScore(b.name, filter),
  );
}

function defaultPositionLabel(filter: PositionFilter): string {
  switch (filter) {
    case "QB":
      return "QB";
    case "WR":
      return "WR";
    case "RB":
      return "RB";
    case "TE":
      return "TE";
    case "EDGE":
      return "DE";
    case "OL":
      return "OT";
    case "DB":
      return "CB";
    case "All-Time":
      return "—";
    default:
      return "QB";
  }
}

/** Deterministic pool when Supabase has no rows (dev / empty DB). */
function filterSlug(filter: PositionFilter): string {
  return filter === "All-Time" ? "AllTime" : filter;
}

function slugToFilter(slug: string): PositionFilter | null {
  if (slug === "AllTime") return "All-Time";
  const allowed: PositionFilter[] = [
    "QB",
    "WR",
    "RB",
    "TE",
    "EDGE",
    "OL",
    "DB",
    "All-Time",
  ];
  return (allowed as string[]).includes(slug) ? (slug as PositionFilter) : null;
}

export function fallbackTierPlayers(filter: PositionFilter): TierListPlayer[] {
  const names = orderForFilter(filter).slice(0, 32);
  const pos = defaultPositionLabel(filter);
  const slug = filterSlug(filter);
  return names.map((name, i) => ({
    id: `fb-${slug}-${i}`,
    name,
    team: "NFL",
    position: pos,
  }));
}

/** Resolve deterministic fallback ids saved in tier lists (e.g. `fb-QB-3`, `fb-AllTime-1`). */
export function resolveFallbackPlayerId(id: string): TierListPlayer | null {
  const m = /^fb-([A-Za-z]+)-(\d+)$/.exec(id);
  if (!m) return null;
  const filter = slugToFilter(m[1]);
  if (!filter) return null;
  const i = Number(m[2]);
  const names = orderForFilter(filter);
  const name = names[i];
  if (!name) return null;
  return {
    id,
    name,
    team: "NFL",
    position: defaultPositionLabel(filter),
  };
}
