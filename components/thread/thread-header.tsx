import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import type { ThreadDetail } from "@/lib/forum/queries/thread-detail";
import { copy, formatReplyCount } from "@/lib/copy";
import { leagueThreadsPath, leaguePath } from "@/lib/seo/paths";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const t = copy.feed.thread;
const th = copy.thread.header;

const TYPE_LABELS: Record<ThreadDetail["type"], string> = {
  match_thread: t.typeMatch,
  discussion: t.typeDiscussion,
  news: t.typeNews,
  poll: t.typePoll,
  transfer_rumor: t.typeTransferRumor,
};

interface ThreadHeaderProps {
  thread: ThreadDetail;
  className?: string;
}

export function ThreadHeader({ thread, className }: ThreadHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      <nav
        aria-label="Breadcrumb"
        className="text-muted-foreground flex flex-wrap items-center gap-1 text-[11px]"
      >
        <Link
          href={leaguePath(thread.leagueSlug)}
          className="hover:text-foreground transition-colors"
        >
          {thread.leagueName}
        </Link>
        <ChevronRightIcon className="size-3" aria-hidden="true" />
        <Link
          href={leagueThreadsPath(thread.leagueSlug)}
          className="hover:text-foreground transition-colors"
        >
          {copy.thread.breadcrumb.threads}
        </Link>
        <ChevronRightIcon className="size-3" aria-hidden="true" />
        <span className="text-foreground truncate font-medium">
          {thread.title}
        </span>
      </nav>

      <div className="flex flex-wrap items-center gap-2">
        {thread.isLive && (
          <Badge
            variant="destructive"
            className="live-pulse h-4 px-1.5 text-[10px] font-medium"
          >
            {t.live}
          </Badge>
        )}
        <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
          {TYPE_LABELS[thread.type]}
        </Badge>
        {thread.isLocked && (
          <Badge variant="outline" className="h-4 px-1.5 text-[10px]">
            {th.locked}
          </Badge>
        )}
      </div>

      <h1 className="text-foreground text-[18px] leading-snug font-medium">
        {thread.title}
      </h1>

      <p className="text-muted-foreground text-[11px]">
        {thread.authorName} · {formatReplyCount(thread.replyCount)} ·{" "}
        {th.activeAgo(thread.lastActivity)}
      </p>
    </header>
  );
}
