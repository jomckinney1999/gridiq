export const GURU_ANALYSTS = [
  { name: "Daniel Jeremiah", org: "NFL Network", initials: "DJ", color: "#7c3aed" },
  { name: "Bucky Brooks", org: "NFL Network", initials: "BB", color: "#7c3aed" },
  { name: "Greg Rosenthal", org: "NFL.com", initials: "GR", color: "#1a6fd4" },
  { name: "Trevor Sikkema", org: "PFF", initials: "TS", color: "#00a854" },
  { name: "Connor Rogers", org: "NFL Network", initials: "CR", color: "#1a6fd4" },
  { name: "Pro Football Focus", org: "PFF Grade", initials: "PFF", color: "#00a854" },
  { name: "ESPN Analytics", org: "QBR / Grades", initials: "ESPN", color: "#d00" },
] as const;

export type GuruAnalyst = (typeof GURU_ANALYSTS)[number];

export function deriveAnalystScores(input: {
  expertScore: number;
  pffGrade: number | null;
  espnQbr: number | null;
  analystConsensus: number | null;
  statsScore: number | null;
}): { name: string; org: string; initials: string; color: string; score: number; label: string }[] {
  const base = Math.round(
    Number.isFinite(input.expertScore) ? input.expertScore : 75,
  );
  const pff = input.pffGrade != null ? Math.min(100, Math.max(0, input.pffGrade)) : null;
  const qbr = input.espnQbr != null ? Math.min(100, Math.max(0, input.espnQbr)) : null;
  const consensus = input.analystConsensus != null ? Math.min(100, Math.max(0, input.analystConsensus)) : null;
  const stats = input.statsScore != null ? Math.min(100, Math.max(0, input.statsScore)) : null;

  return [
    { ...GURU_ANALYSTS[0], score: consensus ?? base - 2, label: consensus != null ? `${consensus}` : "—" },
    { ...GURU_ANALYSTS[1], score: base + 1, label: `${base + 1}` },
    { ...GURU_ANALYSTS[2], score: stats ?? base, label: stats != null ? `${stats}` : `${base}` },
    { ...GURU_ANALYSTS[3], score: pff != null ? Math.round(pff) : base - 1, label: pff != null ? `${pff.toFixed(1)}` : "—" },
    { ...GURU_ANALYSTS[4], score: base + 2, label: `${base + 2}` },
    {
      ...GURU_ANALYSTS[5],
      score: pff != null ? Math.round(pff) : base,
      label: pff != null ? `${pff.toFixed(1)}` : "—",
    },
    {
      ...GURU_ANALYSTS[6],
      score: qbr != null ? Math.round(qbr) : base - 3,
      label: qbr != null ? `${qbr.toFixed(1)}` : "—",
    },
  ];
}
