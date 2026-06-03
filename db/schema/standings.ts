import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { leagues, teams } from "./leagues";

export const standingRows = pgTable(
  "standing_row",
  {
    id: serial("id").primaryKey(),
    leagueId: integer("league_id")
      .references(() => leagues.id, { onDelete: "cascade" })
      .notNull(),
    teamId: integer("team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    teamName: text("team_name").notNull(),
    season: text("season").notNull(),
    rank: integer("rank").notNull(),
    points: integer("points").notNull(),
    played: integer("played"),
    won: integer("won"),
    drawn: integer("drawn"),
    lost: integer("lost"),
    goalsFor: integer("goals_for"),
    goalsAgainst: integer("goals_against"),
    syncedAt: timestamp("synced_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("standing_row_league_season_rank_uidx").on(
      t.leagueId,
      t.season,
      t.rank,
    ),
    index("standing_row_league_season_idx").on(t.leagueId, t.season),
  ],
);
