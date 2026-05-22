// src/db/schema/leagues.ts
import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  boolean,
  timestamp,
  serial,
  text,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { fanProfiles } from "./profiles";
import { threads } from "./forum";

export const sportEnum = pgEnum("sport", ["football", "basketball"]);

// src/db/schema/leagues.ts — updated
export const leagueTypeEnum = pgEnum("league_type", [
  "league", // κανονικό πρωτάθλημα, τρέχει κάθε χρόνο
  "tournament", // World Cup, Euro — περιοδικό
]);

export const leagues = pgTable("league", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sport: sportEnum("sport").notNull(),
  type: leagueTypeEnum("type").default("league").notNull(),
  logoUrl: text("logo_url"),
  displayOrder: integer("display_order").default(0).notNull(),
  // Tournament-specific fields
  isActive: boolean("is_active").default(true).notNull(), // false = κρυφό από UI
  activeFrom: timestamp("active_from"), // πότε ξεκινά
  activeTo: timestamp("active_to"), // πότε τελειώνει
});

export const teams = pgTable(
  "team",
  {
    id: serial("id").primaryKey(),
    leagueId: integer("league_id")
      .references(() => leagues.id)
      .notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logoUrl: text("logo_url"),
    group: text("group"), // "north" | "south" | null για leagues χωρίς όμιλους
  },
  (t) => [index("team_league_idx").on(t.leagueId)],
);

export const leagueRelations = relations(leagues, ({ many }) => ({
  teams: many(teams),
  fanProfiles: many(fanProfiles),
  threads: many(threads),
}));

export const teamRelations = relations(teams, ({ one, many }) => ({
  league: one(leagues, { fields: [teams.leagueId], references: [leagues.id] }),
  fanProfiles: many(fanProfiles),
}));
