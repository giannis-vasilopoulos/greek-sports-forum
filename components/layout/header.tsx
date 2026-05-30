"use client";

import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

import { HeaderNav } from "@/components/layout/header-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Notifications } from "@/components/layout/notifications";
import { mockNotifications } from "@/components/layout/site-mock-data";
import type { HeaderProps } from "@/components/layout/site-data";
import {
  getInitials,
  getLeagueHref,
  getLeagueSlug,
} from "@/components/layout/site-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Header({
  user,
  activeFanProfile,
  fanProfiles = [],
  unreadNotifications = 0,
  hasLiveMatches = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-[52px] border-b border-border bg-background md:h-14">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4">
        <Link
          href="/"
          className="shrink-0 font-heading text-lg font-bold tracking-wide text-primary"
        >
          ΚΕΡΚΙΔΑ
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <HeaderNav hasLiveMatches={hasLiveMatches} />
        </div>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          {activeFanProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "hidden items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium transition-colors hover:bg-muted/80 md:inline-flex",
                  )}
                  aria-label={`Ενεργό league: ${activeFanProfile.leagueName}`}
                >
                  <span aria-hidden="true">{activeFanProfile.teamEmoji}</span>
                  <span>{activeFanProfile.leagueName}</span>
                  <ChevronDownIcon className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Αλλαγή fan profile
                </p>
                {fanProfiles.map((profile) => (
                  <DropdownMenuItem key={profile.leagueName} asChild>
                    <Link
                      href={getLeagueHref(getLeagueSlug(profile.leagueName))}
                      className="flex items-center gap-2"
                    >
                      <span aria-hidden="true">{profile.teamEmoji}</span>
                      <span className="flex-1">{profile.leagueName}</span>
                      <span className="text-xs text-muted-foreground">
                        {profile.teamName}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="hidden md:block">
            {/* Mock data — replace when notifications are wired to API */}
            <Notifications
              unreadCount={unreadNotifications}
              items={mockNotifications}
            />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden rounded-full md:inline-flex"
                  aria-label="Μενού χρήστη"
                >
                  <Avatar size="sm">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Το προφίλ μου</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/fan-profiles">Τα fan profiles μου</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Ρυθμίσεις</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Αποσύνδεση</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
