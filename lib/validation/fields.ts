import { z } from "zod";

const USERNAME_CHARSET = /^[a-zA-Z0-9_]+$/;

/** Avoid deprecated `z.string().email()` (Zod 4 top-level `z.email()` not in v3 default export). */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Συμπλήρωσε το email σου.")
  .refine((value) => EMAIL_PATTERN.test(value), {
    message: "Μη έγκυρο email.",
  });

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Το όνομα χρήστη πρέπει να έχει 3–30 χαρακτήρες.")
  .max(30, "Το όνομα χρήστη πρέπει να έχει 3–30 χαρακτήρες.")
  .regex(
    USERNAME_CHARSET,
    "Μόνο λατινικά γράμματα, αριθμοί και _ (χωρίς κενά ή τελείες).",
  );

const PASSWORD_RULES: Array<{
  test: (value: string) => boolean;
  message: string;
}> = [
  {
    test: (value) => value.length >= 8,
    message: "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.",
  },
  {
    test: (value) => /[a-z]/.test(value),
    message: "Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα πεζό γράμμα.",
  },
  {
    test: (value) => /[A-Z]/.test(value),
    message: "Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα κεφαλαίο γράμμα.",
  },
  {
    test: (value) => /[0-9]/.test(value),
    message: "Ο κωδικός πρέπει να περιέχει τουλάχιστον έναν αριθμό.",
  },
  {
    test: (value) => /[^A-Za-z0-9]/.test(value),
    message: "Ο κωδικός πρέπει να περιέχει τουλάχιστον έναν ειδικό χαρακτήρα.",
  },
];

export const passwordSchema = z.string().superRefine((value, ctx) => {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: rule.message });
      return;
    }
  }
});

export const signInPasswordSchema = z
  .string()
  .min(1, "Συμπλήρωσε τον κωδικό σου.");

export const PASSWORD_REQUIREMENTS_DESCRIPTION =
  "Τουλάχιστον 8 χαρακτήρες, ένα πεζό, ένα κεφαλαίο, έναν αριθμό και έναν ειδικό χαρακτήρα.";

export function isValidUsername(value: string): boolean {
  return usernameSchema.safeParse(value).success;
}

export function isValidPassword(value: string): boolean {
  return passwordSchema.safeParse(value).success;
}
