import "dotenv/config";
import { pathToFileURL } from "node:url";
import { db } from "./index";
import { leagues, teams } from "./schema";
import { seedUsers } from "./seed/users";

type LeagueSeed = {
  slug: string;
  name: string;
  displayOrder: number;
  provider: "football-data" | "thesportsdb";
  externalId: string;
  sport: "football" | "basketball";
  type?: "league" | "tournament";
};

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY;

const LEAGUE_SEEDS: LeagueSeed[] = [
  {
    slug: "super-league",
    name: "Super League",
    displayOrder: 1,
    provider: "football-data",
    externalId: "318",
    sport: "football",
  },
  {
    slug: "super-league-2",
    name: "Super League 2",
    displayOrder: 2,
    provider: "thesportsdb",
    externalId: "4640",
    sport: "football",
  },
  {
    slug: "champions-league",
    name: "Champions League",
    displayOrder: 3,
    provider: "football-data",
    externalId: "2001",
    sport: "football",
  },
  {
    slug: "premier-league",
    name: "Premier League",
    displayOrder: 4,
    provider: "football-data",
    externalId: "2021",
    sport: "football",
  },
  {
    slug: "la-liga",
    name: "La Liga",
    displayOrder: 5,
    provider: "football-data",
    externalId: "2014",
    sport: "football",
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    displayOrder: 6,
    provider: "football-data",
    externalId: "2002",
    sport: "football",
  },
  {
    slug: "serie-a",
    name: "Serie A",
    displayOrder: 7,
    provider: "football-data",
    externalId: "2019",
    sport: "football",
  },
  {
    slug: "euroleague",
    name: "Euroleague",
    displayOrder: 8,
    provider: "thesportsdb",
    externalId: "4546",
    sport: "basketball",
  },
  {
    slug: "nba",
    name: "NBA",
    displayOrder: 9,
    provider: "thesportsdb",
    externalId: "4387",
    sport: "basketball",
  },
  {
    slug: "basket-league",
    name: "Basket League",
    displayOrder: 10,
    provider: "thesportsdb",
    externalId: "4452",
    sport: "basketball",
  },
  {
    slug: "world-cup",
    name: "Παγκόσμιο Κύπελλο",
    displayOrder: 11,
    provider: "football-data",
    externalId: "2000",
    sport: "football",
    type: "tournament",
  },
  {
    slug: "euro",
    name: "Euro",
    displayOrder: 12,
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

async function fetchSportsDbTeams(
  leagueSlug: string,
  externalId: string,
): Promise<SeedTeam[]> {
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/lookup_all_teams.php?id=${externalId}`,
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TheSportsDB ${externalId}: HTTP ${res.status} — ${body}`);
  }

  const data = (await res.json()) as {
    teams?: Array<{ strTeam?: string; strTeamBadge?: string | null }> | null;
  };

  if (!Array.isArray(data.teams)) {
    throw new TypeError(
      `TheSportsDB ${externalId}: unexpected response (no teams array)`,
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
  return fetchSportsDbTeams(l.slug, l.externalId);
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
        set: { name: l.name },
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
