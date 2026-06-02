UPDATE "fan_profile" AS fp
SET "favorite_team_id" = (
  SELECT t.id
  FROM "team" AS t
  WHERE t.league_id = fp.league_id
  ORDER BY t.id
  LIMIT 1
)
WHERE fp.favorite_team_id IS NULL;--> statement-breakpoint
ALTER TABLE "fan_profile" ALTER COLUMN "favorite_team_id" SET NOT NULL;
