import { z } from "zod";

import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
  signInPasswordSchema,
  usernameSchema,
} from "@/lib/validation/fields";

export const signUpSchema = z.object({
  name: fullNameSchema,
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
