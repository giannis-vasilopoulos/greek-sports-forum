ALTER TYPE "public"."thread_type" ADD VALUE 'transfer_rumor';--> statement-breakpoint
CREATE TABLE "transfer_row" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer NOT NULL,
	"player_name" text NOT NULL,
	"from_team_id" integer,
	"to_team_id" integer,
	"from_team_name" text NOT NULL,
	"to_team_name" text NOT NULL,
	"transfer_date" date NOT NULL,
	"fee_text" text,
	"season" text NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transfer_row" ADD CONSTRAINT "transfer_row_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer_row" ADD CONSTRAINT "transfer_row_from_team_id_team_id_fk" FOREIGN KEY ("from_team_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer_row" ADD CONSTRAINT "transfer_row_to_team_id_team_id_fk" FOREIGN KEY ("to_team_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "transfer_row_league_player_to_date_uidx" ON "transfer_row" USING btree ("league_id","player_name","to_team_name","transfer_date");--> statement-breakpoint
CREATE INDEX "transfer_row_league_season_date_idx" ON "transfer_row" USING btree ("league_id","season","transfer_date");