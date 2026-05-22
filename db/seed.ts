// src/db/seed.ts
import { eq } from "drizzle-orm";
import { db } from "./index";
import { leagues, teams } from "./schema";

const FOOTBALL_API_KEY = process.env.FOOTBALL_DATA_API_KEY!;

// Leagues που θέλουμε με τα αντίστοιχα IDs
const FOOTBALL_LEAGUES = [
  {
    externalId: 318,
    slug: "super-league",
    name: "Super League",
    displayOrder: 1,
  },
  {
    externalId: 2001,
    slug: "champions-league",
    name: "Champions League",
    displayOrder: 3,
  },
  {
    externalId: 2021,
    slug: "premier-league",
    name: "Premier League",
    displayOrder: 4,
  },
  { externalId: 2014, slug: "la-liga", name: "La Liga", displayOrder: 5 },
  { externalId: 2002, slug: "bundesliga", name: "Bundesliga", displayOrder: 6 },
  { externalId: 2019, slug: "serie-a", name: "Serie A", displayOrder: 7 },
];

const SPORTSDB_LEAGUES = [
  {
    externalId: "4640",
    slug: "super-league-2",
    name: "Super League 2 (Β' Εθνική)",
    displayOrder: 2,
  },
  {
    externalId: "117",
    slug: "euroleague",
    name: "Euroleague",
    displayOrder: 8,
  },
  { externalId: "4387", slug: "nba", name: "NBA", displayOrder: 9 },
  {
    externalId: "4966",
    slug: "basket-league",
    name: "Basket League",
    displayOrder: 10,
  },
];

// Tournaments — ξεχωριστή κατηγορία
const TOURNAMENT_LEAGUES = [
  {
    externalId: 2000,
    slug: "world-cup",
    name: "Παγκόσμιο Κύπελλο",
    displayOrder: 11,
  },
  { externalId: 2018, slug: "euro", name: "Euro", displayOrder: 12 },
];
async function fetchFootballTeams(leagueExternalId: number) {
  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${leagueExternalId}/teams`,
    { headers: { "X-Auth-Token": FOOTBALL_API_KEY } },
  );
  const data = await res.json();
  return data.teams.map((t: any) => ({
    name: t.name,
    slug: t.shortName.toLowerCase().replace(/\s+/g, "-"),
    logoUrl: t.crest,
  }));
}

async function fetchBasketballTeams(leagueExternalId: string) {
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/lookup_all_teams.php?id=${leagueExternalId}`,
  );
  const data = await res.json();
  return (data.teams ?? []).map((t: any) => ({
    name: t.strTeam,
    slug: t.strTeam.toLowerCase().replace(/\s+/g, "-"),
    logoUrl: t.strTeamBadge,
  }));
}

export async function seed() {
  console.log("Seeding leagues and teams...");

  // --- Football leagues ---
  for (const l of FOOTBALL_LEAGUES) {
    const [league] = await db
      .insert(leagues)
      .values({
        name: l.name,
        slug: l.slug,
        sport: "football",
        displayOrder: l.displayOrder,
      })
      .onConflictDoUpdate({
        target: leagues.slug,
        set: { name: l.name },
      })
      .returning();

    console.log(`Fetching teams for ${l.name}...`);
    const leagueTeams = await fetchFootballTeams(l.externalId);

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
    // Rate limit: 10 req/min → περιμένουμε λίγο
    await new Promise((r) => setTimeout(r, 7000));
  }

  // --- Basketball leagues ---
  for (const l of SPORTSDB_LEAGUES) {
    const [league] = await db
      .insert(leagues)
      .values({
        name: l.name,
        slug: l.slug,
        sport: "basketball",
        displayOrder: l.displayOrder,
      })
      .onConflictDoUpdate({
        target: leagues.slug,
        set: { name: l.name },
      })
      .returning();

    console.log(`Fetching teams for ${l.name}...`);
    const leagueTeams = await fetchBasketballTeams(l.externalId);

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
    // Rate limit: 10 req/min → περιμένουμε λίγο
    await new Promise((r) => setTimeout(r, 7000));
  }

  // --- Tournament leagues ---
  for (const l of TOURNAMENT_LEAGUES) {
    const [league] = await db
      .insert(leagues)
      .values({
        name: l.name,
        slug: l.slug,
        sport: "football",
        type: "tournament",
        displayOrder: l.displayOrder,
      })
      .onConflictDoUpdate({
        target: leagues.slug,
        set: { name: l.name },
      })
      .returning();

    console.log(`Fetching teams for ${l.name}...`);
    const TournamentTeams = await fetchFootballTeams(l.externalId);

    for (const t of TournamentTeams) {
      await db
        .insert(teams)
        .values({ ...t, leagueId: league.id })
        .onConflictDoUpdate({
          target: teams.slug,
          set: { name: t.name, logoUrl: t.logoUrl },
        });
    }

    console.log(`  ${TournamentTeams.length} teams inserted`);
    // Rate limit: 10 req/min → περιμένουμε λίγο
    await new Promise((r) => setTimeout(r, 7000));
  }

  console.log("Done!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
