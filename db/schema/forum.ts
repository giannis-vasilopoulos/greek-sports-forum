// src/db/schema/forum.ts
import { relations } from "drizzle-orm";
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
import { leagues } from "./leagues";

export const threadTypeEnum = pgEnum("thread_type", [
  "discussion",
  "match_thread",
  "news",
  "poll",
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
    title: text("title").notNull(),
    type: threadTypeEnum("type").default("discussion").notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    isLocked: boolean("is_locked").default(false).notNull(),
    replyCount: integer("reply_count").default(0).notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("thread_league_activity_idx").on(t.leagueId, t.lastActivityAt)],
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
    parentId: integer("parent_id"), // self-ref για nested replies
    content: text("content").notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    isEdited: boolean("is_edited").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("post_thread_idx").on(t.threadId)],
);

export const postLikes = pgTable(
  "post_like",
  {
    fanProfileId: integer("fan_profile_id")
      .references(() => fanProfiles.id, { onDelete: "cascade" })
      .notNull(),
    postId: integer("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.fanProfileId, t.postId] })],
);

export const threadRelations = relations(threads, ({ one, many }) => ({
  fanProfile: one(fanProfiles, {
    fields: [threads.fanProfileId],
    references: [fanProfiles.id],
  }),
  league: one(leagues, {
    fields: [threads.leagueId],
    references: [leagues.id],
  }),
  posts: many(posts),
}));

export const postRelations = relations(posts, ({ one, many }) => ({
  thread: one(threads, { fields: [posts.threadId], references: [threads.id] }),
  fanProfile: one(fanProfiles, {
    fields: [posts.fanProfileId],
    references: [fanProfiles.id],
  }),
  parent: one(posts, { fields: [posts.parentId], references: [posts.id] }),
  likes: many(postLikes),
}));

export const postLikeRelations = relations(postLikes, ({ one }) => ({
  fanProfile: one(fanProfiles, {
    fields: [postLikes.fanProfileId],
    references: [fanProfiles.id],
  }),
  post: one(posts, { fields: [postLikes.postId], references: [posts.id] }),
}));
