import { eq } from "drizzle-orm";

import { db } from "@/db";
import { leagues, teams } from "@/db/schema";

import { runSeedCli } from "./cli";

export const MOCK_TEAMS: Record<
  string,
  Array<{ slug: string; name: string }>
> = {
  "super-league": [
    { slug: "panathinaikos", name: "Παναθηναϊκός" },
    { slug: "olympiakos", name: "Ολυμπιακός" },
    { slug: "aek", name: "ΑΕΚ" },
    { slug: "paok", name: "ΠΑΟΚ" },
  ],
  "premier-league": [
    { slug: "arsenal", name: "Arsenal" },
    { slug: "chelsea", name: "Chelsea" },
  ],
  "champions-league": [
    { slug: "real-madrid", name: "Real Madrid" },
    { slug: "barcelona", name: "Barcelona" },
  ],
  euroleague: [
    { slug: "olympiakos-bc", name: "Ολυμπιακός" },
    { slug: "panathinaikos-bc", name: "Παναθηναϊκός" },
  ],
  nba: [
    { slug: "lakers", name: "Lakers" },
    { slug: "celtics", name: "Celtics" },
  ],
};

async function resolveLeagueIds(
  leagueIds?: Map<string, number>,
): Promise<Map<string, number>> {
  if (leagueIds) return leagueIds;

  const resolved = new Map<string, number>();

  for (const leagueSlug of Object.keys(MOCK_TEAMS)) {
    const league = await db.query.leagues.findFirst({
      where: eq(leagues.slug, leagueSlug),
      columns: { id: true },
    });

    if (league) {
      resolved.set(leagueSlug, league.id);
    }
  }

  return resolved;
}

export async function seedMockTeams(leagueIds?: Map<string, number>) {
  console.log("Seeding mock teams...");

  const resolvedLeagueIds = await resolveLeagueIds(leagueIds);

  for (const [leagueSlug, leagueTeams] of Object.entries(MOCK_TEAMS)) {
    const leagueId = resolvedLeagueIds.get(leagueSlug);
    if (!leagueId) continue;

    for (const team of leagueTeams) {
      await db
        .insert(teams)
        .values({ ...team, leagueId })
        .onConflictDoUpdate({
          target: teams.slug,
          set: { name: team.name, leagueId },
        });
    }
  }
}

runSeedCli(import.meta.url, seedMockTeams);
