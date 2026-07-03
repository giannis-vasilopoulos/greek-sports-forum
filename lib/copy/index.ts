import { adsCopy } from "@/lib/copy/ads";
import { authCopy } from "@/lib/copy/auth";
import { commonCopy } from "@/lib/copy/common";
import { feedCopy } from "@/lib/copy/feed";
import { forumCopy } from "@/lib/copy/forum";
import { layoutCopy } from "@/lib/copy/layout";
import { moderationCopy } from "@/lib/copy/moderation";
import { notificationsCopy } from "@/lib/copy/notifications";
import { profileCopy } from "@/lib/copy/profile";
import { seoCopy } from "@/lib/copy/seo";
import { standingsCopy } from "@/lib/copy/standings";
import { threadCopy } from "@/lib/copy/thread";
import { transferRumorsCopy } from "@/lib/copy/transfer-rumors";
import { transfersCopy } from "@/lib/copy/transfers";
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
  transfers: transfersCopy,
  thread: threadCopy,
  transferRumors: transferRumorsCopy,
  profile: profileCopy,
  notifications: notificationsCopy,
} as const;

export type Copy = typeof copy;
