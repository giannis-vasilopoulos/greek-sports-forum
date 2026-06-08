import { eq } from "drizzle-orm";

import { db } from "@/db";
import { fanProfiles } from "@/db/schema";
import type { FanProfile } from "@/components/layout/site-data";
import { getLeagueEmoji } from "@/lib/leagues/constants";
import { runDbOrThrow } from "@/lib/db/run";

import { getActiveFanProfileIdFromCookie } from "./active-profile-cookie";

function mapFanProfileRow(
  row: Awaited<ReturnType<typeof fetchFanProfileRows>>[number],
): FanProfile {
  return {
    leagueName: row.league.name,
    teamName: row.favoriteTeam?.name ?? row.displayName,
    teamEmoji: getLeagueEmoji(row.league.slug, row.league.sport),
    teamLogoUrl: row.favoriteTeam?.logoUrl ?? null,
  };
}

async function fetchFanProfileRows(userId: string) {
  return db.query.fanProfiles.findMany({
    where: eq(fanProfiles.userId, userId),
    with: {
      league: true,
      favoriteTeam: true,
    },
  });
}

export async function getFanProfilesForUser(
  userId: string,
): Promise<FanProfile[]> {
  return runDbOrThrow(async () => {
    const rows = await fetchFanProfileRows(userId);
    return rows.map(mapFanProfileRow);
  });
}

export async function getActiveFanProfileForUser(
  userId: string,
): Promise<FanProfile | undefined> {
  return runDbOrThrow(async () => {
    const rows = await fetchFanProfileRows(userId);
    if (rows.length === 0) return undefined;

    const cookieId = await getActiveFanProfileIdFromCookie();
    const activeRow =
      (cookieId ? rows.find((row) => row.id === cookieId) : undefined) ??
      rows[0];

    return mapFanProfileRow(activeRow);
  });
}

export async function userHasFanProfiles(userId: string): Promise<boolean> {
  return runDbOrThrow(async () => {
    const row = await db.query.fanProfiles.findFirst({
      where: eq(fanProfiles.userId, userId),
      columns: { id: true },
    });
    return row !== undefined;
  });
}

export async function getTeamsForLeague(leagueId: number) {
  return runDbOrThrow(() =>
    db.query.teams.findMany({
      where: (t, { eq }) => eq(t.leagueId, leagueId),
      orderBy: (t, { asc }) => asc(t.name),
    }),
  );
}
