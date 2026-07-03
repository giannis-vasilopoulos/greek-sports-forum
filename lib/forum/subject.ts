import { and, eq, isNull, or } from "drizzle-orm";

import { db } from "@/db";
import { fanProfiles, moderationSanctions } from "@/db/schema";
import type { SessionUser } from "@/lib/auth/session";
import type { SanctionRecord } from "@/lib/forum/moderation";
import type { WriteSubject } from "@/lib/forum/permissions";
import { runDbOrThrow } from "@/lib/db/run";

function mapSanctionRow(
  row: Awaited<ReturnType<typeof fetchActiveSanctions>>[number],
): SanctionRecord {
  return {
    type: row.type,
    leagueId: row.leagueId,
    startsAt: row.startsAt,
    expiresAt: row.expiresAt,
    revokedAt: row.revokedAt,
  };
}

async function fetchActiveSanctions(fanProfileId: number) {
  return db.query.moderationSanctions.findMany({
    where: and(
      eq(moderationSanctions.fanProfileId, fanProfileId),
      isNull(moderationSanctions.revokedAt),
      or(
        isNull(moderationSanctions.expiresAt),
        // expiresAt in the future is handled in isSanctionActive at read time
      ),
    ),
    columns: {
      type: true,
      leagueId: true,
      startsAt: true,
      expiresAt: true,
      revokedAt: true,
    },
  });
}

export async function getFanProfileForUserInLeague(
  userId: string,
  leagueId: number,
) {
  return runDbOrThrow(() =>
    db.query.fanProfiles.findFirst({
      where: and(
        eq(fanProfiles.userId, userId),
        eq(fanProfiles.leagueId, leagueId),
      ),
      columns: {
        id: true,
        leagueId: true,
        favoriteTeamId: true,
        reputation: true,
        trustStatus: true,
        userId: true,
        displayName: true,
      },
    }),
  );
}

export async function buildWriteSubject(
  user: SessionUser | undefined,
  leagueId: number,
): Promise<WriteSubject> {
  if (!user) {
    return {
      userId: null,
      role: null,
      fanProfile: null,
      activeSanctions: [],
    };
  }

  const fanProfile = await getFanProfileForUserInLeague(user.id, leagueId);

  if (!fanProfile) {
    return {
      userId: user.id,
      role: user.role,
      fanProfile: null,
      activeSanctions: [],
    };
  }

  const sanctionRows = await runDbOrThrow(() =>
    fetchActiveSanctions(fanProfile.id),
  );

  return {
    userId: user.id,
    role: user.role,
    fanProfile: {
      id: fanProfile.id,
      leagueId: fanProfile.leagueId,
      favoriteTeamId: fanProfile.favoriteTeamId,
      reputation: fanProfile.reputation,
      trustStatus: fanProfile.trustStatus,
    },
    activeSanctions: sanctionRows.map(mapSanctionRow),
  };
}
