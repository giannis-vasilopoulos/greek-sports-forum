import { authCopy } from "@/lib/copy/auth";
import { commonCopy } from "@/lib/copy/common";
import { validationCopy } from "@/lib/copy/validation";

export const copy = {
  common: commonCopy,
  validation: validationCopy,
  auth: authCopy,
} as const;

export type Copy = typeof copy;
