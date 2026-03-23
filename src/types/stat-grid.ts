export type StatGridHints = {
  position: string;
  team: string;
  initial: string;
  year: string;
};

export type StatGridCell = {
  position: number;
  stat_label: string;
  stat_value: string;
  context: string;
  answer: string;
  answer_aliases: string[];
  hints: StatGridHints;
  explanation: string;
};

export type StatGridPuzzle = {
  id?: string;
  game_date: string;
  cells: StatGridCell[];
  created_at?: string;
};
