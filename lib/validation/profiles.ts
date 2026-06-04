import type { z } from "zod";

import { fanProfileInsertSchema } from "@/lib/validation/db/fan-profiles";

export const createFanProfileSchema = fanProfileInsertSchema.pick({
  leagueId: true,
  favoriteTeamId: true,
  displayName: true,
});

export type CreateFanProfileInput = z.output<typeof createFanProfileSchema>;
export type CreateFanProfileFormValues = z.input<typeof createFanProfileSchema>;
