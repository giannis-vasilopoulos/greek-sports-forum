import {
  apiFootballSeasonString,
  resolveApiFootballSeasonYear,
} from "@/lib/leagues/sources";
import type { NormalizedTransferRow } from "@/lib/transfers/types";

import { withApiFootballRateLimitRetry } from "./api-football-throttle";

const API_BASE = "https://v3.football.api-sports.io";

export interface ApiFootballTeam {
  id: number;
  name: string;
}

type ApiSportsErrors = Record<string, string> | string[];

type ApiSportsResponse<T> = {
  errors?: ApiSportsErrors;
  response?: T;
};

export type ApiFootballTransferEntry = {
  date: string;
  type: string | null;
  teams: {
    in: { id: number | null; name: string | null };
    out: { id: number | null; name: string | null };
  };
};

export type ApiFootballPlayerTransfers = {
  player: { id: number; name: string };
  transfers: ApiFootballTransferEntry[];
};

function parseApiSportsErrors(data: { errors?: ApiSportsErrors }): void {
  const { errors } = data;
  if (!errors) return;

  const messages =
    typeof errors === "object" && !Array.isArray(errors)
      ? Object.values(errors)
      : errors;

  if (messages.length > 0) {
    throw new Error(`API-Football: ${JSON.stringify(messages)}`);
  }
}

function seasonStartDate(seasonYear: number): string {
  return `${seasonYear}-07-01`;
}

export function parseApiFootballTransfers(
  entries: ApiFootballPlayerTransfers[],
  seasonYear = resolveApiFootballSeasonYear(),
): NormalizedTransferRow[] {
  const season = apiFootballSeasonString(seasonYear);
  const cutoff = seasonStartDate(seasonYear);
  const rows: NormalizedTransferRow[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    const playerName = entry.player.name?.trim();
    if (!playerName) continue;

    for (const transfer of entry.transfers) {
      if (!transfer.date || transfer.date < cutoff) continue;

      const fromTeamName = transfer.teams.out.name?.trim() || "—";
      const toTeamName = transfer.teams.in.name?.trim() || "—";
      const dedupeKey = `${playerName}|${toTeamName}|${transfer.date}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      rows.push({
        playerName,
        fromTeamName,
        toTeamName,
        transferDate: transfer.date,
        feeText: transfer.type?.trim() || null,
        season,
      });
    }
  }

  return rows.sort((a, b) => b.transferDate.localeCompare(a.transferDate));
}

async function apiFootballFetch<T>(
  path: string,
  params: Record<string, string>,
  apiKey: string,
): Promise<T> {
  return withApiFootballRateLimitRetry(async () => {
    const url = new URL(`${API_BASE}${path}`);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const res = await fetch(url, {
      headers: { "x-apisports-key": apiKey },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`API-Football ${path}: HTTP ${res.status} — ${body}`);
    }

    const data = (await res.json()) as ApiSportsResponse<T>;
    parseApiSportsErrors(data);

    if (!Array.isArray(data.response)) {
      throw new TypeError(`API-Football ${path}: unexpected response shape`);
    }

    return data.response;
  });
}

export async function fetchApiFootballTeams(
  leagueId: string,
  apiKey: string,
  seasonYear = resolveApiFootballSeasonYear(),
): Promise<ApiFootballTeam[]> {
  const response = await apiFootballFetch<
    Array<{ team: { id: number; name: string } }>
  >("/teams", { league: leagueId, season: String(seasonYear) }, apiKey);

  return response.map((row) => ({
    id: row.team.id,
    name: row.team.name,
  }));
}

export async function fetchApiFootballTransfersForTeam(
  teamId: number,
  apiKey: string,
): Promise<ApiFootballPlayerTransfers[]> {
  return apiFootballFetch<ApiFootballPlayerTransfers[]>(
    "/transfers",
    { team: String(teamId) },
    apiKey,
  );
}

export async function fetchApiFootballTransfersForLeague(
  leagueId: string,
  apiKey: string,
  seasonYear = resolveApiFootballSeasonYear(),
): Promise<NormalizedTransferRow[]> {
  const teams = await fetchApiFootballTeams(leagueId, apiKey, seasonYear);
  const allEntries: ApiFootballPlayerTransfers[] = [];

  for (const team of teams) {
    const entries = await fetchApiFootballTransfersForTeam(team.id, apiKey);
    allEntries.push(...entries);
  }

  return parseApiFootballTransfers(allEntries, seasonYear);
}
