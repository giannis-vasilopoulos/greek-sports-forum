"use client";

import Link from "next/link";
import { BellIcon } from "lucide-react";

import type { NotificationItem } from "@/components/layout/site-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

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
          aria-label={`Ειδοποιήσεις${unreadCount > 0 ? `, ${unreadCount} αδιάβαστες` : ""}`}
        >
          <BellIcon />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 size-4 min-w-4 justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-3 py-2.5">
          <p className="text-sm font-medium">Ειδοποιήσεις</p>
        </div>
        <Separator />
        {displayItems.length === 0 ? (
          <p className="px-3 py-4 text-sm text-muted-foreground">
            Δεν υπάρχουν ειδοποιήσεις
          </p>
        ) : (
          <ul className="flex flex-col">
            {displayItems.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-muted/50"
              >
                <Avatar size="sm">
                  <AvatarFallback className="text-[10px]">
                    {item.actorInitials ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Separator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/notifications">Δες όλες</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
