import { z } from "zod";

import { copy } from "@/lib/copy";

const v = copy.validation.profile;

function emptyToNull(value: unknown): unknown {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  return value;
}

export const createFanProfileSchema = z.object({
  leagueId: z.coerce
    .number({ invalid_type_error: v.leagueRequired })
    .int(v.leagueRequired)
    .positive(v.leagueRequired),
  favoriteTeamId: z.preprocess(
    emptyToNull,
    z.number({ invalid_type_error: v.teamInvalid }).int().positive().nullable(),
  ),
  displayName: z.string().trim().min(2, v.displayNameMinLength),
});

export type CreateFanProfileInput = z.output<typeof createFanProfileSchema>;
export type CreateFanProfileFormValues = z.input<typeof createFanProfileSchema>;
