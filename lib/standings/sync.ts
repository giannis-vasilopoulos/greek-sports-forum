import { eq } from "drizzle-orm";

import { db } from "@/db";
import { leagues, standingRows, teams } from "@/db/schema";
import {
  footballSeasonString,
  getStandingsSyncSources,
} from "@/lib/leagues/sources";
import { fetchFootballDataStandings } from "@/lib/standings/providers/football-data";
import { fetchTheSportsDbStandings } from "@/lib/standings/providers/thesportsdb";
import { findTeamIdByName } from "@/lib/standings/team-match";
import type { NormalizedStandingRow } from "@/lib/standings/types";

const FOOTBALL_DATA_DELAY_MS = 7000;

export type StandingsSyncResult = {
  ok: boolean;
  synced: string[];
  failed: Array<{ slug: string; error: string }>;
};

async function fetchRowsForSource(
  source: ReturnType<typeof getStandingsSyncSources>[number],
): Promise<NormalizedStandingRow[]> {
  if (source.provider === "football-data") {
    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    if (!apiKey) {
      throw new Error(
        "FOOTBALL_DATA_API_KEY is required for football-data standings",
      );
    }
    return fetchFootballDataStandings(source.externalId, apiKey);
  }

  return fetchTheSportsDbStandings(source.externalId, footballSeasonString());
}

async function upsertStandingsForLeague(
  leagueId: number,
  rows: NormalizedStandingRow[],
): Promise<void> {
  if (rows.length === 0) return;

  const season = rows[0]!.season;
  const leagueTeams = await db
    .select({ id: teams.id, name: teams.name })
    .from(teams)
    .where(eq(teams.leagueId, leagueId));

  await db.delete(standingRows).where(eq(standingRows.leagueId, leagueId));

  const now = new Date();

  for (const row of rows) {
    await db.insert(standingRows).values({
      leagueId,
      teamId: findTeamIdByName(row.teamName, leagueTeams),
      teamName: row.teamName,
      season,
      rank: row.rank,
      points: row.points,
      played: row.played ?? null,
      won: row.won ?? null,
      drawn: row.drawn ?? null,
      lost: row.lost ?? null,
      goalsFor: row.goalsFor ?? null,
      goalsAgainst: row.goalsAgainst ?? null,
      syncedAt: now,
    });
  }
}

export async function syncStandings(): Promise<StandingsSyncResult> {
  const synced: string[] = [];
  const failed: Array<{ slug: string; error: string }> = [];
  const sources = getStandingsSyncSources();

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]!;
    try {
      const league = await db.query.leagues.findFirst({
        where: eq(leagues.slug, source.slug),
        columns: { id: true },
      });

      if (!league) {
        throw new Error(`League not found in DB: ${source.slug}`);
      }

      const rows = await fetchRowsForSource(source);
      await upsertStandingsForLeague(league.id, rows);
      synced.push(source.slug);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown sync error";
      failed.push({ slug: source.slug, error: message });
    }

    if (source.provider === "football-data" && i < sources.length - 1) {
      await new Promise((r) => setTimeout(r, FOOTBALL_DATA_DELAY_MS));
    }
  }

  return { ok: failed.length === 0, synced, failed };
}
