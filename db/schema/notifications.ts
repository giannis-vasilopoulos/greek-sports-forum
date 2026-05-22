// src/db/schema/notifications.ts
import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  serial,
  text,
  boolean,
  timestamp,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const notifTypeEnum = pgEnum("notif_type", [
  "reply",
  "like",
  "mention",
  "match_starting",
]);

export const notifications = pgTable(
  "notification",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    type: notifTypeEnum("type").notNull(),
    // { threadId, postId, actorProfileId, leagueId }
    payload: jsonb("payload"),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("notif_user_unread_idx").on(t.userId, t.isRead)],
);

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(user, { fields: [notifications.userId], references: [user.id] }),
}));
