"use client";

import Link from "next/link";
import { BellIcon } from "lucide-react";

import type { NotificationItem } from "@/components/layout/site-data";
import { notificationsAriaLabel } from "@/lib/copy/layout";
import { copy } from "@/lib/copy";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const t = copy.notifications.popover;

interface NotificationsProps {
  unreadCount?: number;
  items?: NotificationItem[];
}

export function Notifications({
  unreadCount = 0,
  items = [],
}: NotificationsProps) {
  const displayItems = items.slice(0, 5);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={notificationsAriaLabel(unreadCount)}
        >
          <BellIcon />
          {unreadCount > 0 && (
            <span
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive live-pulse"
              aria-hidden="true"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-3 py-2.5">
          <p className="text-sm font-medium">{t.title}</p>
        </div>
        <Separator />
        {displayItems.length === 0 ? (
          <p className="px-3 py-4 text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <ul className="flex flex-col">
            {displayItems.map((item) => {
              const row = (
                <>
                  <Avatar size="sm">
                    <AvatarFallback className="text-[10px]">
                      {item.actorInitials ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </>
              );

              return (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-start gap-2.5 px-3 py-2.5 hover:bg-muted/50",
                        item.isRead === false && "bg-muted/30",
                      )}
                    >
                      {row}
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        "flex items-start gap-2.5 px-3 py-2.5",
                        item.isRead === false && "bg-muted/30",
                      )}
                    >
                      {row}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <Separator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/notifications">{t.viewAll}</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
