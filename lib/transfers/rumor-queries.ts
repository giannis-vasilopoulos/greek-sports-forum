import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { leagues, threads } from "@/db/schema";
import type { FeedThread } from "@/components/feed/feed-data";
import { getInitials } from "@/components/layout/site-data";
import { formatRelativeTime } from "@/lib/feed/format-relative-time";
import { runDbOrThrow } from "@/lib/db/run";
import { threadPath } from "@/lib/seo/paths";

type RumorThreadRow = {
  id: number;
  slug: string;
  title: string;
  replyCount: number;
  lastActivityAt: Date;
  league: { slug: string; name: string };
  fanProfile: { displayName: string };
};

function mapRumorThreadToFeedThread(row: RumorThreadRow): FeedThread {
  const authorName = row.fanProfile.displayName;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    leagueSlug: row.league.slug,
    leagueName: row.league.name,
    type: "transfer_rumor",
    isLive: false,
    authorName,
    authorInitials: getInitials(authorName),
    replyCount: row.replyCount,
    lastActivity: formatRelativeTime(row.lastActivityAt),
  };
}

export async function getTransferRumorThreads(input?: {
  leagueSlug?: string;
  teamId?: number;
  limit?: number;
}): Promise<FeedThread[]> {
  const { leagueSlug, teamId, limit = 50 } = input ?? {};

  return runDbOrThrow(async () => {
    const conditions = [eq(threads.type, "transfer_rumor" as const)];

    if (leagueSlug) {
      const league = await db.query.leagues.findFirst({
        where: eq(leagues.slug, leagueSlug),
        columns: { id: true },
      });

      if (!league) return [];

      conditions.push(eq(threads.leagueId, league.id));
    }

    if (teamId !== undefined) {
      conditions.push(eq(threads.teamId, teamId));
    }

    const rows = await db.query.threads.findMany({
      where: and(...conditions),
      orderBy: desc(threads.lastActivityAt),
      limit,
      with: {
        league: true,
        fanProfile: true,
      },
    });

    return rows.map(mapRumorThreadToFeedThread);
  });
}

export function getTransferRumorJsonLdInput(threads: FeedThread[]): {
  threadTitles: string[];
  threadPaths: string[];
} {
  return {
    threadTitles: threads.map((t) => t.title),
    threadPaths: threads.map((t) => threadPath(t.leagueSlug, t.id, t.slug)),
  };
}
