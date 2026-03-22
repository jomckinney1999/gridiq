export type StatAccent = "green" | "orange" | "blue" | "purple";

export type KeyStat = {
  label: string;
  value: string;
  sub?: string;
  accent?: StatAccent;
  rank?: string;
};

export type TableRow = string[] | { cells: string[]; highlight?: boolean };

export type TableData = {
  headers: string[];
  rows: TableRow[];
};

export type GridIQAPIResponse = {
  intent: string;
  entities: Record<string, unknown>;
  display_type: string;
  response_text: string;
  key_stats: KeyStat[];
  table_data: TableData | null;
  follow_up_suggestions: string[];
  rawText?: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
