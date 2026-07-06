import { and, eq, gte, sql } from "drizzle-orm";

import { db } from "@/db";
import { fanProfiles, posts, threads } from "@/db/schema";
import { runDbOrThrow } from "@/lib/db/run";

import { getThreadById } from "./get-thread-by-id";
import { getThreadPosts } from "./get-thread-posts";
import type { ThreadDetailBundle } from "./types";

function stripForDescription(content: string, maxLength = 155): string {
  const stripped = content.replace(/\s+/g, " ").trim();
  if (stripped.length <= maxLength) return stripped;
  return `${stripped.slice(0, maxLength - 1)}…`;
}

export async function getThreadDetail(
  threadId: number,
  leagueSlug: string,
  options?: {
    viewerFanProfileId?: number;
    viewerIsModerator?: boolean;
  },
): Promise<ThreadDetailBundle | null> {
  const base = await getThreadById(threadId, leagueSlug);
  if (!base) return null;

  const { posts: threadPosts, opContent } = await getThreadPosts(threadId, {
    viewerFanProfileId: options?.viewerFanProfileId,
    viewerIsModerator: options?.viewerIsModerator,
    leagueId: base.thread.leagueId,
  });

  return {
    thread: base.thread,
    posts: threadPosts,
    opContent,
  };
}

export function threadDescriptionFromOp(opContent: string): string {
  return stripForDescription(opContent);
}

export async function getRecentPostRateContext(
  fanProfileId: number,
  leagueId: number,
  threadId: number,
) {
  return runDbOrThrow(async () => {
    const oneMinuteAgo = new Date(Date.now() - 60_000);

    const leagueThreadPosts = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .innerJoin(threads, eq(posts.threadId, threads.id))
      .where(
        and(
          eq(posts.fanProfileId, fanProfileId),
          eq(threads.leagueId, leagueId),
          gte(posts.createdAt, oneMinuteAgo),
        ),
      );

    const lastPost = await db.query.posts.findFirst({
      where: and(
        eq(posts.fanProfileId, fanProfileId),
        eq(posts.threadId, threadId),
      ),
      orderBy: (p, { desc }) => desc(p.createdAt),
      columns: { createdAt: true },
    });

    return {
      postsInLastMinute: leagueThreadPosts[0]?.count ?? 0,
      lastPostAt: lastPost?.createdAt ?? null,
    };
  });
}

export async function getFanProfileIdForUserInLeague(
  userId: string,
  leagueId: number,
): Promise<number | undefined> {
  const profile = await db.query.fanProfiles.findFirst({
    where: and(
      eq(fanProfiles.userId, userId),
      eq(fanProfiles.leagueId, leagueId),
    ),
    columns: { id: true },
  });

  return profile?.id;
}
