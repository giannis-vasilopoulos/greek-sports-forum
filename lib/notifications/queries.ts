import { and, count, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { fanProfiles, notifications, threads } from "@/db/schema";
import { runDbOrThrow } from "@/lib/db/run";

import { formatNotificationItems } from "./format";
import type {
  NotificationDisplayContext,
  NotificationPayload,
  NotificationRow,
  FormattedNotification,
} from "./types";

const HEADER_NOTIFICATION_PREVIEW_LIMIT = 5;

export type HeaderNotifications = {
  unreadCount: number;
  previewItems: FormattedNotification[];
};

function parsePayload(payload: unknown): NotificationPayload {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const record = payload as Record<string, unknown>;

  return {
    threadId: typeof record.threadId === "number" ? record.threadId : undefined,
    postId: typeof record.postId === "number" ? record.postId : undefined,
    actorProfileId:
      typeof record.actorProfileId === "number"
        ? record.actorProfileId
        : undefined,
    leagueId: typeof record.leagueId === "number" ? record.leagueId : undefined,
  };
}

async function buildNotificationDisplayContext(
  rows: NotificationRow[],
): Promise<NotificationDisplayContext> {
  const actorIds = new Set<number>();
  const threadIds = new Set<number>();

  for (const row of rows) {
    const payload = parsePayload(row.payload);
    if (payload.actorProfileId) {
      actorIds.add(payload.actorProfileId);
    }
    if (payload.threadId) {
      threadIds.add(payload.threadId);
    }
  }

  const actors = new Map<number, { displayName: string }>();
  const threadMap = new Map<number, { slug: string; leagueSlug: string }>();

  if (actorIds.size > 0) {
    const actorRows = await db.query.fanProfiles.findMany({
      where: inArray(fanProfiles.id, [...actorIds]),
      columns: { id: true, displayName: true },
    });

    for (const actor of actorRows) {
      actors.set(actor.id, { displayName: actor.displayName });
    }
  }

  if (threadIds.size > 0) {
    const threadRows = await db.query.threads.findMany({
      where: inArray(threads.id, [...threadIds]),
      columns: { id: true, slug: true, leagueId: true },
      with: {
        league: {
          columns: { slug: true },
        },
      },
    });

    for (const thread of threadRows) {
      threadMap.set(thread.id, {
        slug: thread.slug,
        leagueSlug: thread.league.slug,
      });
    }
  }

  return { actors, threads: threadMap };
}

export async function getNotificationsForUser(
  userId: string,
  options?: { limit?: number },
): Promise<NotificationRow[]> {
  return runDbOrThrow(() =>
    db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: desc(notifications.createdAt),
      limit: options?.limit ?? 50,
    }),
  );
}

export async function getFormattedNotificationsForUser(
  userId: string,
  options?: { limit?: number },
): Promise<FormattedNotification[]> {
  return runDbOrThrow(async () => {
    const rows = await getNotificationsForUser(userId, options);
    const context = await buildNotificationDisplayContext(rows);
    return formatNotificationItems(rows, context);
  });
}

export async function getUnreadNotificationCount(
  userId: string,
): Promise<number> {
  return runDbOrThrow(async () => {
    const [row] = await db
      .select({ value: count() })
      .from(notifications)
      .where(
        and(eq(notifications.userId, userId), eq(notifications.isRead, false)),
      );

    return Number(row?.value ?? 0);
  });
}

export async function getHeaderNotifications(
  userId: string,
): Promise<HeaderNotifications> {
  return runDbOrThrow(async () => {
    const [unreadCount, previewItems] = await Promise.all([
      getUnreadNotificationCount(userId),
      getFormattedNotificationsForUser(userId, {
        limit: HEADER_NOTIFICATION_PREVIEW_LIMIT,
      }),
    ]);

    return { unreadCount, previewItems };
  });
}
