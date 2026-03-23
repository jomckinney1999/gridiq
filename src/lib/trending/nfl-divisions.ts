import { TEAM_COLORS } from "./team-colors";

export type TeamInfo = { abbr: string; name: string; color: string };

function t(abbr: string, name: string): TeamInfo {
  return { abbr, name, color: TEAM_COLORS[abbr] ?? "var(--txt-3)" };
}

export const NFL_DIVISIONS: { id: string; label: string; teams: TeamInfo[] }[] = [
  {
    id: "nfc-east",
    label: "NFC East",
    teams: [
      t("DAL", "Cowboys"),
      t("PHI", "Eagles"),
      t("WAS", "Commanders"),
      t("NYG", "Giants"),
    ],
  },
  {
    id: "nfc-north",
    label: "NFC North",
    teams: [
      t("GB", "Packers"),
      t("MIN", "Vikings"),
      t("CHI", "Bears"),
      t("DET", "Lions"),
    ],
  },
  {
    id: "nfc-south",
    label: "NFC South",
    teams: [
      t("TB", "Buccaneers"),
      t("NO", "Saints"),
      t("CAR", "Panthers"),
      t("ATL", "Falcons"),
    ],
  },
  {
    id: "nfc-west",
    label: "NFC West",
    teams: [
      t("SF", "49ers"),
      t("SEA", "Seahawks"),
      t("LAR", "Rams"),
      t("ARI", "Cardinals"),
    ],
  },
  {
    id: "afc-east",
    label: "AFC East",
    teams: [
      t("BUF", "Bills"),
      t("MIA", "Dolphins"),
      t("NE", "Patriots"),
      t("NYJ", "Jets"),
    ],
  },
  {
    id: "afc-north",
    label: "AFC North",
    teams: [
      t("BAL", "Ravens"),
      t("PIT", "Steelers"),
      t("CLE", "Browns"),
      t("CIN", "Bengals"),
    ],
  },
  {
    id: "afc-south",
    label: "AFC South",
    teams: [
      t("HOU", "Texans"),
      t("IND", "Colts"),
      t("TEN", "Titans"),
      t("JAX", "Jaguars"),
    ],
  },
  {
    id: "afc-west",
    label: "AFC West",
    teams: [
      t("KC", "Chiefs"),
      t("LAC", "Chargers"),
      t("LV", "Raiders"),
      t("DEN", "Broncos"),
    ],
  },
];

export const TEAM_FULL_NAMES: Record<string, string> = {};
NFL_DIVISIONS.forEach((d) => {
  d.teams.forEach((team) => {
    TEAM_FULL_NAMES[team.abbr] = team.name;
  });
});

/** Full franchise names for display (e.g. headers, empty states). */
export const TEAM_FULL_DISPLAY: Record<string, string> = {
  WAS: "Washington Commanders",
  DAL: "Dallas Cowboys",
  PHI: "Philadelphia Eagles",
  NYG: "New York Giants",
  GB: "Green Bay Packers",
  MIN: "Minnesota Vikings",
  CHI: "Chicago Bears",
  DET: "Detroit Lions",
  TB: "Tampa Bay Buccaneers",
  NO: "New Orleans Saints",
  CAR: "Carolina Panthers",
  ATL: "Atlanta Falcons",
  SF: "San Francisco 49ers",
  SEA: "Seattle Seahawks",
  LAR: "Los Angeles Rams",
  ARI: "Arizona Cardinals",
  BUF: "Buffalo Bills",
  MIA: "Miami Dolphins",
  NE: "New England Patriots",
  NYJ: "New York Jets",
  BAL: "Baltimore Ravens",
  PIT: "Pittsburgh Steelers",
  CLE: "Cleveland Browns",
  CIN: "Cincinnati Bengals",
  HOU: "Houston Texans",
  IND: "Indianapolis Colts",
  TEN: "Tennessee Titans",
  JAX: "Jacksonville Jaguars",
  KC: "Kansas City Chiefs",
  LAC: "Los Angeles Chargers",
  LV: "Las Vegas Raiders",
  DEN: "Denver Broncos",
};
