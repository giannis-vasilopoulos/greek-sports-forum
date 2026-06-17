import { db } from "@/db";
import { leagues } from "@/db/schema";

import { runSeedCli } from "./cli";

export const MOCK_LEAGUES = [
  {
    slug: "super-league",
    name: "Super League",
    sport: "football" as const,
    displayOrder: 1,
  },
  {
    slug: "champions-league",
    name: "Champions League",
    sport: "football" as const,
    displayOrder: 2,
  },
  {
    slug: "premier-league",
    name: "Premier League",
    sport: "football" as const,
    displayOrder: 3,
  },
  {
    slug: "euroleague",
    name: "Euroleague",
    sport: "basketball" as const,
    displayOrder: 4,
  },
  {
    slug: "nba",
    name: "NBA",
    sport: "basketball" as const,
    displayOrder: 5,
  },
];

export async function seedMockLeagues(): Promise<Map<string, number>> {
  console.log("Seeding mock leagues...");

  const leagueIds = new Map<string, number>();

  for (const league of MOCK_LEAGUES) {
    const [row] = await db
      .insert(leagues)
      .values(league)
      .onConflictDoUpdate({
        target: leagues.slug,
        set: { name: league.name, displayOrder: league.displayOrder },
      })
      .returning();

    leagueIds.set(league.slug, row.id);
  }

  return leagueIds;
}

runSeedCli(import.meta.url, seedMockLeagues);
