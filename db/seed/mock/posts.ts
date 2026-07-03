import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { posts, threads } from "@/db/schema";

import { runSeedCli } from "./cli";
import type { AuthorPool } from "./post-authors";
import {
  defaultThreadFixture,
  MOCK_THREAD_POST_FIXTURES,
  type MockThreadPostsFixture,
} from "./post-fixtures";
import { MOCK_THREADS } from "./threads";

function resolveAuthorId(
  pool: AuthorPool,
  leagueSlug: string,
  authorKey: string,
  fallbackFanProfileId: number,
): number {
  const leagueAuthors = pool.get(leagueSlug);
  const authorId = leagueAuthors?.get(authorKey);

  if (authorId) return authorId;

  const firstAuthor = leagueAuthors?.values().next().value;
  return firstAuthor ?? fallbackFanProfileId;
}

async function seedThreadPosts(
  threadId: number,
  leagueSlug: string,
  threadFanProfileId: number,
  lastActivityAt: Date,
  fixture: MockThreadPostsFixture,
  authorPool: AuthorPool,
) {
  const replyCount = fixture.replies.length;
  const opCreatedAt = new Date(
    lastActivityAt.getTime() - (replyCount + 1) * 60_000,
  );

  const opAuthorId = resolveAuthorId(
    authorPool,
    leagueSlug,
    fixture.opAuthorKey ?? "pao",
    threadFanProfileId,
  );

  const [opRow] = await db
    .insert(posts)
    .values({
      threadId,
      fanProfileId: opAuthorId,
      content: fixture.op,
      createdAt: opCreatedAt,
    })
    .returning({ id: posts.id });

  const postIdsByIndex: number[] = [opRow!.id];

  for (const reply of fixture.replies) {
    const authorId = resolveAuthorId(
      authorPool,
      leagueSlug,
      reply.authorKey,
      threadFanProfileId,
    );

    const parentId =
      reply.parentIndex !== undefined
        ? postIdsByIndex[reply.parentIndex]
        : null;

    const [row] = await db
      .insert(posts)
      .values({
        threadId,
        fanProfileId: authorId,
        parentId: parentId ?? null,
        content: reply.content,
        score: reply.score ?? 0,
        likeCount: reply.likeCount ?? Math.max(0, reply.score ?? 0),
        isCollapsed: reply.isCollapsed ?? false,
        isEdited: reply.isEdited ?? false,
        createdAt: new Date(
          opCreatedAt.getTime() + reply.minutesAfterOp * 60_000,
        ),
      })
      .returning({ id: posts.id });

    postIdsByIndex.push(row!.id);
  }

  await db
    .update(threads)
    .set({
      replyCount: fixture.replies.length,
      lastActivityAt,
    })
    .where(eq(threads.id, threadId));
}

export async function seedMockPosts(options?: { authorPool?: AuthorPool }) {
  console.log("Seeding mock posts...");

  const authorPool = options?.authorPool ?? new Map();
  const threadIds = MOCK_THREADS.map((thread) => thread.id);

  await db.delete(posts).where(inArray(posts.threadId, threadIds));

  let seededThreads = 0;

  for (const thread of MOCK_THREADS) {
    const threadRow = await db.query.threads.findFirst({
      where: eq(threads.id, thread.id),
      columns: {
        id: true,
        fanProfileId: true,
        lastActivityAt: true,
      },
    });

    if (!threadRow) continue;

    const leagueAuthors = authorPool.get(thread.leagueSlug);
    if (!leagueAuthors || leagueAuthors.size === 0) {
      console.warn(
        `  skipping thread ${thread.id} — no mock authors for ${thread.leagueSlug}`,
      );
      continue;
    }

    const fixture =
      MOCK_THREAD_POST_FIXTURES[thread.id] ??
      defaultThreadFixture(thread.id, thread.title);

    await seedThreadPosts(
      threadRow.id,
      thread.leagueSlug,
      threadRow.fanProfileId,
      threadRow.lastActivityAt,
      fixture,
      authorPool,
    );

    seededThreads += 1;
  }

  console.log(`  seeded posts for ${seededThreads} threads`);
}

runSeedCli(import.meta.url, async () => {
  const { seedMockPostAuthors } = await import("./post-authors");
  const authorPool = await seedMockPostAuthors();
  await seedMockPosts({ authorPool });
});
