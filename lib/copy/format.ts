import { feedCopy } from "@/lib/copy/feed";
import { seoCopy } from "@/lib/copy/seo";

export function pageTitle(
  segment: string,
  siteName: string = seoCopy.site.name,
): string {
  return `${segment} | ${siteName}`;
}

export function formatReplyCount(count: number): string {
  return `${count} ${feedCopy.thread.replies}`;
}
