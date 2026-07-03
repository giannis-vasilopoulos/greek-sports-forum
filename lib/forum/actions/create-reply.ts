"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { notifications, posts, threads } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import { copy } from "@/lib/copy";
import { runDbResult } from "@/lib/db/run";
import {
  canReply,
  getWriteRestriction,
  writeBlockReason,
} from "@/lib/forum/permissions";
import { getRecentPostRateContext } from "@/lib/forum/queries/thread-detail";
import { buildWriteSubject } from "@/lib/forum/subject";
import {
  resolveWriteContext,
  toThreadContext,
} from "@/lib/forum/write-context";
import { threadPath } from "@/lib/seo/paths";
import { zodFieldErrors } from "@/lib/validation/parse";
import {
  createReplySchema,
  type CreateReplyInput,
} from "@/lib/validation/replies";

export type CreateReplyState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof CreateReplyInput, string>>;
};

// fallow-ignore-next-line complexity
export async function createReply(
  input: CreateReplyInput,
): Promise<CreateReplyState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: copy.thread.errors.mustBeSignedIn };
  }

  const parsed = createReplySchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { threadId, content, parentId } = parsed.data;

  const threadRow = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
    with: { league: true },
  });

  if (!threadRow) {
    return { error: copy.validation.reply.threadRequired };
  }

  const subject = await buildWriteSubject(user, threadRow.leagueId);
  const writeContext = resolveWriteContext(threadRow);
  const threadContext = toThreadContext(threadRow);

  const blockReason = writeBlockReason(writeContext, subject);
  if (blockReason) {
    return { error: blockReason };
  }

  if (!canReply(threadContext, subject)) {
    if (threadRow.isLocked) {
      return { error: copy.forum.threadLocked };
    }
    return { error: copy.thread.errors.generic };
  }

  const rateContext = await getRecentPostRateContext(
    subject.fanProfile!.id,
    threadRow.leagueId,
    threadId,
  );

  const restriction = getWriteRestriction(subject, {
    leagueId: threadRow.leagueId,
    thread: threadContext,
    lastPostAt: rateContext.lastPostAt,
    postsInLastMinute: rateContext.postsInLastMinute,
  });

  if (restriction) {
    return { error: restriction.message };
  }

  if (parentId) {
    const parentPost = await db.query.posts.findFirst({
      where: and(eq(posts.id, parentId), eq(posts.threadId, threadId)),
      columns: { id: true, fanProfileId: true },
    });

    if (!parentPost) {
      return { error: copy.thread.errors.generic };
    }
  }

  const result = await runDbResult(async () => {
    const now = new Date();

    const [post] = await db
      .insert(posts)
      .values({
        threadId,
        fanProfileId: subject.fanProfile!.id,
        content,
        parentId: parentId ?? null,
      })
      .returning({ id: posts.id });

    await db
      .update(threads)
      .set({
        replyCount: sql`${threads.replyCount} + 1`,
        lastActivityAt: now,
      })
      .where(eq(threads.id, threadId));

    if (parentId) {
      const parentPost = await db.query.posts.findFirst({
        where: eq(posts.id, parentId),
        with: { fanProfile: true },
      });

      if (parentPost && parentPost.fanProfile.userId !== user.id) {
        await db.insert(notifications).values({
          userId: parentPost.fanProfile.userId,
          type: "reply",
          payload: {
            threadId,
            postId: post!.id,
            actorProfileId: subject.fanProfile!.id,
            leagueId: threadRow.leagueId,
          },
        });
      }
    }

    return post;
  });

  if (!result.ok) {
    return { error: copy.thread.errors.generic };
  }

  revalidatePath(
    threadPath(threadRow.league.slug, threadRow.id, threadRow.slug),
  );

  return { ok: true };
}
