export interface NormalizedTransferRow {
  playerName: string;
  fromTeamName: string;
  toTeamName: string;
  transferDate: string;
  feeText: string | null;
  season: string;
}
