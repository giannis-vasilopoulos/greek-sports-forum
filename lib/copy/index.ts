import { adsCopy } from "@/lib/copy/ads";
import { authCopy } from "@/lib/copy/auth";
import { commonCopy } from "@/lib/copy/common";
import { feedCopy } from "@/lib/copy/feed";
import { forumCopy } from "@/lib/copy/forum";
import { layoutCopy } from "@/lib/copy/layout";
import { moderationCopy } from "@/lib/copy/moderation";
import { seoCopy } from "@/lib/copy/seo";
import { standingsCopy } from "@/lib/copy/standings";
import { validationCopy } from "@/lib/copy/validation";

export { formatReplyCount, pageTitle } from "@/lib/copy/format";

export const copy = {
  common: commonCopy,
  validation: validationCopy,
  auth: authCopy,
  forum: forumCopy,
  moderation: moderationCopy,
  seo: seoCopy,
  layout: layoutCopy,
  feed: feedCopy,
  ads: adsCopy,
  standings: standingsCopy,
} as const;

export type Copy = typeof copy;
