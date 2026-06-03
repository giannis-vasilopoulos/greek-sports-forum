import { asc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { leagues, standingRows } from "@/db/schema";
import type { StandingRow } from "@/components/feed/feed-data";
import {
  DEFERRED_STANDINGS_SLUGS,
  STANDINGS_UI_SLUGS,
  isStandingsDeferred,
  isStandingsExcluded,
} from "@/lib/leagues/sources";
import { getLeagueEmoji } from "@/lib/leagues/constants";
import { DbError, getPgError } from "@/lib/db/errors";
import { runDbOrThrow } from "@/lib/db/run";

const PG_UNDEFINED_TABLE = "42P01";

function isMissingStandingsTable(error: unknown): boolean {
  if (!(error instanceof DbError)) return false;
  return getPgError(error.cause)?.code === PG_UNDEFINED_TABLE;
}

export interface StandingsTableRow extends StandingRow {
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
}

export interface StandingsLeagueOption {
  slug: string;
  name: string;
  emoji: string;
  deferred: boolean;
}

function mapStandingRow(
  row: typeof standingRows.$inferSelect,
): StandingsTableRow {
  return {
    rank: row.rank,
    team: row.teamName,
    points: row.points,
    played: row.played ?? undefined,
    won: row.won ?? undefined,
    drawn: row.drawn ?? undefined,
    lost: row.lost ?? undefined,
    goalsFor: row.goalsFor ?? undefined,
    goalsAgainst: row.goalsAgainst ?? undefined,
  };
}

export async function getStandingsLeagueOptions(): Promise<
  StandingsLeagueOption[]
> {
  return runDbOrThrow(async () => {
    const rows = await db.query.leagues.findMany({
      where: inArray(leagues.slug, [...STANDINGS_UI_SLUGS]),
      orderBy: asc(leagues.displayOrder),
      columns: { slug: true, name: true, sport: true },
    });

    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      emoji: getLeagueEmoji(row.slug, row.sport),
      deferred: isStandingsDeferred(row.slug),
    }));
  });
}

export async function getStandingsByLeagueSlug(
  slug: string,
): Promise<StandingsTableRow[]> {
  if (isStandingsDeferred(slug) || isStandingsExcluded(slug)) {
    return [];
  }

  try {
    return await runDbOrThrow(async () => {
      const league = await db.query.leagues.findFirst({
        where: eq(leagues.slug, slug),
        columns: { id: true },
      });

      if (!league) return [];

      const rows = await db.query.standingRows.findMany({
        where: eq(standingRows.leagueId, league.id),
        orderBy: asc(standingRows.rank),
      });

      return rows.map(mapStandingRow);
    });
  } catch (error) {
    if (isMissingStandingsTable(error)) return [];
    throw error;
  }
}

export async function getSidebarStandings(
  slug = "super-league",
  limit = 5,
): Promise<StandingRow[]> {
  const rows = await getStandingsByLeagueSlug(slug);
  return rows.slice(0, limit);
}

export function isDeferredStandingsSlug(slug: string): boolean {
  return isStandingsDeferred(slug);
}

export { DEFERRED_STANDINGS_SLUGS };
