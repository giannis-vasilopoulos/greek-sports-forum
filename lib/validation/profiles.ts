import { z } from "zod";

function emptyToNull(value: unknown): unknown {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  return value;
}

export const createFanProfileSchema = z.object({
  leagueId: z.coerce
    .number({ invalid_type_error: "Επίλεξε πρωτάθλημα." })
    .int("Επίλεξε πρωτάθλημα.")
    .positive("Επίλεξε πρωτάθλημα."),
  favoriteTeamId: z.preprocess(
    emptyToNull,
    z
      .number({ invalid_type_error: "Μη έγκυρη ομάδα." })
      .int()
      .positive()
      .nullable(),
  ),
  displayName: z
    .string()
    .trim()
    .min(2, "Το όνομα εμφάνισης πρέπει να έχει τουλάχιστον 2 χαρακτήρες."),
});

export type CreateFanProfileInput = z.output<typeof createFanProfileSchema>;
export type CreateFanProfileFormValues = z.input<typeof createFanProfileSchema>;
