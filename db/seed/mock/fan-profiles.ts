import { eq } from "drizzle-orm";

import { db } from "@/db";
import { fanProfiles, leagues, user } from "@/db/schema";

import { runSeedCli } from "./cli";
import { MOCK_TEAMS } from "./teams";
import { MOCK_THREADS } from "./threads";

export async function upsertMockFanProfile(input: {
  userId: string;
  leagueId: number;
  displayName: string;
  favoriteTeamId: number;
}) {
  const [profile] = await db
    .insert(fanProfiles)
    .values({
      userId: input.userId,
      leagueId: input.leagueId,
      favoriteTeamId: input.favoriteTeamId,
      displayName: input.displayName,
    })
    .onConflictDoUpdate({
      target: [fanProfiles.userId, fanProfiles.leagueId],
      set: {
        displayName: input.displayName,
        favoriteTeamId: input.favoriteTeamId,
      },
    })
    .returning();

  return profile;
}

async function resolveLeagueIds(
  leagueIds?: Map<string, number>,
): Promise<Map<string, number>> {
  if (leagueIds) return leagueIds;

  const resolved = new Map<string, number>();
  const slugs = [...new Set(MOCK_THREADS.map((thread) => thread.leagueSlug))];

  for (const leagueSlug of slugs) {
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

export async function seedMockFanProfiles(options?: {
  leagueIds?: Map<string, number>;
}): Promise<Map<string, number>> {
  console.log("Seeding mock fan profiles...");

  const profileByLeague = new Map<string, number>();
  const leagueIds = await resolveLeagueIds(options?.leagueIds);

  const testUser = await db.query.user.findFirst({
    where: eq(user.username, "testuser"),
  });

  if (!testUser) {
    console.warn("  testuser not found — skipping fan profiles");
    return profileByLeague;
  }

  const teamIdsByLeagueSlug = new Map<string, number>();

  for (const [leagueSlug, leagueTeams] of Object.entries(MOCK_TEAMS)) {
    const leagueId = leagueIds.get(leagueSlug);
    if (!leagueId || leagueTeams.length === 0) continue;

    const firstTeam = await db.query.teams.findFirst({
      where: (t, { and, eq: eqFn }) =>
        and(eqFn(t.leagueId, leagueId), eqFn(t.slug, leagueTeams[0].slug)),
      columns: { id: true },
    });

    if (firstTeam) {
      teamIdsByLeagueSlug.set(leagueSlug, firstTeam.id);
    }
  }

  for (const leagueSlug of new Set(
    MOCK_THREADS.map((thread) => thread.leagueSlug),
  )) {
    const leagueId = leagueIds.get(leagueSlug);
    const favoriteTeamId = teamIdsByLeagueSlug.get(leagueSlug);
    if (!leagueId || !favoriteTeamId) continue;

    const profile = await upsertMockFanProfile({
      userId: testUser.id,
      leagueId,
      displayName: "GreenEagle_Pao",
      favoriteTeamId,
    });

    profileByLeague.set(leagueSlug, profile.id);
  }

  return profileByLeague;
}

runSeedCli(import.meta.url, seedMockFanProfiles);
