import { eq } from "drizzle-orm";

import { upsertMockFanProfile } from "@/db/seed/mock/fan-profiles";

import { db } from "../index";
import { leagues, notifications, threads, user } from "../schema";

type SeedNotification = {
  type: "reply" | "like" | "mention" | "match_starting";
  threadId: number;
  postId?: number;
  minutesAgo: number;
  isRead: boolean;
};

const SEED_NOTIFICATIONS: SeedNotification[] = [
  {
    type: "reply",
    threadId: 42,
    postId: 101,
    minutesAgo: 2,
    isRead: false,
  },
  {
    type: "like",
    threadId: 38,
    postId: 88,
    minutesAgo: 12,
    isRead: false,
  },
  {
    type: "mention",
    threadId: 31,
    postId: 55,
    minutesAgo: 45,
    isRead: false,
  },
  {
    type: "match_starting",
    threadId: 38,
    minutesAgo: 5,
    isRead: false,
  },
  {
    type: "reply",
    threadId: 28,
    postId: 40,
    minutesAgo: 120,
    isRead: true,
  },
  {
    type: "like",
    threadId: 15,
    postId: 22,
    minutesAgo: 180,
    isRead: true,
  },
  {
    type: "mention",
    threadId: 25,
    postId: 33,
    minutesAgo: 240,
    isRead: true,
  },
];

export async function seedNotifications() {
  const testUser = await db.query.user.findFirst({
    where: eq(user.username, "testuser"),
    columns: { id: true },
  });

  if (!testUser) {
    console.warn("  testuser not found — skipping notifications");
    return;
  }

  const adminUser = await db.query.user.findFirst({
    where: eq(user.username, "admin"),
    columns: { id: true },
  });

  const superLeague = await db.query.leagues.findFirst({
    where: eq(leagues.slug, "super-league"),
    columns: { id: true },
  });

  const paokTeam = superLeague
    ? await db.query.teams.findFirst({
        where: (t, { and, eq: eqFn }) =>
          and(eqFn(t.leagueId, superLeague.id), eqFn(t.slug, "paok")),
        columns: { id: true },
      })
    : null;

  let actorProfileId: number | undefined;

  if (adminUser && superLeague && paokTeam) {
    const actorProfile = await upsertMockFanProfile({
      userId: adminUser.id,
      leagueId: superLeague.id,
      favoriteTeamId: paokTeam.id,
      displayName: "GreenArmy22",
    });
    actorProfileId = actorProfile.id;
  }

  await db.delete(notifications).where(eq(notifications.userId, testUser.id));

  let inserted = 0;

  for (const seed of SEED_NOTIFICATIONS) {
    const thread = await db.query.threads.findFirst({
      where: eq(threads.id, seed.threadId),
      columns: { id: true, leagueId: true },
    });

    if (!thread) {
      console.warn(
        `  thread ${seed.threadId} not found — skipping notification (${seed.type})`,
      );
      continue;
    }

    await db.insert(notifications).values({
      userId: testUser.id,
      type: seed.type,
      payload: {
        threadId: thread.id,
        postId: seed.postId,
        actorProfileId,
        leagueId: thread.leagueId,
      },
      isRead: seed.isRead,
      createdAt: new Date(Date.now() - seed.minutesAgo * 60_000),
    });

    inserted += 1;
  }

  const unread = SEED_NOTIFICATIONS.filter((n) => !n.isRead).length;
  console.log(
    `  ${inserted} notifications seeded for testuser (${unread} unread)`,
  );
}
