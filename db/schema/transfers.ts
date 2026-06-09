import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  uniqueIndex,
  index,
  date,
} from "drizzle-orm/pg-core";

import { leagues, teams } from "./leagues";

export const transferRows = pgTable(
  "transfer_row",
  {
    id: serial("id").primaryKey(),
    leagueId: integer("league_id")
      .references(() => leagues.id, { onDelete: "cascade" })
      .notNull(),
    playerName: text("player_name").notNull(),
    fromTeamId: integer("from_team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    toTeamId: integer("to_team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    fromTeamName: text("from_team_name").notNull(),
    toTeamName: text("to_team_name").notNull(),
    transferDate: date("transfer_date").notNull(),
    feeText: text("fee_text"),
    season: text("season").notNull(),
    syncedAt: timestamp("synced_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("transfer_row_league_player_to_date_uidx").on(
      t.leagueId,
      t.playerName,
      t.toTeamName,
      t.transferDate,
    ),
    index("transfer_row_league_season_date_idx").on(
      t.leagueId,
      t.season,
      t.transferDate,
    ),
    index("transfer_row_from_team_id_idx").on(t.fromTeamId),
    index("transfer_row_to_team_id_idx").on(t.toTeamId),
  ],
);
