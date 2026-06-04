import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { fanProfiles } from "@/db/schema/profiles";
import { copy } from "@/lib/copy";

const v = copy.validation.profile;

export const fanProfileInsertSchema = createInsertSchema(fanProfiles, {
  leagueId: z.coerce
    .number({ invalid_type_error: v.leagueRequired })
    .int(v.leagueRequired)
    .positive(v.leagueRequired),
  favoriteTeamId: z.coerce
    .number({ invalid_type_error: v.teamInvalid })
    .int(v.teamRequired)
    .positive(v.teamRequired),
  displayName: (schema) => schema.trim().min(2, v.displayNameMinLength),
});
