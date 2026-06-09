import { relations } from "drizzle-orm";

import { user, session, account } from "./auth";
import { notifications } from "./notifications";
import { fanProfiles } from "./profiles";
import { leagues, teams } from "./leagues";
import { threads, posts, postVotes } from "./forum";
import { standingRows } from "./standings";
import { transferRows } from "./transfers";
import {
  postReports,
  moderationSanctions,
  reputationEvents,
} from "./moderation";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  fanProfiles: many(fanProfiles),
  notifications: many(notifications),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(user, { fields: [notifications.userId], references: [user.id] }),
}));

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

export const leagueRelations = relations(leagues, ({ many }) => ({
  teams: many(teams),
  fanProfiles: many(fanProfiles),
  threads: many(threads),
  standingRows: many(standingRows),
  transferRows: many(transferRows),
}));

export const teamRelations = relations(teams, ({ one, many }) => ({
  league: one(leagues, { fields: [teams.leagueId], references: [leagues.id] }),
  fanProfiles: many(fanProfiles),
}));

export const transferRowRelations = relations(transferRows, ({ one }) => ({
  league: one(leagues, {
    fields: [transferRows.leagueId],
    references: [leagues.id],
  }),
  fromTeam: one(teams, {
    fields: [transferRows.fromTeamId],
    references: [teams.id],
    relationName: "transferFromTeam",
  }),
  toTeam: one(teams, {
    fields: [transferRows.toTeamId],
    references: [teams.id],
    relationName: "transferToTeam",
  }),
}));

export const threadRelations = relations(threads, ({ one, many }) => ({
  fanProfile: one(fanProfiles, {
    fields: [threads.fanProfileId],
    references: [fanProfiles.id],
  }),
  league: one(leagues, {
    fields: [threads.leagueId],
    references: [leagues.id],
  }),
  team: one(teams, {
    fields: [threads.teamId],
    references: [teams.id],
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
  votes: many(postVotes),
}));

export const postVoteRelations = relations(postVotes, ({ one }) => ({
  fanProfile: one(fanProfiles, {
    fields: [postVotes.fanProfileId],
    references: [fanProfiles.id],
  }),
  post: one(posts, { fields: [postVotes.postId], references: [posts.id] }),
}));

export const standingRowRelations = relations(standingRows, ({ one }) => ({
  league: one(leagues, {
    fields: [standingRows.leagueId],
    references: [leagues.id],
  }),
  team: one(teams, {
    fields: [standingRows.teamId],
    references: [teams.id],
  }),
}));

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
