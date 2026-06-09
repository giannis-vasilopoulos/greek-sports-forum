import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { leagues, teams } from "@/db/schema";
import { runDbOrThrow } from "@/lib/db/run";

export function teamUrlSlug(dbSlug: string, leagueSlug: string): string {
  const prefix = `${leagueSlug}-`;
  return dbSlug.startsWith(prefix) ? dbSlug.slice(prefix.length) : dbSlug;
}

export async function getTeamByLeagueAndUrlSlug(
  leagueSlug: string,
  urlTeamSlug: string,
) {
  return runDbOrThrow(async () => {
    const league = await db.query.leagues.findFirst({
      where: eq(leagues.slug, leagueSlug),
      columns: { id: true, slug: true, name: true },
    });

    if (!league) return null;

    const dbSlug = `${leagueSlug}-${urlTeamSlug}`;

    const team = await db.query.teams.findFirst({
      where: and(eq(teams.leagueId, league.id), eq(teams.slug, dbSlug)),
    });

    return team ? { team, league } : null;
  });
}

export async function getTeamsForLeagueSlug(leagueSlug: string) {
  return runDbOrThrow(async () => {
    const league = await db.query.leagues.findFirst({
      where: eq(leagues.slug, leagueSlug),
      columns: { id: true },
    });

    if (!league) return [];

    return db.query.teams.findMany({
      where: eq(teams.leagueId, league.id),
      columns: { id: true, slug: true, name: true, logoUrl: true },
      orderBy: (t, { asc }) => asc(t.name),
    });
  });
}
