import { asc, inArray } from "drizzle-orm";

import { db } from "@/db";
import { leagues } from "@/db/schema";
import type { FeedLeague } from "@/components/feed/feed-data";
import { getLeagueEmoji, NAV_LEAGUE_SLUGS } from "@/lib/leagues/constants";
import { runDbOrThrow } from "@/lib/db/run";

function mapLeagueRow(row: typeof leagues.$inferSelect): FeedLeague {
  return {
    slug: row.slug,
    name: row.name,
    emoji: getLeagueEmoji(row.slug, row.sport),
  };
}

export async function getLeaguesForNav(): Promise<FeedLeague[]> {
  return runDbOrThrow(async () => {
    const rows = await db.query.leagues.findMany({
      where: inArray(leagues.slug, [...NAV_LEAGUE_SLUGS]),
      orderBy: asc(leagues.displayOrder),
    });

    return rows.map(mapLeagueRow);
  });
}

export async function getFeedLeagues(): Promise<FeedLeague[]> {
  return runDbOrThrow(async () => {
    const rows = await db.query.leagues.findMany({
      where: inArray(leagues.slug, [...NAV_LEAGUE_SLUGS]),
      orderBy: asc(leagues.displayOrder),
    });

    return rows.map(mapLeagueRow);
  });
}

export async function getLeagueBySlug(slug: string) {
  return runDbOrThrow(() =>
    db.query.leagues.findFirst({
      where: (l, { eq }) => eq(l.slug, slug),
    }),
  );
}

export async function getLeagueOptionsForNav() {
  return runDbOrThrow(async () => {
    const rows = await db.query.leagues.findMany({
      where: inArray(leagues.slug, [...NAV_LEAGUE_SLUGS]),
      orderBy: asc(leagues.displayOrder),
      columns: { id: true, slug: true, name: true },
    });

    return rows;
  });
}
