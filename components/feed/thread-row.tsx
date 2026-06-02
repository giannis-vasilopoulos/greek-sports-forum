import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import type { FeedThread } from "@/components/feed/feed-data";
import { copy, formatReplyCount } from "@/lib/copy";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { threadPath } from "@/lib/seo/paths";
import { cn } from "@/lib/utils";

const t = copy.feed.thread;

const TYPE_LABELS: Record<FeedThread["type"], string> = {
  match_thread: t.typeMatch,
  discussion: t.typeDiscussion,
  news: t.typeNews,
  poll: t.typePoll,
};

interface ThreadRowProps {
  thread: FeedThread;
  className?: string;
}

export function ThreadRow({ thread, className }: ThreadRowProps) {
  const href = threadPath(thread.leagueSlug, thread.id, thread.slug);

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-secondary",
        className,
      )}
    >
      <Avatar size="md">
        <AvatarFallback className="text-[10px]">
          {thread.authorInitials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {thread.isLive && (
            <Badge
              variant="destructive"
              className="h-4 px-1.5 text-[10px] font-medium live-pulse"
            >
              {t.live}
            </Badge>
          )}
          <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
            {TYPE_LABELS[thread.type]}
          </Badge>
        </div>
        <p className="truncate text-[13px] font-medium text-foreground">
          {thread.title}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {thread.authorName} · {thread.leagueName} ·{" "}
          {formatReplyCount(thread.replyCount)} · {thread.lastActivity}
        </p>
      </div>

      <ChevronRightIcon
        className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </Link>
  );
}

interface ThreadRowListProps {
  threads: FeedThread[];
  className?: string;
}

export function ThreadRowList({ threads, className }: ThreadRowListProps) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {threads.map((thread) => (
        <li key={thread.id} className="border-b border-border last:border-b-0">
          <ThreadRow thread={thread} />
        </li>
      ))}
    </ul>
  );
}
