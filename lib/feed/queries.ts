import { desc } from "drizzle-orm";

import { db } from "@/db";
import { threads } from "@/db/schema";
import type { FeedThread, TrendingThread } from "@/components/feed/feed-data";
import { formatRelativeTime } from "@/lib/feed/format-relative-time";
import { getInitials } from "@/components/layout/site-data";
import { runDbOrThrow } from "@/lib/db/run";

type ThreadRow = Awaited<ReturnType<typeof fetchThreadRows>>[number];

async function fetchThreadRows(limit?: number) {
  return db.query.threads.findMany({
    orderBy: desc(threads.lastActivityAt),
    limit,
    with: {
      league: true,
      fanProfile: true,
    },
  });
}

export function mapThreadRowToFeedThread(row: ThreadRow): FeedThread {
  const authorName = row.fanProfile.displayName;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    leagueSlug: row.league.slug,
    leagueName: row.league.name,
    type: row.type,
    isLive: row.type === "match_thread" && isRecentlyActive(row.lastActivityAt),
    authorName,
    authorInitials: getInitials(authorName),
    replyCount: row.replyCount,
    lastActivity: formatRelativeTime(row.lastActivityAt),
  };
}

function isRecentlyActive(lastActivityAt: Date): boolean {
  const fiveMinutesAgo = Date.now() - 5 * 60_000;
  return lastActivityAt.getTime() >= fiveMinutesAgo;
}

export function mapThreadRowToTrending(row: ThreadRow): TrendingThread {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    leagueSlug: row.league.slug,
    replyCount: row.replyCount,
  };
}

export async function getFeedThreads(): Promise<FeedThread[]> {
  return runDbOrThrow(async () => {
    const rows = await fetchThreadRows();
    return rows.map(mapThreadRowToFeedThread);
  });
}

export async function getTrendingThreads(limit = 3): Promise<TrendingThread[]> {
  return runDbOrThrow(async () => {
    const rows = await db.query.threads.findMany({
      orderBy: desc(threads.replyCount),
      limit,
      with: {
        league: true,
        fanProfile: true,
      },
    });
    return rows.map(mapThreadRowToTrending);
  });
}
