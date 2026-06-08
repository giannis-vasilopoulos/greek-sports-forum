import type { LeagueSeed } from "@/lib/leagues/sources";
import { fetchSlgrLeagueLogo } from "@/lib/slgr/fetch-league-logo";

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const API_SPORTS_KEY = process.env.API_SPORTS_KEY;

async function fetchFootballDataEmblem(
  externalId: string,
): Promise<string | null> {
  if (!FOOTBALL_DATA_API_KEY || !externalId) return null;

  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${externalId}`,
    { headers: { "X-Auth-Token": FOOTBALL_DATA_API_KEY } },
  );

  if (!res.ok) return null;

  const data = (await res.json()) as { emblem?: string | null };
  return typeof data.emblem === "string" ? data.emblem : null;
}

async function fetchApiSportsLeagueLogo(
  leagueId: string,
): Promise<string | null> {
  if (!API_SPORTS_KEY || !leagueId) return null;

  const res = await fetch(
    `https://v1.basketball.api-sports.io/leagues?id=${leagueId}`,
    { headers: { "x-apisports-key": API_SPORTS_KEY } },
  );

  if (!res.ok) return null;

  const data = (await res.json()) as {
    response?: Array<{ logo?: string | null }>;
  };

  const logo = data.response?.[0]?.logo;
  return typeof logo === "string" ? logo : null;
}

async function fetchTheSportsDbLeagueBadge(
  searchName: string,
): Promise<string | null> {
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?c=Greece&s=Basketball`,
  );

  if (!res.ok) return null;

  const data = (await res.json()) as {
    countries?: Array<{
      leagues?: Array<{
        strLeague?: string;
        strBadge?: string | null;
      }>;
    }>;
  };

  const normalizedSearch = searchName.replace(/_/g, " ").toLowerCase();

  for (const country of data.countries ?? []) {
    for (const league of country.leagues ?? []) {
      const name = league.strLeague?.toLowerCase() ?? "";
      if (name.includes(normalizedSearch) || normalizedSearch.includes(name)) {
        return typeof league.strBadge === "string" ? league.strBadge : null;
      }
    }
  }

  return null;
}

export async function resolveLeagueLogoSourceUrl(
  league: LeagueSeed,
): Promise<string | null> {
  if (league.logoSourceUrl) {
    return league.logoSourceUrl;
  }

  if (league.provider === "football-data") {
    return fetchFootballDataEmblem(league.externalId);
  }

  if (league.provider === "api-basketball" && league.apiSportsSeason) {
    return fetchApiSportsLeagueLogo(league.externalId);
  }

  if (league.provider === "thesportsdb" && league.thesportsdbSearchName) {
    return fetchTheSportsDbLeagueBadge(league.thesportsdbSearchName);
  }

  if (league.provider === "slgr") {
    return fetchSlgrLeagueLogo();
  }

  return null;
}
