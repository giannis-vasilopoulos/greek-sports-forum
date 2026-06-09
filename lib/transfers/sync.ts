import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { leagues, teams, transferRows } from "@/db/schema";
import { getTransfersSyncSources } from "@/lib/leagues/sources";
import { fetchApiFootballTransfersForLeague } from "@/lib/transfers/providers/api-football";
import { findTeamIdByName } from "@/lib/standings/team-match";
import type { NormalizedTransferRow } from "@/lib/transfers/types";

export type TransfersSyncResult = {
  ok: boolean;
  synced: string[];
  failed: Array<{ slug: string; error: string }>;
};

async function upsertTransfersForLeague(
  leagueId: number,
  rows: NormalizedTransferRow[],
): Promise<void> {
  if (rows.length === 0) return;

  const season = rows[0]!.season;
  const leagueTeams = await db
    .select({ id: teams.id, name: teams.name })
    .from(teams)
    .where(eq(teams.leagueId, leagueId));

  await db
    .delete(transferRows)
    .where(
      and(eq(transferRows.leagueId, leagueId), eq(transferRows.season, season)),
    );

  const now = new Date();

  for (const row of rows) {
    await db.insert(transferRows).values({
      leagueId,
      playerName: row.playerName,
      fromTeamId: findTeamIdByName(row.fromTeamName, leagueTeams),
      toTeamId: findTeamIdByName(row.toTeamName, leagueTeams),
      fromTeamName: row.fromTeamName,
      toTeamName: row.toTeamName,
      transferDate: row.transferDate,
      feeText: row.feeText,
      season,
      syncedAt: now,
    });
  }
}

export async function syncTransfers(): Promise<TransfersSyncResult> {
  const apiKey = process.env.API_SPORTS_KEY;
  if (!apiKey) {
    throw new Error("API_SPORTS_KEY is required for transfer sync");
  }

  const synced: string[] = [];
  const failed: Array<{ slug: string; error: string }> = [];
  const sources = getTransfersSyncSources();

  for (const source of sources) {
    try {
      const league = await db.query.leagues.findFirst({
        where: eq(leagues.slug, source.slug),
        columns: { id: true },
      });

      if (!league) {
        throw new Error(`League not found in DB: ${source.slug}`);
      }

      const rows = await fetchApiFootballTransfersForLeague(
        source.externalId,
        apiKey,
      );

      await upsertTransfersForLeague(league.id, rows);
      synced.push(source.slug);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown sync error";
      failed.push({ slug: source.slug, error: message });
    }
  }

  return { ok: failed.length === 0, synced, failed };
}
