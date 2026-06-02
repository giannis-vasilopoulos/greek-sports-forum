// src/db/schema/profiles.ts
import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { leagues, teams } from "./leagues";
import { threads, posts, postVotes } from "./forum";

export const trustStatusEnum = pgEnum("trust_status", [
  "normal",
  "watch",
  "probable_troll",
]);

export const fanProfiles = pgTable(
  "fan_profile",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    leagueId: integer("league_id")
      .references(() => leagues.id)
      .notNull(),
    favoriteTeamId: integer("favorite_team_id")
      .references(() => teams.id)
      .notNull(),
    displayName: text("display_name").notNull(),
    bio: text("bio"),
    reputation: integer("reputation").default(0).notNull(),
    trustStatus: trustStatusEnum("trust_status").default("normal").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique("uq_fan_profile_user_league").on(t.userId, t.leagueId),
    unique("uq_fan_profile_name_league").on(t.displayName, t.leagueId),
    index("fp_user_idx").on(t.userId),
    index("fp_league_idx").on(t.leagueId),
  ],
);

export const fanProfileRelations = relations(fanProfiles, ({ one, many }) => ({
  user: one(user, { fields: [fanProfiles.userId], references: [user.id] }),
  league: one(leagues, {
    fields: [fanProfiles.leagueId],
    references: [leagues.id],
  }),
  favoriteTeam: one(teams, {
    fields: [fanProfiles.favoriteTeamId],
    references: [teams.id],
  }),
  threads: many(threads),
  posts: many(posts),
  postVotes: many(postVotes),
}));
