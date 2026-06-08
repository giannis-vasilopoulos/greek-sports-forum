import { getInitials } from "@/components/layout/site-data";
import { copy } from "@/lib/copy";
import { formatRelativeTime } from "@/lib/feed/format-relative-time";
import { threadPath } from "@/lib/seo/paths";

import type {
  NotificationDisplayContext,
  NotificationPayload,
  NotificationRow,
  FormattedNotification,
} from "./types";

const t = copy.notifications;

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

function buildNotificationText(
  type: NotificationRow["type"],
  actorName: string,
): string {
  switch (type) {
    case "reply":
      return t.types.reply(actorName);
    case "like":
      return t.types.like(actorName);
    case "mention":
      return t.types.mention(actorName);
    case "match_starting":
      return t.types.matchStarting;
    default:
      return t.types.reply(actorName);
  }
}

function buildNotificationHref(
  type: NotificationRow["type"],
  payload: NotificationPayload,
  context: NotificationDisplayContext,
): string | undefined {
  if (type === "match_starting" || !payload.threadId) {
    return undefined;
  }

  const thread = context.threads.get(payload.threadId);
  if (!thread) {
    return undefined;
  }

  return threadPath(thread.leagueSlug, payload.threadId, thread.slug);
}

export function formatNotificationItem(
  row: NotificationRow,
  context: NotificationDisplayContext,
  now = new Date(),
): FormattedNotification {
  const payload = parsePayload(row.payload);
  const actor = payload.actorProfileId
    ? context.actors.get(payload.actorProfileId)
    : undefined;
  const actorName = actor?.displayName ?? t.genericActor;

  return {
    id: row.id,
    text: buildNotificationText(row.type, actorName),
    time: formatRelativeTime(row.createdAt, now),
    actorInitials: actor ? getInitials(actor.displayName) : undefined,
    href: buildNotificationHref(row.type, payload, context),
    isRead: row.isRead,
  };
}

export function formatNotificationItems(
  rows: NotificationRow[],
  context: NotificationDisplayContext,
  now = new Date(),
): FormattedNotification[] {
  return rows.map((row) => formatNotificationItem(row, context, now));
}
