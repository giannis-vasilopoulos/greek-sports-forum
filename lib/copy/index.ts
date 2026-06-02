import { authCopy } from "@/lib/copy/auth";
import { commonCopy } from "@/lib/copy/common";
import { forumCopy } from "@/lib/copy/forum";
import { moderationCopy } from "@/lib/copy/moderation";
import { validationCopy } from "@/lib/copy/validation";

export const copy = {
  common: commonCopy,
  validation: validationCopy,
  auth: authCopy,
  forum: forumCopy,
  moderation: moderationCopy,
} as const;

export type Copy = typeof copy;
