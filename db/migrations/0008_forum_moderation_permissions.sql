CREATE TYPE "public"."match_status" AS ENUM('scheduled', 'live', 'halftime', 'finished', 'postponed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."post_moderation_status" AS ENUM('pending', 'visible', 'removed', 'flagged');--> statement-breakpoint
CREATE TYPE "public"."trust_status" AS ENUM('normal', 'watch', 'probable_troll');--> statement-breakpoint
CREATE TYPE "public"."post_report_reason" AS ENUM('spam', 'harassment', 'off_topic', 'other');--> statement-breakpoint
CREATE TYPE "public"."sanction_type" AS ENUM('warning', 'slow_mode', 'shadow_ban', 'league_ban', 'account_ban');--> statement-breakpoint
CREATE TYPE "public"."reputation_event_type" AS ENUM('post_liked', 'thread_liked', 'best_answer', 'post_downvoted', 'post_removed', 'warning_received', 'report_confirmed');--> statement-breakpoint
ALTER TABLE "thread" ADD COLUMN "team_id" integer;--> statement-breakpoint
ALTER TABLE "thread" ADD COLUMN "match_status" "match_status";--> statement-breakpoint
ALTER TABLE "thread" ADD CONSTRAINT "thread_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "thread_league_team_activity_idx" ON "thread" USING btree ("league_id","team_id","last_activity_at");--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "is_collapsed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "moderation_status" "post_moderation_status" DEFAULT 'visible' NOT NULL;--> statement-breakpoint
ALTER TABLE "post_like" ADD COLUMN "value" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "fan_profile" ADD COLUMN "trust_status" "trust_status" DEFAULT 'normal' NOT NULL;--> statement-breakpoint
CREATE TABLE "post_report" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"reporter_fan_profile_id" integer NOT NULL,
	"reason" "post_report_reason" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "moderation_sanction" (
	"id" serial PRIMARY KEY NOT NULL,
	"fan_profile_id" integer NOT NULL,
	"league_id" integer,
	"type" "sanction_type" NOT NULL,
	"issued_by_user_id" text NOT NULL,
	"reason" text NOT NULL,
	"starts_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"revoked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "reputation_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"fan_profile_id" integer NOT NULL,
	"event_type" "reputation_event_type" NOT NULL,
	"delta" integer NOT NULL,
	"score_after" integer NOT NULL,
	"post_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "post_report" ADD CONSTRAINT "post_report_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_report" ADD CONSTRAINT "post_report_reporter_fan_profile_id_fan_profile_id_fk" FOREIGN KEY ("reporter_fan_profile_id") REFERENCES "public"."fan_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_sanction" ADD CONSTRAINT "moderation_sanction_fan_profile_id_fan_profile_id_fk" FOREIGN KEY ("fan_profile_id") REFERENCES "public"."fan_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_sanction" ADD CONSTRAINT "moderation_sanction_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_sanction" ADD CONSTRAINT "moderation_sanction_issued_by_user_id_user_id_fk" FOREIGN KEY ("issued_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reputation_event" ADD CONSTRAINT "reputation_event_fan_profile_id_fan_profile_id_fk" FOREIGN KEY ("fan_profile_id") REFERENCES "public"."fan_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reputation_event" ADD CONSTRAINT "reputation_event_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "post_report_post_reporter_uq" ON "post_report" USING btree ("post_id","reporter_fan_profile_id");--> statement-breakpoint
CREATE INDEX "post_report_post_idx" ON "post_report" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "moderation_sanction_profile_idx" ON "moderation_sanction" USING btree ("fan_profile_id");--> statement-breakpoint
CREATE INDEX "moderation_sanction_league_idx" ON "moderation_sanction" USING btree ("league_id");--> statement-breakpoint
CREATE INDEX "reputation_event_profile_idx" ON "reputation_event" USING btree ("fan_profile_id");
