import { footballSeasonString } from "@/lib/leagues/sources";
import type { NormalizedStandingRow } from "@/lib/standings/types";

type TheSportsDbTableRow = {
  intRank?: string;
  strTeam?: string;
  intPoints?: string;
  intPlayed?: string;
  intWin?: string;
  intDraw?: string;
  intLoss?: string;
  intGoalsFor?: string;
  intGoalsAgainst?: string;
};

type TheSportsDbTableResponse = {
  table?: TheSportsDbTableRow[];
};

function parseIntField(value: string | undefined, fallback = 0): number {
  if (value === undefined || value === "") return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

export function parseTheSportsDbStandings(
  data: TheSportsDbTableResponse,
  season: string,
): NormalizedStandingRow[] {
  const rows = data.table ?? [];

  const parsed: NormalizedStandingRow[] = [];

  for (const row of rows) {
    const rank = parseIntField(row.intRank);
    const teamName = row.strTeam?.trim();
    if (!teamName || rank <= 0) continue;

    parsed.push({
      rank,
      teamName,
      points: parseIntField(row.intPoints),
      played: parseIntField(row.intPlayed),
      won: parseIntField(row.intWin),
      drawn: parseIntField(row.intDraw),
      lost: parseIntField(row.intLoss),
      goalsFor: parseIntField(row.intGoalsFor),
      goalsAgainst: parseIntField(row.intGoalsAgainst),
      season,
    });
  }

  return parsed.sort((a, b) => a.rank - b.rank);
}

export async function fetchTheSportsDbStandings(
  leagueId: string,
  season: string = footballSeasonString(),
): Promise<NormalizedStandingRow[]> {
  const url = new URL(
    "https://www.thesportsdb.com/api/v1/json/3/lookuptable.php",
  );
  url.searchParams.set("l", leagueId);
  url.searchParams.set("s", season);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TheSportsDB ${leagueId}: HTTP ${res.status} — ${body}`);
  }

  const data = (await res.json()) as TheSportsDbTableResponse;
  return parseTheSportsDbStandings(data, season);
}
