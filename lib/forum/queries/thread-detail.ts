import { and, asc, eq, gte, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  fanProfiles,
  moderationSanctions,
  posts,
  postVotes,
  threads,
} from "@/db/schema";
import type { FeedThread } from "@/components/feed/feed-data";
import { getInitials } from "@/components/layout/site-data";
import { formatRelativeTime } from "@/lib/feed/format-relative-time";
import { mapThreadRowToFeedThread } from "@/lib/feed/queries";
import { isSanctionActive } from "@/lib/forum/moderation";
import { runDbOrThrow } from "@/lib/db/run";

export type ThreadPost = {
  id: number;
  content: string;
  score: number;
  likeCount: number;
  isCollapsed: boolean;
  isFlagged: boolean;
  isEdited: boolean;
  parentId: number | null;
  parentAuthorName: string | null;
  authorName: string;
  authorInitials: string;
  authorFanProfileId: number;
  createdAt: Date;
  relativeTime: string;
  viewerVote: 1 | -1 | null;
  isOp: boolean;
};

export type ThreadDetail = FeedThread & {
  leagueId: number;
  teamId: number | null;
  isLocked: boolean;
  matchStatus:
    | "scheduled"
    | "live"
    | "halftime"
    | "finished"
    | "postponed"
    | "cancelled"
    | null;
  createdAt: Date;
  lastActivityAt: Date;
  viewCount: number;
};

export type ThreadDetailBundle = {
  thread: ThreadDetail;
  opContent: string;
  posts: ThreadPost[];
};

function stripForDescription(content: string, maxLength = 155): string {
  const stripped = content.replace(/\s+/g, " ").trim();
  if (stripped.length <= maxLength) return stripped;
  return `${stripped.slice(0, maxLength - 1)}…`;
}

async function getShadowBannedProfileIds(
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

// fallow-ignore-next-line complexity
export async function getThreadPosts(
  threadId: number,
  options?: {
    viewerFanProfileId?: number;
    viewerIsModerator?: boolean;
    leagueId?: number;
  },
): Promise<{ posts: ThreadPost[]; opContent: string }> {
  return runDbOrThrow(async () => {
    const rows = await db.query.posts.findMany({
      where: and(
        eq(posts.threadId, threadId),
        eq(posts.moderationStatus, "visible"),
      ),
      orderBy: asc(posts.createdAt),
      with: {
        fanProfile: true,
        parent: {
          with: {
            fanProfile: true,
          },
        },
      },
    });

    const now = new Date();
    const shadowBanned =
      options?.leagueId !== undefined
        ? await getShadowBannedProfileIds(options.leagueId, now)
        : new Set<number>();

    const viewerVoteByPostId = new Map<number, 1 | -1>();
    if (options?.viewerFanProfileId) {
      const votes = await db.query.postVotes.findMany({
        where: eq(postVotes.fanProfileId, options.viewerFanProfileId),
        columns: { postId: true, value: true },
      });

      for (const vote of votes) {
        if (vote.value === 1 || vote.value === -1) {
          viewerVoteByPostId.set(vote.postId, vote.value);
        }
      }
    }

    const visibleRows = rows.filter((row) => {
      if (row.moderationStatus !== "visible") return false;

      const authorShadowBanned = shadowBanned.has(row.fanProfileId);
      if (!authorShadowBanned) return true;

      if (options?.viewerIsModerator) return true;
      if (options?.viewerFanProfileId === row.fanProfileId) return true;

      return false;
    });

    const firstPostId = visibleRows[0]?.id ?? null;

    const mapped: ThreadPost[] = visibleRows.map((row) => {
      const authorName = row.fanProfile.displayName;

      return {
        id: row.id,
        content: row.content,
        score: row.score,
        likeCount: row.likeCount,
        isCollapsed: row.isCollapsed,
        isFlagged: row.moderationStatus === "flagged",
        isEdited: row.isEdited,
        parentId: row.parentId,
        parentAuthorName: row.parent?.fanProfile.displayName ?? null,
        authorName,
        authorInitials: getInitials(authorName),
        authorFanProfileId: row.fanProfileId,
        createdAt: row.createdAt,
        relativeTime: formatRelativeTime(row.createdAt, now),
        viewerVote: viewerVoteByPostId.get(row.id) ?? null,
        isOp: row.id === firstPostId,
      };
    });

    const opContent = mapped.find((post) => post.isOp)?.content ?? "";

    return { posts: mapped, opContent };
  });
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
