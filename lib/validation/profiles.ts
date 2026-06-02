import { z } from "zod";

import { copy } from "@/lib/copy";

const v = copy.validation.profile;

export const createFanProfileSchema = z.object({
  leagueId: z.coerce
    .number({ invalid_type_error: v.leagueRequired })
    .int(v.leagueRequired)
    .positive(v.leagueRequired),
  favoriteTeamId: z.coerce
    .number({ invalid_type_error: v.teamInvalid })
    .int(v.teamRequired)
    .positive(v.teamRequired),
  displayName: z.string().trim().min(2, v.displayNameMinLength),
});

export type CreateFanProfileInput = z.output<typeof createFanProfileSchema>;
export type CreateFanProfileFormValues = z.input<typeof createFanProfileSchema>;
