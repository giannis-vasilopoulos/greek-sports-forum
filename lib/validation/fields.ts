import { z } from "zod";

import { copy } from "@/lib/copy";

const USERNAME_CHARSET = /^[a-zA-Z0-9_]+$/;

/** Avoid deprecated `z.string().email()` (Zod 4 top-level `z.email()` not in v3 default export). */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const v = copy.validation;

export const emailSchema = z
  .string()
  .trim()
  .min(1, v.email.required)
  .refine((value) => EMAIL_PATTERN.test(value), {
    message: v.email.invalid,
  });

export const usernameSchema = z
  .string()
  .trim()
  .min(3, v.username.length)
  .max(30, v.username.length)
  .regex(USERNAME_CHARSET, v.username.charset);

/** Letters (incl. Greek), spaces, hyphens, apostrophes — no digits. */
const FULL_NAME_CHARS = /^[\p{L}\s'-]+$/u;

const FULL_NAME_MIN_LENGTH = 4;

function hasFirstAndLastName(value: string): boolean {
  const parts = value.split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((part) => part.length >= 2);
}

export const fullNameSchema = z
  .string()
  .trim()
  .min(1, v.name.required)
  .max(100, v.name.tooLong)
  .refine((value) => value.length >= FULL_NAME_MIN_LENGTH, {
    message: v.name.tooShort,
  })
  .refine((value) => FULL_NAME_CHARS.test(value), {
    message: v.name.invalid,
  })
  .refine(hasFirstAndLastName, {
    message: v.name.incomplete,
  });

const PASSWORD_RULES: Array<{
  test: (value: string) => boolean;
  message: string;
}> = [
  { test: (value) => value.length >= 8, message: v.password.minLength },
  { test: (value) => /[a-z]/.test(value), message: v.password.lowercase },
  { test: (value) => /[A-Z]/.test(value), message: v.password.uppercase },
  { test: (value) => /[0-9]/.test(value), message: v.password.digit },
  { test: (value) => /[^A-Za-z0-9]/.test(value), message: v.password.special },
];

export const passwordSchema = z.string().superRefine((value, ctx) => {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: rule.message });
      return;
    }
  }
});

export const signInPasswordSchema = z.string().min(1, v.password.required);

export const PASSWORD_REQUIREMENTS_DESCRIPTION =
  v.password.requirementsDescription;

export function isValidUsername(value: string): boolean {
  return usernameSchema.safeParse(value).success;
}

export function isValidPassword(value: string): boolean {
  return passwordSchema.safeParse(value).success;
}
