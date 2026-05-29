/* eslint-disable @typescript-eslint/no-unused-vars */
import "dotenv/config";
import { pathToFileURL } from "node:url";

import { leagues, teams } from "./schema";
import { seedUsers } from "./seed/users";

import { db } from "./index";

type LeagueSeed = {
  slug: string;
  name: string;
  displayOrder: number;
  provider: "football-data" | "api-football" | "api-basketball" | "thesportsdb";
  externalId: string;
  apiSportsSeason?: string;
  thesportsdbSearchName?: string;
  sport: "football" | "basketball";
  type?: "league" | "tournament";
};

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const API_SPORTS_KEY = process.env.API_SPORTS_KEY;

const FOOTBALL_SEASON = "2024"; //footballSeasonStartYear();
const BASKETBALL_SEASON = "2024-2025"; // basketballSeasonString();

/**
 * Team data sources (see fetchTeamsForLeague):
 *
 * | Provider        | Env var               | Leagues                                      | Endpoint |
 * |-----------------|-----------------------|----------------------------------------------|----------|
 * | api-football    | API_SPORTS_KEY        | Super League (197)                           | GET v3.football.api-sports.io/teams?league=&season= |
 * | api-basketball  | API_SPORTS_KEY        | Euroleague (120), NBA (12)                   | GET v1.basketball.api-sports.io/teams?league=&season= |
 * | football-data   | FOOTBALL_DATA_API_KEY | Champions League, PL, La Liga, Bundesliga,   | GET api.football-data.org/v4/competitions/{id}/teams |
 * |                 |                       | Serie A, World Cup, Euro                     |          |
 * | thesportsdb     | (none — public key)   | Basket League (4452)                         | GET thesportsdb.com/.../search_all_teams.php?l= |
 */
const LEAGUE_SEEDS: LeagueSeed[] = [
  // api-football (API_SPORTS_KEY) — v3.football.api-sports.io
  {
    slug: "super-league",
    name: "Super League",
    displayOrder: 1,
    provider: "api-football",
    externalId: "197",
    apiSportsSeason: FOOTBALL_SEASON,
    sport: "football",
  },
  // football-data.org (FOOTBALL_DATA_API_KEY) — free tier, 7s delay between calls
  {
    slug: "champions-league",
    name: "Champions League",
    displayOrder: 2,
    provider: "football-data",
    externalId: "2001",
    sport: "football",
  },
  {
    slug: "premier-league",
    name: "Premier League",
    displayOrder: 3,
    provider: "football-data",
    externalId: "2021",
    sport: "football",
  },
  {
    slug: "la-liga",
    name: "La Liga",
    displayOrder: 4,
    provider: "football-data",
    externalId: "2014",
    sport: "football",
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    displayOrder: 5,
    provider: "football-data",
    externalId: "2002",
    sport: "football",
  },
  {
    slug: "serie-a",
    name: "Serie A",
    displayOrder: 6,
    provider: "football-data",
    externalId: "2019",
    sport: "football",
  },
  // api-basketball (API_SPORTS_KEY) — v1.basketball.api-sports.io
  {
    slug: "euroleague",
    name: "Euroleague",
    displayOrder: 7,
    provider: "api-basketball",
    externalId: "120",
    apiSportsSeason: BASKETBALL_SEASON,
    sport: "basketball",
  },
  {
    slug: "nba",
    name: "NBA",
    displayOrder: 8,
    provider: "api-basketball",
    externalId: "12",
    apiSportsSeason: BASKETBALL_SEASON,
    sport: "basketball",
  },
  // thesportsdb (no key) — search_all_teams.php?l=Greek_Basket_League
  {
    slug: "basket-league",
    name: "Basket League",
    displayOrder: 9,
    provider: "thesportsdb",
    externalId: "4452",
    thesportsdbSearchName: "Greek_Basket_League",
    sport: "basketball",
  },
  // football-data.org — tournaments
  {
    slug: "world-cup",
    name: "Παγκόσμιο Κύπελλο",
    displayOrder: 10,
    provider: "football-data",
    externalId: "2000",
    sport: "football",
    type: "tournament",
  },
  {
    slug: "euro",
    name: "Euro",
    displayOrder: 11,
    provider: "football-data",
    externalId: "2018",
    sport: "football",
    type: "tournament",
  },
];

