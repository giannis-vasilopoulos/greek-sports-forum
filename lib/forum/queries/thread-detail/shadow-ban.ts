import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { moderationSanctions } from "@/db/schema";
import { isSanctionActive } from "@/lib/forum/moderation";

export async function getShadowBannedProfileIds(
  leagueId: number,
  now: Date,
): Promise<Set<number>> {
  const rows = await db.query.moderationSanctions.findMany({
    where: and(
      eq(moderationSanctions.leagueId, leagueId),
      eq(moderationSanctions.type, "shadow_ban"),
    ),
    columns: {
      fanProfileId: true,
      startsAt: true,
      expiresAt: true,
      revokedAt: true,
      type: true,
      leagueId: true,
    },
  });

  const banned = new Set<number>();
  for (const row of rows) {
    if (
      isSanctionActive(
        {
          type: row.type,
          leagueId: row.leagueId,
          startsAt: row.startsAt,
          expiresAt: row.expiresAt,
          revokedAt: row.revokedAt,
        },
        now,
      )
    ) {
      banned.add(row.fanProfileId);
    }
  }

  return banned;
}
