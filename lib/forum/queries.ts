import { desc, isNull } from "drizzle-orm";

import { db } from "@/db";
import { threads } from "@/db/schema";
import { runDbOrThrow } from "@/lib/db/run";

export async function getLeagueFeedThreads(leagueId: number) {
  return runDbOrThrow(() =>
    db.query.threads.findMany({
      where: (t, { and, eq: eqFn }) =>
        and(eqFn(t.leagueId, leagueId), isNull(t.teamId)),
      orderBy: desc(threads.lastActivityAt),
      with: {
        league: true,
        fanProfile: true,
        team: true,
      },
    }),
  );
}

export async function getTeamFeedThreads(leagueId: number, teamId: number) {
  return runDbOrThrow(() =>
    db.query.threads.findMany({
      where: (t, { and, eq: eqFn }) =>
        and(eqFn(t.leagueId, leagueId), eqFn(t.teamId, teamId)),
      orderBy: desc(threads.lastActivityAt),
      with: {
        league: true,
        fanProfile: true,
        team: true,
      },
    }),
  );
}
