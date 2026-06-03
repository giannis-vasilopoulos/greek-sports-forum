CREATE TABLE "standing_row" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer NOT NULL,
	"team_id" integer,
	"team_name" text NOT NULL,
	"season" text NOT NULL,
	"rank" integer NOT NULL,
	"points" integer NOT NULL,
	"played" integer,
	"won" integer,
	"drawn" integer,
	"lost" integer,
	"goals_for" integer,
	"goals_against" integer,
	"synced_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "standing_row" ADD CONSTRAINT "standing_row_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "standing_row" ADD CONSTRAINT "standing_row_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "standing_row_league_season_rank_uidx" ON "standing_row" USING btree ("league_id","season","rank");
--> statement-breakpoint
CREATE INDEX "standing_row_league_season_idx" ON "standing_row" USING btree ("league_id","season");
