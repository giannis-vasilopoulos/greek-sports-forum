import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { fanProfiles } from "./profiles";
import { leagues } from "./leagues";
import { posts } from "./forum";

export const postReportReasonEnum = pgEnum("post_report_reason", [
  "spam",
  "harassment",
  "off_topic",
  "other",
]);

export const sanctionTypeEnum = pgEnum("sanction_type", [
  "warning",
  "slow_mode",
  "shadow_ban",
  "league_ban",
  "account_ban",
]);

export const reputationEventTypeEnum = pgEnum("reputation_event_type", [
  "post_liked",
  "thread_liked",
  "best_answer",
  "post_downvoted",
  "post_removed",
  "warning_received",
  "report_confirmed",
]);

export const postReports = pgTable(
  "post_report",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    reporterFanProfileId: integer("reporter_fan_profile_id")
      .references(() => fanProfiles.id, { onDelete: "cascade" })
      .notNull(),
    reason: postReportReasonEnum("reason").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique("post_report_post_reporter_uq").on(t.postId, t.reporterFanProfileId),
    index("post_report_post_idx").on(t.postId),
  ],
);

export const moderationSanctions = pgTable(
  "moderation_sanction",
  {
    id: serial("id").primaryKey(),
    fanProfileId: integer("fan_profile_id")
      .references(() => fanProfiles.id, { onDelete: "cascade" })
      .notNull(),
    leagueId: integer("league_id").references(() => leagues.id),
    type: sanctionTypeEnum("type").notNull(),
    issuedByUserId: text("issued_by_user_id")
      .references(() => user.id)
      .notNull(),
    reason: text("reason").notNull(),
    startsAt: timestamp("starts_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("moderation_sanction_profile_idx").on(t.fanProfileId),
    index("moderation_sanction_league_idx").on(t.leagueId),
  ],
);

export const reputationEvents = pgTable(
  "reputation_event",
  {
    id: serial("id").primaryKey(),
    fanProfileId: integer("fan_profile_id")
      .references(() => fanProfiles.id, { onDelete: "cascade" })
      .notNull(),
    eventType: reputationEventTypeEnum("event_type").notNull(),
    delta: integer("delta").notNull(),
    scoreAfter: integer("score_after").notNull(),
    postId: integer("post_id").references(() => posts.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("reputation_event_profile_idx").on(t.fanProfileId)],
);

export const postReportRelations = relations(postReports, ({ one }) => ({
  post: one(posts, { fields: [postReports.postId], references: [posts.id] }),
  reporter: one(fanProfiles, {
    fields: [postReports.reporterFanProfileId],
    references: [fanProfiles.id],
  }),
}));

export const moderationSanctionRelations = relations(
  moderationSanctions,
  ({ one }) => ({
    fanProfile: one(fanProfiles, {
      fields: [moderationSanctions.fanProfileId],
      references: [fanProfiles.id],
    }),
    league: one(leagues, {
      fields: [moderationSanctions.leagueId],
      references: [leagues.id],
    }),
    issuedBy: one(user, {
      fields: [moderationSanctions.issuedByUserId],
      references: [user.id],
    }),
  }),
);

export const reputationEventRelations = relations(
  reputationEvents,
  ({ one }) => ({
    fanProfile: one(fanProfiles, {
      fields: [reputationEvents.fanProfileId],
      references: [fanProfiles.id],
    }),
    post: one(posts, {
      fields: [reputationEvents.postId],
      references: [posts.id],
    }),
  }),
);
