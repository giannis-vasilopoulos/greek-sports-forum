import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { posts, postVotes } from "@/db/schema";
import { getInitials } from "@/components/layout/site-data";
import { formatRelativeTime } from "@/lib/feed/format-relative-time";
import { runDbOrThrow } from "@/lib/db/run";

import { getShadowBannedProfileIds } from "./shadow-ban";
import type { ThreadPost } from "./types";

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
