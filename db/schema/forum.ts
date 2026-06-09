import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

import { fanProfiles } from "./profiles";
import { leagues, teams } from "./leagues";

export const threadTypeEnum = pgEnum("thread_type", [
  "discussion",
  "match_thread",
  "news",
  "poll",
  "transfer_rumor",
]);

export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "halftime",
  "finished",
  "postponed",
  "cancelled",
]);

export const postModerationStatusEnum = pgEnum("post_moderation_status", [
  "pending",
  "visible",
  "removed",
  "flagged",
]);

export const threads = pgTable(
  "thread",
  {
    id: serial("id").primaryKey(),
    fanProfileId: integer("fan_profile_id")
      .references(() => fanProfiles.id)
      .notNull(),
    leagueId: integer("league_id")
      .references(() => leagues.id)
      .notNull(),
    teamId: integer("team_id").references(() => teams.id),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    type: threadTypeEnum("type").default("discussion").notNull(),
    matchStatus: matchStatusEnum("match_status"),
    isPinned: boolean("is_pinned").default(false).notNull(),
    isLocked: boolean("is_locked").default(false).notNull(),
    replyCount: integer("reply_count").default(0).notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("thread_league_activity_idx").on(t.leagueId, t.lastActivityAt),
    index("thread_league_slug_idx").on(t.leagueId, t.slug),
    index("thread_league_team_activity_idx").on(
      t.leagueId,
      t.teamId,
      t.lastActivityAt,
    ),
  ],
);

export const posts = pgTable(
  "post",
  {
    id: serial("id").primaryKey(),
    threadId: integer("thread_id")
      .references(() => threads.id, { onDelete: "cascade" })
      .notNull(),
    fanProfileId: integer("fan_profile_id")
      .references(() => fanProfiles.id)
      .notNull(),
    parentId: integer("parent_id"),
    content: text("content").notNull(),
    score: integer("score").default(0).notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    isCollapsed: boolean("is_collapsed").default(false).notNull(),
    moderationStatus: postModerationStatusEnum("moderation_status")
      .default("visible")
      .notNull(),
    isEdited: boolean("is_edited").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("post_thread_idx").on(t.threadId)],
);

export const postVotes = pgTable(
  "post_like",
  {
    fanProfileId: integer("fan_profile_id")
      .references(() => fanProfiles.id, { onDelete: "cascade" })
      .notNull(),
    postId: integer("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    value: integer("value").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.fanProfileId, t.postId] })],
);
