"use client";

import Link from "next/link";

import { UserPill } from "@/components/feed/user-pill";
import { HeaderNav } from "@/components/layout/header-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Notifications } from "@/components/layout/notifications";
import { mockNotifications } from "@/components/layout/site-mock-data";
import type { HeaderProps } from "@/components/layout/site-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header({
  user,
  activeFanProfile,
  fanProfiles = [],
  unreadNotifications = 0,
  hasLiveMatches = false,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[52px] border-b border-border bg-background",
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4">
        <Link
          href="/"
          className="shrink-0 text-[15px] font-medium tracking-[0.08em] text-foreground"
        >
          ΚΕΡΚΙΔΑ
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <HeaderNav hasLiveMatches={hasLiveMatches} />
        </div>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          {user ? (
            <>
              <div className="hidden md:block">
                <Notifications
                  unreadCount={unreadNotifications}
                  items={mockNotifications}
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
                <Link href="/sign-in">Σύνδεση</Link>
              </Button>
              <Button variant="cta" size="sm" asChild>
                <Link href="/sign-up">Εγγραφή</Link>
              </Button>
            </div>
          )}

          <MobileNav
            user={user}
            activeFanProfile={activeFanProfile}
            fanProfiles={fanProfiles}
            unreadNotifications={unreadNotifications}
            hasLiveMatches={hasLiveMatches}
          />
        </div>
      </div>
    </header>
  );
}
