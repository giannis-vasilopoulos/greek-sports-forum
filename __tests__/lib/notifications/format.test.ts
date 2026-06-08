import { describe, expect, it } from "vitest";

import { copy } from "@/lib/copy";
import { formatNotificationItem } from "@/lib/notifications/format";
import type {
  NotificationDisplayContext,
  NotificationRow,
} from "@/lib/notifications/types";

const now = new Date("2026-06-08T12:00:00Z");

function makeRow(overrides: Partial<NotificationRow> = {}): NotificationRow {
  return {
    id: 1,
    userId: "user-1",
    type: "reply",
    payload: {
      threadId: 10,
      actorProfileId: 5,
      leagueId: 1,
    },
    isRead: false,
    createdAt: new Date("2026-06-08T11:30:00Z"),
    ...overrides,
  };
}

const context: NotificationDisplayContext = {
  actors: new Map([[5, { displayName: "GreenEagle" }]]),
  threads: new Map([[10, { slug: "pao-aek", leagueSlug: "super-league" }]]),
};

describe("formatNotificationItem", () => {
  it("formats reply notification with actor and thread link", () => {
    const item = formatNotificationItem(makeRow(), context, now);

    expect(item.text).toBe(copy.notifications.types.reply("GreenEagle"));
    expect(item.actorInitials).toBe("G");
    expect(item.time).toBe("30λ");
    expect(item.href).toBe("/leagues/super-league/threads/10-pao-aek");
    expect(item.isRead).toBe(false);
  });

  it("uses generic actor when actor profile is missing", () => {
    const item = formatNotificationItem(
      makeRow({ payload: { threadId: 10 } }),
      context,
      now,
    );

    expect(item.text).toBe(
      copy.notifications.types.reply(copy.notifications.genericActor),
    );
    expect(item.actorInitials).toBeUndefined();
  });

  it("formats like notification text", () => {
    const item = formatNotificationItem(
      makeRow({ type: "like" }),
      context,
      now,
    );

    expect(item.text).toBe(copy.notifications.types.like("GreenEagle"));
  });

  it("formats mention notification text", () => {
    const item = formatNotificationItem(
      makeRow({ type: "mention" }),
      context,
      now,
    );

    expect(item.text).toBe(copy.notifications.types.mention("GreenEagle"));
  });

  it("omits href for match_starting notifications", () => {
    const item = formatNotificationItem(
      makeRow({ type: "match_starting", payload: { threadId: 10 } }),
      context,
      now,
    );

    expect(item.text).toBe(copy.notifications.types.matchStarting);
    expect(item.href).toBeUndefined();
  });
});
