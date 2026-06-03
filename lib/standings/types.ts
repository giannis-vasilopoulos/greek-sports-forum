export interface NormalizedStandingRow {
  rank: number;
  teamName: string;
  points: number;
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  season: string;
}
