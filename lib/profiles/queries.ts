import { eq, notInArray } from "drizzle-orm";

import { db } from "@/db";
import { fanProfiles, leagues } from "@/db/schema";
import type { FanProfile } from "@/components/layout/site-data";
import { getLeagueEmoji } from "@/lib/leagues/constants";
import type { LeagueOption } from "@/lib/leagues/queries";
import { runDbOrThrow } from "@/lib/db/run";

import { getActiveFanProfileIdFromCookie } from "./active-profile-cookie";
import type { FanProfileDetail } from "./types";

function mapFanProfileRow(
  row: Awaited<ReturnType<typeof fetchFanProfileRows>>[number],
): FanProfile {
  return {
    id: row.id,
    leagueName: row.league.name,
    teamName: row.favoriteTeam?.name ?? row.displayName,
    teamEmoji: getLeagueEmoji(row.league.slug, row.league.sport),
    teamLogoUrl: row.favoriteTeam?.logoUrl ?? null,
  };
}

function mapFanProfileDetailRow(
  row: Awaited<ReturnType<typeof fetchFanProfileRows>>[number],
  activeId: number | undefined,
): FanProfileDetail {
  return {
    id: row.id,
    leagueId: row.leagueId,
    leagueName: row.league.name,
    leagueSlug: row.league.slug,
    displayName: row.displayName,
    teamName: row.favoriteTeam?.name ?? row.displayName,
    teamEmoji: getLeagueEmoji(row.league.slug, row.league.sport),
    teamLogoUrl: row.favoriteTeam?.logoUrl ?? null,
    isActive: row.id === activeId,
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

async function resolveActiveProfileId(
  rows: Awaited<ReturnType<typeof fetchFanProfileRows>>,
): Promise<number | undefined> {
  if (rows.length === 0) return undefined;

  const cookieId = await getActiveFanProfileIdFromCookie();
  const activeRow =
    (cookieId ? rows.find((row) => row.id === cookieId) : undefined) ?? rows[0];

  return activeRow.id;
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

    const activeId = await resolveActiveProfileId(rows);
    const activeRow = rows.find((row) => row.id === activeId) ?? rows[0];

    return mapFanProfileRow(activeRow);
  });
}

export async function getFanProfileDetailsForUser(
  userId: string,
): Promise<FanProfileDetail[]> {
  return runDbOrThrow(async () => {
    const rows = await fetchFanProfileRows(userId);
    const activeId = await resolveActiveProfileId(rows);

    return rows.map((row) => mapFanProfileDetailRow(row, activeId));
  });
}

export async function getLeaguesWithoutProfileForUser(
  userId: string,
): Promise<LeagueOption[]> {
  return runDbOrThrow(async () => {
    const existingProfiles = await db.query.fanProfiles.findMany({
      where: eq(fanProfiles.userId, userId),
      columns: { leagueId: true },
    });

    const usedLeagueIds = existingProfiles.map((profile) => profile.leagueId);

    const rows = await db.query.leagues.findMany({
      where:
        usedLeagueIds.length > 0
          ? notInArray(leagues.id, usedLeagueIds)
          : undefined,
      orderBy: (l, { asc }) => asc(l.displayOrder),
      columns: { id: true, slug: true, name: true, logoUrl: true, sport: true },
    });

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      logoUrl: row.logoUrl,
      emoji: getLeagueEmoji(row.slug, row.sport),
    }));
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

export async function getTeamsForLeagues(leagueIds: number[]) {
  if (leagueIds.length === 0) return [];

  return runDbOrThrow(() =>
    db.query.teams.findMany({
      where: (t, { inArray: inArrayFn }) => inArrayFn(t.leagueId, leagueIds),
      orderBy: (t, { asc }) => asc(t.name),
    }),
  );
}
