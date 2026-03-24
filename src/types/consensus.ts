export type ConsensusCurrentRank = {
  source: string;
  rank: number;
  total: number;
  url?: string;
  asOf: string;
};

export type ConsensusHistoricalPoint = {
  date: string;
  label: string;
  avgRank: number;
  expertRank: number;
  fanRank: number;
};

export type ConsensusRankingPayload = {
  playerName: string;
  position: string;
  positionLabel: string;
  /** Rounded average rank across sources (for badge) */
  avgRankDisplay: number | null;
  currentRankings: ConsensusCurrentRank[];
  historicalRanks: ConsensusHistoricalPoint[];
  positionPercentile: number;
  historicalPeerPct: number;
};