type SeedTeam = {
  name: string;
  slug: string;
  logoUrl: string | null;
};

type ApiSportsResponse = {
  errors?: Record<string, string> | string[];
  response?: Array<{ team: { name: string; logo?: string | null } }>;
};

function footballSeasonStartYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  // European football seasons start in August
  return String(now.getMonth() >= 7 ? year : year - 1);
}

function basketballSeasonString(): string {
  const now = new Date();
  const year = now.getFullYear();
  // Basketball seasons start in October
  if (now.getMonth() >= 9) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function teamSlug(leagueSlug: string, name: string): string {
  return `${leagueSlug}-${slugify(name)}`;
}

function assertApiSportsKey(): string {
  if (!API_SPORTS_KEY) {
    throw new Error("API_SPORTS_KEY is required for API-Sports leagues");
  }
  return API_SPORTS_KEY;
}

function parseApiSportsErrors(
  provider: string,
  leagueId: string,
  data: ApiSportsResponse,
): void {
  const { errors } = data;
  if (!errors) return;

  const messages =
    typeof errors === "object" && !Array.isArray(errors)
      ? Object.values(errors)
      : errors;

  if (messages.length > 0) {
    throw new Error(`${provider} ${leagueId}: ${JSON.stringify(messages)}`);
  }
}

async function fetchFootballDataTeams(
  leagueSlug: string,
  externalId: string,
): Promise<SeedTeam[]> {
  if (!FOOTBALL_DATA_API_KEY) {
    throw new Error(
      "FOOTBALL_DATA_API_KEY is required for football-data.org leagues",
    );
  }

  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${externalId}/teams`,
    { headers: { "X-Auth-Token": FOOTBALL_DATA_API_KEY } },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `football-data.org ${externalId}: HTTP ${res.status} — ${body}`,
    );
  }

  const data = (await res.json()) as {
    teams?: Array<{
      name: string;
      shortName?: string | null;
      tla?: string | null;
      crest?: string | null;
    }>;
  };

  if (!Array.isArray(data.teams)) {
    throw new TypeError(
      `football-data.org ${externalId}: unexpected response (no teams array)`,
    );
  }

  return data.teams.map((t) => {
    const label = t.shortName ?? t.tla ?? t.name;
    return {
      name: t.name,
      slug: teamSlug(leagueSlug, label),
      logoUrl: t.crest ?? null,
    };
  });
}

async function fetchApiFootballTeams(
  leagueSlug: string,
  leagueId: string,
  season: string,
): Promise<SeedTeam[]> {
  const apiKey = assertApiSportsKey();

  const res = await fetch(
    `https://v3.football.api-sports.io/teams?league=${leagueId}&season=${season}`,
    { headers: { "x-apisports-key": apiKey } },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API-Football ${leagueId}: HTTP ${res.status} — ${body}`);
  }

  const data = (await res.json()) as ApiSportsResponse;
  parseApiSportsErrors("API-Football", leagueId, data);

  if (!Array.isArray(data.response)) {
    throw new TypeError(
      `API-Football ${leagueId}: unexpected response (no response array)`,
    );
  }

  return data.response.map(({ team }) => ({
    name: team.name,
    slug: teamSlug(leagueSlug, team.name),
    logoUrl: team.logo ?? null,
  }));
}

async function fetchApiBasketballTeams(
  leagueSlug: string,
  leagueId: string,
  season: string,
): Promise<SeedTeam[]> {
  const apiKey = assertApiSportsKey();

  const res = await fetch(
    `https://v1.basketball.api-sports.io/teams?league=${leagueId}&season=${season}`,
    { headers: { "x-apisports-key": apiKey } },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API-Basketball ${leagueId}: HTTP ${res.status} — ${body}`);
  }

  const data = (await res.json()) as ApiSportsResponse;
  parseApiSportsErrors("API-Basketball", leagueId, data);

  if (!Array.isArray(data.response)) {
    throw new TypeError(
      `API-Basketball ${leagueId}: unexpected response (no response array)`,
    );
  }
  console.log(data.response);
  return data.response.map(({ team }) => ({
    name: team.name,
    slug: teamSlug(leagueSlug, team.name),
    logoUrl: team.logo ?? null,
  }));
}

async function fetchSportsDbTeams(
  leagueSlug: string,
  searchName: string,
): Promise<SeedTeam[]> {
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${encodeURIComponent(searchName)}`,
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TheSportsDB ${searchName}: HTTP ${res.status} — ${body}`);
  }

  const data = (await res.json()) as {
    teams?: Array<{ strTeam?: string; strTeamBadge?: string | null }> | null;
  };

  if (!Array.isArray(data.teams)) {
    throw new TypeError(
      `TheSportsDB ${searchName}: unexpected response (no teams array)`,
    );
  }

  return data.teams
    .filter((t): t is { strTeam: string; strTeamBadge?: string | null } =>
      Boolean(t.strTeam),
    )
    .map((t) => ({
      name: t.strTeam,
      slug: teamSlug(leagueSlug, t.strTeam),
      logoUrl: t.strTeamBadge ?? null,
    }));
}

async function fetchTeamsForLeague(l: LeagueSeed): Promise<SeedTeam[]> {
  if (l.provider === "football-data") {
    return fetchFootballDataTeams(l.slug, l.externalId);
  }

  if (l.provider === "api-football") {
    if (!l.apiSportsSeason) {
      throw new Error(
        `API-Football league ${l.slug} is missing apiSportsSeason`,
      );
    }
    return fetchApiFootballTeams(l.slug, l.externalId, l.apiSportsSeason);
  }

  if (l.provider === "api-basketball") {
    if (!l.apiSportsSeason) {
      throw new Error(
        `API-Basketball league ${l.slug} is missing apiSportsSeason`,
      );
    }
    return fetchApiBasketballTeams(l.slug, l.externalId, l.apiSportsSeason);
  }

  if (!l.thesportsdbSearchName) {
    throw new Error(
      `TheSportsDB league ${l.slug} is missing thesportsdbSearchName`,
    );
  }

  return fetchSportsDbTeams(l.slug, l.thesportsdbSearchName);
}

export async function seed() {
  await seedUsers();

  console.log("Seeding leagues and teams...");

  for (const l of LEAGUE_SEEDS) {
    const [league] = await db
      .insert(leagues)
      .values({
        name: l.name,
        slug: l.slug,
        sport: l.sport,
        type: l.type ?? "league",
        displayOrder: l.displayOrder,
      })
      .onConflictDoUpdate({
        target: leagues.slug,
        set: { name: l.name, displayOrder: l.displayOrder },
      })
      .returning();

    console.log(`Fetching teams for ${l.name}...`);
    const leagueTeams = await fetchTeamsForLeague(l);

    for (const t of leagueTeams) {
      await db
        .insert(teams)
        .values({ ...t, leagueId: league.id })
        .onConflictDoUpdate({
          target: teams.slug,
          set: { name: t.name, logoUrl: t.logoUrl },
        });
    }

    console.log(`  ${leagueTeams.length} teams inserted`);

    // football-data.org free tier: 10 req/min
    if (l.provider === "football-data") {
      await new Promise((r) => setTimeout(r, 7000));
    }

    // API-Sports free tier: 10 req/min
    if (l.provider === "api-football" || l.provider === "api-basketball") {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log("Done!");
}

function isDirectExecution(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return import.meta.url === pathToFileURL(entry).href;
  } catch {
    return entry.endsWith("seed.ts");
  }
}

if (isDirectExecution()) {
  seed()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
