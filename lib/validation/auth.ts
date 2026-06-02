import { z } from "zod";

import {
  emailSchema,
  passwordSchema,
  signInPasswordSchema,
  usernameSchema,
} from "@/lib/validation/fields";

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Συμπλήρωσε το όνομά σου.")
    .max(100, "Το όνομα είναι πολύ μεγάλο."),
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: signInPasswordSchema,
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
