import { and, desc, eq, inArray, isNull, or } from "drizzle-orm";

import { db } from "@/db";
import { leagues, teams, transferRows } from "@/db/schema";
import { DbError, getPgError } from "@/lib/db/errors";
import { runDbOrThrow } from "@/lib/db/run";
import { isTransferExcluded, isTransfersDeferred } from "@/lib/leagues/sources";
import { teamNamesMatch } from "@/lib/standings/team-match";
import { getTeamByLeagueAndUrlSlug, teamUrlSlug } from "@/lib/teams/queries";

const PG_UNDEFINED_TABLE = "42P01";

function isMissingTransfersTable(error: unknown): boolean {
  if (!(error instanceof DbError)) return false;
  return getPgError(error.cause)?.code === PG_UNDEFINED_TABLE;
}

export type TransferDirection = "in" | "out";

export interface TransfersTableRow {
  playerName: string;
  fromTeamName: string;
  toTeamName: string;
  transferDate: string;
  feeText: string | null;
  fromTeamLogoUrl?: string | null;
  toTeamLogoUrl?: string | null;
  leagueSlug?: string;
  fromTeamUrlSlug?: string | null;
  toTeamUrlSlug?: string | null;
  direction?: TransferDirection;
}

type TeamRelation = {
  slug: string;
  logoUrl: string | null;
} | null;

type TransferRowWithTeams = typeof transferRows.$inferSelect & {
  fromTeam?: TeamRelation;
  toTeam?: TeamRelation;
};

function mapTransferRow(
  row: TransferRowWithTeams,
  leagueSlug: string,
  teamContext?: { id: number; name: string },
): TransfersTableRow {
  const fromTeamUrlSlug = row.fromTeam
    ? teamUrlSlug(row.fromTeam.slug, leagueSlug)
    : null;
  const toTeamUrlSlug = row.toTeam
    ? teamUrlSlug(row.toTeam.slug, leagueSlug)
    : null;

  let direction: TransferDirection | undefined;
  if (teamContext) {
    if (row.toTeamId === teamContext.id) {
      direction = "in";
    } else if (row.fromTeamId === teamContext.id) {
      direction = "out";
    } else if (
      row.toTeamId === null &&
      teamNamesMatch(row.toTeamName, teamContext.name)
    ) {
      direction = "in";
    } else if (
      row.fromTeamId === null &&
      teamNamesMatch(row.fromTeamName, teamContext.name)
    ) {
      direction = "out";
    }
  }

  return {
    playerName: row.playerName,
    fromTeamName: row.fromTeamName,
    toTeamName: row.toTeamName,
    transferDate: row.transferDate,
    feeText: row.feeText,
    fromTeamLogoUrl: row.fromTeam?.logoUrl ?? null,
    toTeamLogoUrl: row.toTeam?.logoUrl ?? null,
    leagueSlug,
    fromTeamUrlSlug,
    toTeamUrlSlug,
    direction,
  };
}

const teamRelations = {
  fromTeam: { columns: { slug: true, logoUrl: true } },
  toTeam: { columns: { slug: true, logoUrl: true } },
} as const;

function rowInvolvesTeamByName(
  row: TransferRowWithTeams,
  teamName: string,
): boolean {
  return (
    (row.fromTeamId === null && teamNamesMatch(row.fromTeamName, teamName)) ||
    (row.toTeamId === null && teamNamesMatch(row.toTeamName, teamName))
  );
}

export async function getTransfersByTeamSlug(
  leagueSlug: string,
  urlTeamSlug: string,
): Promise<TransfersTableRow[]> {
  if (isTransfersDeferred(leagueSlug) || isTransferExcluded(leagueSlug)) {
    return [];
  }

  try {
    return await runDbOrThrow(async () => {
      const resolved = await getTeamByLeagueAndUrlSlug(leagueSlug, urlTeamSlug);
      if (!resolved) return [];

      const { team } = resolved;

      const byId = await db.query.transferRows.findMany({
        where: and(
          eq(transferRows.leagueId, team.leagueId),
          or(
            eq(transferRows.fromTeamId, team.id),
            eq(transferRows.toTeamId, team.id),
          ),
        ),
        orderBy: desc(transferRows.transferDate),
        with: teamRelations,
      });

      const byIdKeys = new Set(byId.map((row) => row.id));

      const nameFallbackCandidates = await db.query.transferRows.findMany({
        where: and(
          eq(transferRows.leagueId, team.leagueId),
          or(isNull(transferRows.fromTeamId), isNull(transferRows.toTeamId)),
        ),
        orderBy: desc(transferRows.transferDate),
        with: teamRelations,
      });

      const byName = nameFallbackCandidates.filter(
        (row) => !byIdKeys.has(row.id) && rowInvolvesTeamByName(row, team.name),
      );

      return [...byId, ...byName].map((row) =>
        mapTransferRow(row, leagueSlug, team),
      );
    });
  } catch (error) {
    if (isMissingTransfersTable(error)) return [];
    throw error;
  }
}

export async function getTeamsWithTransfersForSitemap(
  leagueSlugs: readonly string[],
): Promise<Array<{ leagueSlug: string; teamUrlSlug: string }>> {
  return runDbOrThrow(async () => {
    const leagueRows = await db.query.leagues.findMany({
      where: inArray(leagues.slug, [...leagueSlugs]),
      columns: { id: true, slug: true },
    });

    const entries: Array<{ leagueSlug: string; teamUrlSlug: string }> = [];

    for (const league of leagueRows) {
      const leagueTeams = await db.query.teams.findMany({
        where: eq(teams.leagueId, league.id),
        columns: { slug: true },
      });

      for (const team of leagueTeams) {
        entries.push({
          leagueSlug: league.slug,
          teamUrlSlug: teamUrlSlug(team.slug, league.slug),
        });
      }
    }

    return entries;
  });
}
