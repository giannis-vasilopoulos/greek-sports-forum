CREATE TYPE "public"."role" AS ENUM('user', 'moderator', 'admin');--> statement-breakpoint
CREATE TYPE "public"."sport" AS ENUM('football', 'basketball');--> statement-breakpoint
CREATE TYPE "public"."thread_type" AS ENUM('discussion', 'match_thread', 'news', 'poll');--> statement-breakpoint
CREATE TYPE "public"."notif_type" AS ENUM('reply', 'like', 'mention', 'match_starting');--> statement-breakpoint
CREATE TABLE "league" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sport" "sport" NOT NULL,
	"logo_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "league_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	CONSTRAINT "team_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "fan_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"league_id" integer NOT NULL,
	"favorite_team_id" integer,
	"display_name" text NOT NULL,
	"bio" text,
	"reputation" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_fan_profile_user_league" UNIQUE("user_id","league_id"),
	CONSTRAINT "uq_fan_profile_name_league" UNIQUE("display_name","league_id")
);
--> statement-breakpoint
CREATE TABLE "post_like" (
	"fan_profile_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_like_fan_profile_id_post_id_pk" PRIMARY KEY("fan_profile_id","post_id")
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"thread_id" integer NOT NULL,
	"fan_profile_id" integer NOT NULL,
	"parent_id" integer,
	"content" text NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"is_edited" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread" (
	"id" serial PRIMARY KEY NOT NULL,
	"fan_profile_id" integer NOT NULL,
	"league_id" integer NOT NULL,
	"title" text NOT NULL,
	"type" "thread_type" DEFAULT 'discussion' NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"last_activity_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "notif_type" NOT NULL,
	"payload" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_profile" ADD CONSTRAINT "fan_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_profile" ADD CONSTRAINT "fan_profile_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_profile" ADD CONSTRAINT "fan_profile_favorite_team_id_team_id_fk" FOREIGN KEY ("favorite_team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_fan_profile_id_fan_profile_id_fk" FOREIGN KEY ("fan_profile_id") REFERENCES "public"."fan_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_fan_profile_id_fan_profile_id_fk" FOREIGN KEY ("fan_profile_id") REFERENCES "public"."fan_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread" ADD CONSTRAINT "thread_fan_profile_id_fan_profile_id_fk" FOREIGN KEY ("fan_profile_id") REFERENCES "public"."fan_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread" ADD CONSTRAINT "thread_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "team_league_idx" ON "team" USING btree ("league_id");--> statement-breakpoint
CREATE INDEX "fp_user_idx" ON "fan_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "fp_league_idx" ON "fan_profile" USING btree ("league_id");--> statement-breakpoint
CREATE INDEX "post_thread_idx" ON "post" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "thread_league_activity_idx" ON "thread" USING btree ("league_id","last_activity_at");--> statement-breakpoint
CREATE INDEX "notif_user_unread_idx" ON "notification" USING btree ("user_id","is_read");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");