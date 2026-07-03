"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { posts, postVotes } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import { copy } from "@/lib/copy";
import { runDbResult } from "@/lib/db/run";
import { shouldCollapsePost } from "@/lib/forum/moderation";
import { canVote } from "@/lib/forum/permissions";
import { applyReputationEvent } from "@/lib/forum/reputation";
import { buildWriteSubject } from "@/lib/forum/subject";
import { threadPath } from "@/lib/seo/paths";
import { votePostSchema, type VotePostInput } from "@/lib/validation/replies";

export type VotePostState = {
  ok?: boolean;
  error?: string;
};

async function applyReputationForVoteChange(
  authorFanProfileId: number,
  postId: number,
  previous: 1 | -1 | null,
  next: 1 | -1 | null,
) {
  if (previous === next) return;

  if (previous === 1) {
    await applyReputationEvent(authorFanProfileId, "post_downvoted", {
      postId,
    });
    await applyReputationEvent(authorFanProfileId, "post_downvoted", {
      postId,
    });
  } else if (previous === -1) {
    await applyReputationEvent(authorFanProfileId, "post_liked", { postId });
  }

  if (next === 1) {
    await applyReputationEvent(authorFanProfileId, "post_liked", { postId });
  } else if (next === -1) {
    await applyReputationEvent(authorFanProfileId, "post_downvoted", {
      postId,
    });
  }
}

// fallow-ignore-next-line complexity
export async function votePost(input: VotePostInput): Promise<VotePostState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: copy.thread.errors.mustBeSignedIn };
  }

  const parsed = votePostSchema.safeParse(input);
  if (!parsed.success) {
    return { error: copy.thread.errors.generic };
  }

  const { postId, value } = parsed.data;

  const postRow = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    with: {
      thread: {
        with: { league: true },
      },
    },
  });

  if (!postRow) {
    return { error: copy.thread.errors.generic };
  }

  const subject = await buildWriteSubject(user, postRow.thread.leagueId);

  if (!subject.fanProfile) {
    return { error: copy.thread.errors.needFanProfile };
  }

  const allowed = canVote(
    {
      userId: user.id,
      fanProfile: {
        id: subject.fanProfile.id,
        leagueId: subject.fanProfile.leagueId,
      },
    },
    {
      postId,
      authorFanProfileId: postRow.fanProfileId,
      thread: { leagueId: postRow.thread.leagueId },
    },
  );

  if (!allowed) {
    return { error: copy.thread.errors.generic };
  }

  const result = await runDbResult(async () => {
    const existing = await db.query.postVotes.findFirst({
      where: and(
        eq(postVotes.fanProfileId, subject.fanProfile!.id),
        eq(postVotes.postId, postId),
      ),
    });

    let scoreDelta = 0;
    let likeDelta = 0;
    const previousVote: 1 | -1 | null =
      existing?.value === 1 || existing?.value === -1 ? existing.value : null;
    let nextVote: 1 | -1 | null = null;

    if (!existing) {
      await db.insert(postVotes).values({
        fanProfileId: subject.fanProfile!.id,
        postId,
        value,
      });
      scoreDelta = value;
      likeDelta = value === 1 ? 1 : 0;
      nextVote = value;
    } else if (existing.value === value) {
      await db
        .delete(postVotes)
        .where(
          and(
            eq(postVotes.fanProfileId, subject.fanProfile!.id),
            eq(postVotes.postId, postId),
          ),
        );
      scoreDelta = -value;
      likeDelta = value === 1 ? -1 : 0;
      nextVote = null;
    } else {
      await db
        .update(postVotes)
        .set({ value })
        .where(
          and(
            eq(postVotes.fanProfileId, subject.fanProfile!.id),
            eq(postVotes.postId, postId),
          ),
        );
      scoreDelta = value - existing.value;
      likeDelta = (value === 1 ? 1 : 0) - (existing.value === 1 ? 1 : 0);
      nextVote = value;
    }

    const newScore = postRow.score + scoreDelta;

    const [updated] = await db
      .update(posts)
      .set({
        score: sql`${posts.score} + ${scoreDelta}`,
        likeCount: sql`greatest(0, ${posts.likeCount} + ${likeDelta})`,
        isCollapsed: shouldCollapsePost(newScore),
      })
      .where(eq(posts.id, postId))
      .returning({ fanProfileId: posts.fanProfileId });

    await applyReputationForVoteChange(
      updated!.fanProfileId,
      postId,
      previousVote,
      nextVote,
    );

    return updated;
  });

  if (!result.ok) {
    return { error: copy.thread.errors.generic };
  }

  revalidatePath(
    threadPath(
      postRow.thread.league.slug,
      postRow.thread.id,
      postRow.thread.slug,
    ),
  );

  return { ok: true };
}
