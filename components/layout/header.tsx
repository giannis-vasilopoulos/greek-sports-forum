"use client";

import Link from "next/link";

import { UserPill } from "@/components/feed/user-pill";
import { HeaderNav } from "@/components/layout/header-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Notifications } from "@/components/layout/notifications";
import type { HeaderProps } from "@/components/layout/site-data";
import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const l = copy.layout;

export function Header({
  user,
  activeFanProfile,
  fanProfiles = [],
  unreadNotifications = 0,
  notificationItems = [],
  hasLiveMatches = false,
  leagues = [],
}: HeaderProps) {
  return (
    <header
      className={cn(
        "border-border bg-background sticky top-0 z-50 h-[52px] border-b",
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4">
        <Link
          href="/"
          className="text-foreground shrink-0 text-[15px] font-medium tracking-[0.08em]"
        >
          {l.brand}
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <HeaderNav leagues={leagues} hasLiveMatches={hasLiveMatches} />
        </div>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          {user ? (
            <>
              <div className="hidden md:block">
                <Notifications
                  unreadCount={unreadNotifications}
                  items={notificationItems}
                />
              </div>
              <div className="hidden md:block">
                <UserPill
                  user={user}
                  activeFanProfile={activeFanProfile}
                  fanProfiles={fanProfiles}
                />
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-1 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">{l.header.signIn}</Link>
              </Button>
              <Button variant="cta" size="sm" asChild>
                <Link href="/sign-up">{l.header.signUp}</Link>
              </Button>
            </div>
          )}

          <MobileNav
            user={user}
            activeFanProfile={activeFanProfile}
            fanProfiles={fanProfiles}
            unreadNotifications={unreadNotifications}
            notificationItems={notificationItems}
            hasLiveMatches={hasLiveMatches}
            leagues={leagues}
          />
        </div>
      </div>
    </header>
  );
}
