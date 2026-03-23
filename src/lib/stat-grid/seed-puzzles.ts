import type { StatGridCell, StatGridPuzzle } from "@/types/stat-grid";

function cell(
  position: number,
  stat_label: string,
  stat_value: string,
  context: string,
  answer: string,
  answer_aliases: string[],
  hints: StatGridCell["hints"],
  explanation: string,
): StatGridCell {
  return {
    position,
    stat_label,
    stat_value,
    context,
    answer,
    answer_aliases,
    hints,
    explanation,
  };
}

/** Five daily puzzles — same structure as DB seed (fantasy + advanced stats). */
export const STAT_GRID_SEED_PUZZLES: StatGridPuzzle[] = [
  {
    game_date: "2025-03-20",
    cells: [
      cell(0, "YPRR", "3.41", "#1 WR · 2024", "CeeDee Lamb", ["Lamb", "CeeDee", "CDL"], { position: "WR", team: "Dallas Cowboys", initial: "C.L.", year: "2024" }, "Lamb led all WRs in YPRR."),
      cell(1, "EPA/play", "+0.31", "QB · 2024 reg", "Josh Allen", ["Allen", "JA"], { position: "QB", team: "Buffalo Bills", initial: "J.A.", year: "2024" }, "Allen ranked #1 among QBs in EPA per play."),
      cell(2, "Rush Yards", "1,921", "RB · 2024", "Derrick Henry", ["Henry", "King"], { position: "RB", team: "Baltimore Ravens", initial: "D.H.", year: "2024" }, "Henry paced the league in rushing yards."),
      cell(3, "Target Share", "31.4%", "WR · 2024", "Amon-Ra St. Brown", ["St Brown", "ASB", "Amon-Ra"], { position: "WR", team: "Detroit Lions", initial: "A.S.", year: "2024" }, "Elite target hog role in Detroit."),
      cell(4, "Separation", "2.8 yds", "WR · avg · 2024", "Justin Jefferson", ["Jefferson", "JJ"], { position: "WR", team: "Minnesota Vikings", initial: "J.J.", year: "2024" }, "Jefferson creates separation at the stem."),
      cell(5, "Pass Rush Win Rate", "21.4%", "DT · 2024", "Rueben Bain", ["Bain"], { position: "DT/DE", team: "Miami FL", initial: "R.B.", year: "2024" }, "Elite college pass-rush win rate."),
      cell(6, "Comp%", "69.4%", "QB · 2024", "Patrick Mahomes", ["Mahomes", "Pat"], { position: "QB", team: "Kansas City Chiefs", initial: "P.M.", year: "2024" }, "Mahomes efficiency vs expectation."),
      cell(7, "Fantasy PPG", "24.8", "Half PPR · 2024", "Ja'Marr Chase", ["Chase", "Jamarr"], { position: "WR", team: "Cincinnati Bengals", initial: "J.C.", year: "2024" }, "Chase among WR1 fantasy producers."),
      cell(8, "Sacks", "18.0", "EDGE · 2024", "Myles Garrett", ["Garrett"], { position: "DE", team: "Cleveland Browns", initial: "M.G.", year: "2024" }, "Garrett topped the sack chart."),
      cell(9, "Snap%", "94.2%", "WR · routes", "Garrett Wilson", ["Wilson", "GW"], { position: "WR", team: "New York Jets", initial: "G.W.", year: "2024" }, "High route participation in New York."),
      cell(10, "Rec Yards", "1,378", "WR · 2024", "Puka Nacua", ["Nacua", "Puka"], { position: "WR", team: "Los Angeles Rams", initial: "P.N.", year: "2024" }, "Nacua among league leaders in yards."),
      cell(11, "Pass TDs", "41", "QB · 2024", "Joe Burrow", ["Burrow", "Joey B"], { position: "QB", team: "Cincinnati Bengals", initial: "J.B.", year: "2024" }, "Burrow pushed the ball for scores."),
    ],
  },
  {
    game_date: "2025-03-21",
    cells: [
      cell(0, "QBR", "80.1", "QB · 2024", "Josh Allen", ["Allen"], { position: "QB", team: "Buffalo Bills", initial: "J.A.", year: "2024" }, "Allen led in Total QBR."),
      cell(1, "YAC/rec", "5.8", "WR · 2024", "CeeDee Lamb", ["Lamb"], { position: "WR", team: "Dallas Cowboys", initial: "C.L.", year: "2024" }, "YAC machine after the catch."),
      cell(2, "Air Yards/att", "8.4", "QB · 2024", "Patrick Mahomes", ["Mahomes"], { position: "QB", team: "Kansas City Chiefs", initial: "P.M.", year: "2024" }, "Aggressive downfield passing."),
      cell(3, "EPA/play", "+0.22", "QB · 2024", "Lamar Jackson", ["Jackson", "LJ"], { position: "QB", team: "Baltimore Ravens", initial: "L.J.", year: "2024" }, "Jackson efficiency on designed and scrambles."),
      cell(4, "Target Share", "28.1%", "WR · 2024", "Amon-Ra St. Brown", ["St Brown", "Amon-Ra", "ASB"], { position: "WR", team: "Detroit Lions", initial: "A.S.", year: "2024" }, "Sun God volume in Detroit."),
      cell(5, "Separation", "2.6 yds", "WR · 2024", "Mike Evans", ["Evans"], { position: "WR", team: "Tampa Bay Buccaneers", initial: "M.E.", year: "2024" }, "Consistent separation profile."),
      cell(6, "Pass Rush Win Rate", "27.1%", "EDGE · 2024", "Myles Garrett", ["Garrett"], { position: "DE", team: "Cleveland Browns", initial: "M.G.", year: "2024" }, "Win rate vs pass sets."),
      cell(7, "Fantasy PPG", "22.4", "PPR · RB · 2024", "Bijan Robinson", ["Robinson", "Bijan"], { position: "RB", team: "Atlanta Falcons", initial: "B.R.", year: "2024" }, "Dual-threat fantasy ceiling."),
      cell(8, "Rush Yards", "1,299", "RB · 2024", "Saquon Barkley", ["Barkley", "Saquon"], { position: "RB", team: "Philadelphia Eagles", initial: "S.B.", year: "2024" }, "Eagles run game engine."),
      cell(9, "Snap%", "97.1%", "LT · 2024", "Lane Johnson", ["Johnson"], { position: "OT", team: "Philadelphia Eagles", initial: "L.J.", year: "2024" }, "Iron man tackle snaps."),
      cell(10, "Sacks", "16.5", "EDGE · 2024", "Micah Parsons", ["Parsons"], { position: "LB", team: "Dallas Cowboys", initial: "M.P.", year: "2024" }, "Parsons pressure totals."),
      cell(11, "Rec Yards", "1,011", "TE · 2024", "George Kittle", ["Kittle"], { position: "TE", team: "San Francisco 49ers", initial: "G.K.", year: "2024" }, "Kittle crossed 1K as a TE."),
    ],
  },
  {
    game_date: "2025-03-22",
    cells: [
      cell(0, "YPRR", "2.41", "WR · 2023", "Jaylen Waddle", ["Waddle"], { position: "WR", team: "Miami Dolphins", initial: "J.W.", year: "2023" }, "Waddle efficiency in Miami."),
      cell(1, "EPA/play", "+0.34", "WR · 2024", "CeeDee Lamb", ["Lamb"], { position: "WR", team: "Dallas Cowboys", initial: "C.L.", year: "2024" }, "Receiver EPA monster season."),
      cell(2, "Comp%", "72.4%", "QB · 2024", "Jared Goff", ["Goff"], { position: "QB", team: "Detroit Lions", initial: "J.G.", year: "2024" }, "Goff completion-friendly offense."),
      cell(3, "QBR", "72.4", "QB · 2024", "Jayden Daniels", ["Daniels", "JD"], { position: "QB", team: "Washington Commanders", initial: "J.D.", year: "2024" }, "Rookie QBR spike."),
      cell(4, "Target Share", "23.1%", "WR · 2023", "Tyreek Hill", ["Hill", "Cheetah"], { position: "WR", team: "Miami Dolphins", initial: "T.H.", year: "2023" }, "Miami alpha target share."),
      cell(5, "Pass Rush Win Rate", "24.8%", "DT · 2024", "Chris Jones", ["Jones"], { position: "DT", team: "Kansas City Chiefs", initial: "C.J.", year: "2024" }, "Interior disruption."),
      cell(6, "Fantasy PPG", "21.1", "Half PPR · QB", "Lamar Jackson", ["Jackson"], { position: "QB", team: "Baltimore Ravens", initial: "L.J.", year: "2024" }, "QB rushing upside."),
      cell(7, "Rush Yards", "891", "QB · 2024", "Jalen Hurts", ["Hurts"], { position: "QB", team: "Philadelphia Eagles", initial: "J.H.", year: "2024" }, "Designed QB run production."),
      cell(8, "Air Yards/att", "9.2", "QB · 2024", "Joe Flacco", ["Flacco"], { position: "QB", team: "Indianapolis Colts", initial: "J.F.", year: "2024" }, "Aggressive air yards stretch run."),
      cell(9, "YAC/rec", "7.1", "WR · 2024", "Nico Collins", ["Collins"], { position: "WR", team: "Houston Texans", initial: "N.C.", year: "2024" }, "YAC per reception."),
      cell(10, "Separation", "2.4 yds", "WR · 2024", "DeVonta Smith", ["Smith", "DeVonta"], { position: "WR", team: "Philadelphia Eagles", initial: "D.S.", year: "2024" }, "Average separation."),
      cell(11, "Snap%", "99.1%", "C · 2024", "Frank Ragnow", ["Ragnow"], { position: "C", team: "Detroit Lions", initial: "F.R.", year: "2024" }, "Center snap reliability."),
    ],
  },
  {
    game_date: "2025-03-23",
    cells: [
      cell(0, "EPA/play", "+0.22", "QB · playoffs", "Patrick Mahomes", ["Mahomes"], { position: "QB", team: "Kansas City Chiefs", initial: "P.M.", year: "2024" }, "Mahomes playoff efficiency."),
      cell(1, "YPRR", "3.12", "WR · 2024", "Amon-Ra St. Brown", ["St Brown", "ASB"], { position: "WR", team: "Detroit Lions", initial: "A.S.", year: "2024" }, "Slot-heavy YPRR."),
      cell(2, "Pass TDs", "43", "QB · 2024", "Joe Burrow", ["Burrow"], { position: "QB", team: "Cincinnati Bengals", initial: "J.B.", year: "2024" }, "Burrow volume scoring."),
      cell(3, "Sacks", "15.0", "EDGE · 2024", "Nick Bosa", ["Bosa"], { position: "DE", team: "San Francisco 49ers", initial: "N.B.", year: "2024" }, "Bosa sack production."),
      cell(4, "Fantasy PPG", "25.2", "PPR · WR", "Ja'Marr Chase", ["Chase"], { position: "WR", team: "Cincinnati Bengals", initial: "J.C.", year: "2024" }, "Chase spike weeks."),
      cell(5, "Rush Yards", "1,016", "RB · 2024", "Jahmyr Gibbs", ["Gibbs"], { position: "RB", team: "Detroit Lions", initial: "J.G.", year: "2024" }, "Gibbs breakout rushing."),
      cell(6, "Rec Yards", "1,378", "WR · 2024", "Justin Jefferson", ["Jefferson"], { position: "WR", team: "Minnesota Vikings", initial: "J.J.", year: "2024" }, "Jefferson yardage."),
      cell(7, "Target Share", "29.8%", "WR · 2024", "CeeDee Lamb", ["Lamb"], { position: "WR", team: "Dallas Cowboys", initial: "C.L.", year: "2024" }, "Alpha target share."),
      cell(8, "QBR", "66.1", "QB · 2024", "Baker Mayfield", ["Mayfield", "Baker"], { position: "QB", team: "Tampa Bay Buccaneers", initial: "B.M.", year: "2024" }, "Mayfield season QBR."),
      cell(9, "Pass Rush Win Rate", "22.1%", "EDGE · 2024", "Micah Parsons", ["Parsons"], { position: "LB", team: "Dallas Cowboys", initial: "M.P.", year: "2024" }, "Parsons win rate."),
      cell(10, "Comp%", "67.7%", "QB · 2024", "Baker Mayfield", ["Mayfield", "Baker"], { position: "QB", team: "Tampa Bay Buccaneers", initial: "B.M.", year: "2024" }, "Mayfield efficiency."),
      cell(11, "Air Yards/att", "7.8", "QB · 2024", "Matthew Stafford", ["Stafford"], { position: "QB", team: "Los Angeles Rams", initial: "M.S.", year: "2024" }, "Stafford vertical game."),
    ],
  },
  {
    game_date: "2025-03-24",
    cells: [
      cell(0, "YPRR", "2.88", "WR · 2024", "Mike Evans", ["Evans"], { position: "WR", team: "Tampa Bay Buccaneers", initial: "M.E.", year: "2024" }, "Evans efficiency."),
      cell(1, "EPA/play", "+0.28", "QB · 2024", "Lamar Jackson", ["Jackson"], { position: "QB", team: "Baltimore Ravens", initial: "L.J.", year: "2024" }, "Jackson EPA profile."),
      cell(2, "Separation", "2.9 yds", "WR · 2024", "Puka Nacua", ["Nacua", "Puka"], { position: "WR", team: "Los Angeles Rams", initial: "P.N.", year: "2024" }, "Nacua separation."),
      cell(3, "Snap%", "95.4%", "WR · 2024", "Tyreek Hill", ["Hill", "Cheetah"], { position: "WR", team: "Miami Dolphins", initial: "T.H.", year: "2024" }, "Hill usage."),
      cell(4, "Fantasy PPG", "23.7", "PPR · RB", "Christian McCaffrey", ["McCaffrey", "CMC"], { position: "RB", team: "San Francisco 49ers", initial: "C.M.", year: "2024" }, "CMC PPR ceiling."),
      cell(5, "Rush Yards", "1,459", "RB · 2024", "Jonathan Taylor", ["Taylor", "JT"], { position: "RB", team: "Indianapolis Colts", initial: "J.T.", year: "2024" }, "Taylor workload."),
      cell(6, "Sacks", "17.5", "EDGE · 2024", "Maxx Crosby", ["Crosby"], { position: "DE", team: "Las Vegas Raiders", initial: "M.C.", year: "2024" }, "Crosby pressure."),
      cell(7, "Pass TDs", "38", "QB · 2024", "Matthew Stafford", ["Stafford"], { position: "QB", team: "Los Angeles Rams", initial: "M.S.", year: "2024" }, "Stafford TD volume."),
      cell(8, "YAC/rec", "6.2", "WR · 2024", "Rashee Rice", ["Rice"], { position: "WR", team: "Kansas City Chiefs", initial: "R.R.", year: "2024" }, "Rice YAC."),
      cell(9, "Target Share", "26.2%", "TE · 2024", "Travis Kelce", ["Kelce"], { position: "TE", team: "Kansas City Chiefs", initial: "T.K.", year: "2024" }, "Kelce target share."),
      cell(10, "QBR", "75.2", "QB · 2024", "Josh Allen", ["Allen"], { position: "QB", team: "Buffalo Bills", initial: "J.A.", year: "2024" }, "Allen MVP-caliber QBR."),
      cell(11, "Pass Rush Win Rate", "19.8%", "EDGE · 2024", "Danielle Hunter", ["Hunter"], { position: "OLB", team: "Houston Texans", initial: "D.H.", year: "2024" }, "Hunter win rate."),
    ],
  },
];

export function getFallbackPuzzleForDate(isoDate: string): StatGridPuzzle {
  const exact = STAT_GRID_SEED_PUZZLES.find((p) => p.game_date === isoDate);
  if (exact) {
    return { ...exact, cells: exact.cells.map((c) => ({ ...c })) };
  }
  let hash = 0;
  for (let i = 0; i < isoDate.length; i++) {
    hash = (hash + isoDate.charCodeAt(i) * (i + 1)) % 9973;
  }
  const idx = hash % STAT_GRID_SEED_PUZZLES.length;
  const base = STAT_GRID_SEED_PUZZLES[idx]!;
  const cloned: StatGridPuzzle = {
    game_date: isoDate,
    cells: base.cells.map((c, i) => ({
      ...c,
      position: i,
    })),
  };
  return cloned;
}
