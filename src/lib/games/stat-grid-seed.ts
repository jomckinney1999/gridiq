export type StatGridCellDef = {
  pos: number;
  label: string;
  value: string;
  context: string;
  answer: string;
  aliases: string[];
  hints: { position: string; team: string; initial: string; year: string };
};

export const STAT_GRID_SEED: StatGridCellDef[] = [
  {
    pos: 0,
    label: "YPRR",
    value: "3.41",
    context: "#1 WR · 2024",
    answer: "CeeDee Lamb",
    aliases: ["Lamb", "CeeDee"],
    hints: { position: "WR", team: "Dallas Cowboys", initial: "C.L.", year: "2024" },
  },
  {
    pos: 1,
    label: "EPA/Play",
    value: "+0.31",
    context: "#2 QB · 2024",
    answer: "Josh Allen",
    aliases: ["Allen"],
    hints: { position: "QB", team: "Buffalo Bills", initial: "J.A.", year: "2024" },
  },
  {
    pos: 2,
    label: "Rush Yards",
    value: "2,005",
    context: "RB · PHI · 2024",
    answer: "Saquon Barkley",
    aliases: ["Barkley", "Saquon"],
    hints: { position: "RB", team: "Philadelphia Eagles", initial: "S.B.", year: "2024" },
  },
  {
    pos: 3,
    label: "Rec Yards",
    value: "1,533",
    context: "WR · MIN · 2024",
    answer: "Justin Jefferson",
    aliases: ["Jefferson", "JJets"],
    hints: { position: "WR", team: "Minnesota Vikings", initial: "J.J.", year: "2024" },
  },
  {
    pos: 4,
    label: "Target Share",
    value: "31.4%",
    context: "WR · DAL · 2024",
    answer: "CeeDee Lamb",
    aliases: ["Lamb", "CeeDee"],
    hints: { position: "WR", team: "Dallas Cowboys", initial: "C.L.", year: "2024" },
  },
  {
    pos: 5,
    label: "Separation",
    value: "3.8 yds",
    context: "#1 Sep WR · 2024",
    answer: "Tyreek Hill",
    aliases: ["Hill", "Tyreek"],
    hints: { position: "WR", team: "Miami Dolphins", initial: "T.H.", year: "2024" },
  },
  {
    pos: 6,
    label: "PR Win Rate",
    value: "21.4%",
    context: "DT/DE · 2025 Draft",
    answer: "Rueben Bain",
    aliases: ["Bain", "Rueben"],
    hints: { position: "DT/DE", team: "Miami Hurricanes", initial: "R.B.", year: "2025" },
  },
  {
    pos: 7,
    label: "Pass TDs",
    value: "41",
    context: "QB · BUF · 2024",
    answer: "Josh Allen",
    aliases: ["Allen"],
    hints: { position: "QB", team: "Buffalo Bills", initial: "J.A.", year: "2024" },
  },
  {
    pos: 8,
    label: "Comp %",
    value: "71.5%",
    context: "QB · College · 2025",
    answer: "Fernando Mendoza",
    aliases: ["Mendoza", "Fernando"],
    hints: { position: "QB", team: "Indiana Hoosiers", initial: "F.M.", year: "2025" },
  },
  {
    pos: 9,
    label: "Sacks",
    value: "17.5",
    context: "EDGE · DAL · 2024",
    answer: "Micah Parsons",
    aliases: ["Parsons", "Micah"],
    hints: { position: "EDGE", team: "Dallas Cowboys", initial: "M.P.", year: "2024" },
  },
  {
    pos: 10,
    label: "Fantasy Pts",
    value: "312.4",
    context: "RB · PHI · 2024 PPR",
    answer: "Saquon Barkley",
    aliases: ["Barkley", "Saquon"],
    hints: { position: "RB", team: "Philadelphia Eagles", initial: "S.B.", year: "2024" },
  },
  {
    pos: 11,
    label: "ESPN QBR",
    value: "72.4",
    context: "QB · WAS · 2024",
    answer: "Jayden Daniels",
    aliases: ["Daniels", "Jayden"],
    hints: { position: "QB", team: "Washington Commanders", initial: "J.D.", year: "2024" },
  },
];
