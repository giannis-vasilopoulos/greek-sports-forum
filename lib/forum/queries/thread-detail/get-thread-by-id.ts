import { eq } from "drizzle-orm";

import { db } from "@/db";
import { threads } from "@/db/schema";
import { mapThreadRowToFeedThread } from "@/lib/feed/queries";
import { runDbOrThrow } from "@/lib/db/run";

import type { ThreadDetailBundle } from "./types";

export async function getThreadById(
  threadId: number,
  leagueSlug: string,
): Promise<ThreadDetailBundle | null> {
  return runDbOrThrow(async () => {
    const row = await db.query.threads.findFirst({
      where: eq(threads.id, threadId),
      with: {
        league: true,
        fanProfile: true,
        team: true,
      },
    });

    if (!row || row.league.slug !== leagueSlug) return null;

    const feedThread = mapThreadRowToFeedThread(row);

    return {
      thread: {
        ...feedThread,
        leagueId: row.leagueId,
        teamId: row.teamId,
        isLocked: row.isLocked,
        matchStatus: row.matchStatus,
        createdAt: row.createdAt,
        lastActivityAt: row.lastActivityAt,
        viewCount: row.viewCount,
      },
      opContent: "",
      posts: [],
    };
  });
}
