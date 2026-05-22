CREATE TYPE "public"."league_type" AS ENUM('league', 'tournament');--> statement-breakpoint
ALTER TABLE "league" ADD COLUMN "type" "league_type" DEFAULT 'league' NOT NULL;--> statement-breakpoint
ALTER TABLE "league" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "league" ADD COLUMN "active_from" timestamp;--> statement-breakpoint
ALTER TABLE "league" ADD COLUMN "active_to" timestamp;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "group" text;