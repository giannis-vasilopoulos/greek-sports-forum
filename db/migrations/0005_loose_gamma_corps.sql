ALTER TABLE "thread" ADD COLUMN "slug" text;--> statement-breakpoint
UPDATE "thread" SET "slug" = 'thread-' || "id"::text WHERE "slug" IS NULL;--> statement-breakpoint
ALTER TABLE "thread" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "thread_league_slug_idx" ON "thread" USING btree ("league_id","slug");
