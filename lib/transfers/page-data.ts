import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { fanProfiles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import { getLeagueBySlug, getLeagueTabOptions } from "@/lib/leagues/queries";
import {
  isTransferExcluded,
  isTransferUiSlug,
  isTransfersDeferred,
  TRANSFER_UI_SLUGS,
} from "@/lib/leagues/sources";
import { runDbOrThrow } from "@/lib/db/run";
import {
  getTeamByLeagueAndUrlSlug,
  getTeamsForLeagueSlug,
  teamUrlSlug,
} from "@/lib/teams/queries";
import { getTransfersByTeamSlug } from "@/lib/transfers/queries";

export const DEFAULT_TRANSFERS_SLUG = "super-league";

export type HubTeamOption = {
  id: number;
  name: string;
  urlSlug: string;
  logoUrl: string | null;
};

export function resolveHubLeagueSlug(raw?: string): string {
  if (raw && isTransferUiSlug(raw) && !isTransferExcluded(raw)) {
    return raw;
  }
  return DEFAULT_TRANSFERS_SLUG;
}

async function mapHubTeams(
  leagueSlug: string,
): Promise<{ teams: HubTeamOption[]; leagueName: string }> {
  const [teams, league] = await Promise.all([
    getTeamsForLeagueSlug(leagueSlug),
    getLeagueBySlug(leagueSlug),
  ]);

  return {
    leagueName: league?.name ?? leagueSlug,
    teams: teams.map((team) => ({
      id: team.id,
      name: team.name,
      urlSlug: teamUrlSlug(team.slug, leagueSlug),
      logoUrl: team.logoUrl,
    })),
  };
}

export async function loadTransfersHub(leagueSlug: string) {
  const slug = resolveHubLeagueSlug(leagueSlug);
  const [leagues, { teams, leagueName }] = await Promise.all([
    getLeagueTabOptions(TRANSFER_UI_SLUGS),
    mapHubTeams(slug),
  ]);

  return {
    leagues,
    activeSlug: slug,
    activeLeagueName: leagueName,
    teams,
    deferred: isTransfersDeferred(slug),
  };
}

export async function loadTransferRumorsHub(leagueSlug: string) {
  const slug = resolveHubLeagueSlug(leagueSlug);
  const [leagues, { teams, leagueName }, user] = await Promise.all([
    getLeagueTabOptions(TRANSFER_UI_SLUGS),
    mapHubTeams(slug),
    getSessionUser(),
  ]);

  let hasFanProfileForLeague = false;
  if (user) {
    const league = await getLeagueBySlug(slug);
    if (league) {
      const profile = await runDbOrThrow(() =>
        db.query.fanProfiles.findFirst({
          where: and(
            eq(fanProfiles.userId, user.id),
            eq(fanProfiles.leagueId, league.id),
          ),
          columns: { id: true },
        }),
      );
      hasFanProfileForLeague = Boolean(profile);
    }
  }

  return {
    leagues,
    activeSlug: slug,
    activeLeagueName: leagueName,
    teams,
    isSignedIn: Boolean(user),
    hasFanProfileForLeague,
  };
}

export async function loadTeamTransfersPage(
  leagueSlug: string,
  teamUrlSlug: string,
) {
  if (isTransferExcluded(leagueSlug) || !isTransferUiSlug(leagueSlug)) {
    notFound();
  }

  const resolved = await getTeamByLeagueAndUrlSlug(leagueSlug, teamUrlSlug);
  if (!resolved) {
    notFound();
  }

  const { team, league } = resolved;
  const rows = await getTransfersByTeamSlug(leagueSlug, teamUrlSlug);

  return {
    team,
    league,
    rows,
    deferred: isTransfersDeferred(leagueSlug),
  };
}

export async function loadTeamTransferRumorsPage(
  leagueSlug: string,
  teamUrlSlug: string,
) {
  if (isTransferExcluded(leagueSlug) || !isTransferUiSlug(leagueSlug)) {
    notFound();
  }

  const resolved = await getTeamByLeagueAndUrlSlug(leagueSlug, teamUrlSlug);
  if (!resolved) {
    notFound();
  }

  const { team, league } = resolved;
  const user = await getSessionUser();

  let hasFanProfileForLeague = false;
  if (user) {
    const profile = await runDbOrThrow(() =>
      db.query.fanProfiles.findFirst({
        where: and(
          eq(fanProfiles.userId, user.id),
          eq(fanProfiles.leagueId, league.id),
        ),
        columns: { id: true },
      }),
    );
    hasFanProfileForLeague = Boolean(profile);
  }

  return {
    team,
    league,
    isSignedIn: Boolean(user),
    hasFanProfileForLeague,
  };
}
