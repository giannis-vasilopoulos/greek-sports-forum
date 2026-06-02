import { z } from "zod";

import { copy } from "@/lib/copy";
import {
  emailSchema,
  passwordSchema,
  signInPasswordSchema,
  usernameSchema,
} from "@/lib/validation/fields";

const v = copy.validation;

export const signUpSchema = z.object({
  name: z.string().trim().min(1, v.name.required).max(100, v.name.tooLong),
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
