import Link from "next/link";

import type { NotificationItem } from "@/components/layout/site-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const t = copy.notifications.page;

interface NotificationsListProps {
  items: NotificationItem[];
  emptyMessage?: string;
}

function NotificationRow({ item }: { item: NotificationItem }) {
  const content = (
    <>
      <Avatar size="sm">
        <AvatarFallback className="text-[10px]">
          {item.actorInitials ?? "?"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">{item.text}</p>
        <p className="text-muted-foreground text-xs">{item.time}</p>
      </div>
      {item.isRead === false && (
        <span
          className="bg-primary mt-2 size-2 shrink-0 rounded-full"
          aria-hidden="true"
        />
      )}
    </>
  );

  const className = cn(
    "flex items-start gap-2.5 px-3 py-3",
    item.isRead === false && "bg-muted/50",
    item.href && "transition-colors hover:bg-muted/50",
  );

  if (item.href) {
    return (
      <li>
        <Link href={item.href} className={className}>
          {content}
        </Link>
      </li>
    );
  }

  return <li className={className}>{content}</li>;
}

export function NotificationsList({
  items,
  emptyMessage = t.empty,
}: NotificationsListProps) {
  if (items.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="divide-border border-border divide-y rounded-lg border">
      {items.map((item) => (
        <NotificationRow key={item.id} item={item} />
      ))}
    </ul>
  );
}
