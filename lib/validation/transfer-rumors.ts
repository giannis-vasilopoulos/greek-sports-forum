import { z } from "zod";

import { copy } from "@/lib/copy";

const v = copy.validation.transferRumor;

export const createTransferRumorSchema = z.object({
  leagueSlug: z.string().trim().min(1),
  teamId: z.coerce
    .number({ invalid_type_error: v.teamRequired })
    .int(v.teamRequired)
    .positive(v.teamRequired),
  title: z.string().trim().min(3, v.titleMinLength).max(200, v.titleMaxLength),
  body: z.string().trim().min(10, v.bodyMinLength).max(5000, v.bodyMaxLength),
});

export type CreateTransferRumorInput = z.output<
  typeof createTransferRumorSchema
>;
export type CreateTransferRumorFormValues = z.input<
  typeof createTransferRumorSchema
>;
