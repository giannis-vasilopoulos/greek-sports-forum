import type { NormalizedStandingRow } from "@/lib/standings/types";

type FootballDataStandingsResponse = {
  season?: { startDate?: string; endDate?: string };
  standings?: Array<{
    type?: string;
    table?: Array<{
      position: number;
      team: { name: string };
      playedGames: number;
      won: number;
      draw: number;
      lost: number;
      goalsFor: number;
      goalsAgainst: number;
      points: number;
    }>;
  }>;
};

function seasonLabelFromResponse(data: FootballDataStandingsResponse): string {
  const start = data.season?.startDate;
  if (start && /^\d{4}/.test(start)) {
    const y = Number.parseInt(start.slice(0, 4), 10);
    return `${y}-${y + 1}`;
  }
  const now = new Date();
  const year = now.getFullYear();
  return now.getMonth() >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

export function parseFootballDataStandings(
  data: FootballDataStandingsResponse,
): NormalizedStandingRow[] {
  const tables = data.standings ?? [];
  const total =
    tables.find((s) => s.type === "TOTAL")?.table ?? tables[0]?.table ?? [];

  const season = seasonLabelFromResponse(data);

  return total.map((row) => ({
    rank: row.position,
    teamName: row.team.name,
    points: row.points,
    played: row.playedGames,
    won: row.won,
    drawn: row.draw,
    lost: row.lost,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    season,
  }));
}

export async function fetchFootballDataStandings(
  externalId: string,
  apiKey: string,
): Promise<NormalizedStandingRow[]> {
  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${externalId}/standings`,
    { headers: { "X-Auth-Token": apiKey } },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `football-data.org ${externalId}: HTTP ${res.status} — ${body}`,
    );
  }

  const data = (await res.json()) as FootballDataStandingsResponse;
  return parseFootballDataStandings(data);
}
