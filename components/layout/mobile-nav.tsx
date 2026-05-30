"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { mockNotifications } from "@/components/layout/site-mock-data";
import type { FanProfile, HeaderProps } from "@/components/layout/site-data";
import {
  LEAGUES,
  NAV_LINKS,
  getInitials,
  getLeagueHref,
  getLeagueSlug,
} from "@/components/layout/site-data";
import { Notifications } from "@/components/layout/notifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user?: HeaderProps["user"];
  activeFanProfile?: FanProfile;
  fanProfiles?: FanProfile[];
  unreadNotifications?: number;
  hasLiveMatches?: boolean;
}

export function MobileNav({
  user,
  activeFanProfile,
  fanProfiles = [],
  unreadNotifications = 0,
  hasLiveMatches = false,
}: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const closeAndNavigate = () => setOpen(false);

  return (
    <div className="flex items-center gap-1 md:hidden">
      {/* Mock data — replace when notifications are wired to API */}
      <Notifications
        unreadCount={unreadNotifications}
        items={mockNotifications}
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Άνοιγμα μενού">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-xs overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              <Link
                href="/"
                onClick={closeAndNavigate}
                className="text-base font-bold tracking-wide"
              >
                ΚΕΡΚΙΔΑ
              </Link>
            </SheetTitle>
          </SheetHeader>

          {activeFanProfile && fanProfiles.length > 0 && (
            <div className="px-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Ενεργό fan profile
              </p>
              <div className="flex flex-col gap-1">
                {fanProfiles.map((profile) => (
                  <Link
                    key={profile.leagueName}
                    href={getLeagueHref(getLeagueSlug(profile.leagueName))}
                    onClick={closeAndNavigate}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted",
                      profile.leagueName === activeFanProfile.leagueName &&
                        "bg-muted",
                    )}
                  >
                    <span aria-hidden="true">{profile.teamEmoji}</span>
                    <span className="font-medium">{profile.leagueName}</span>
                    <span className="text-muted-foreground">
                      {profile.teamName}
                    </span>
                  </Link>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          )}

          <nav className="flex flex-col gap-1 px-4">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Leagues
            </p>
            {LEAGUES.map((league) => (
              <Link
                key={league.slug}
                href={getLeagueHref(league.slug)}
                onClick={closeAndNavigate}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted",
                  isActive(getLeagueHref(league.slug)) && "bg-muted",
                )}
              >
                <span aria-hidden="true">{league.emoji}</span>
                {league.name}
              </Link>
            ))}
          </nav>

          <Separator className="my-4" />

          <nav className="flex flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeAndNavigate}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted",
                  isActive(link.href) && "bg-muted",
                )}
              >
                {link.label}
                {link.liveIndicator && hasLiveMatches && (
                  <span
                    className="size-2 shrink-0 rounded-full bg-destructive animate-pulse"
                    aria-label="Ζωντανά ματς"
                  />
                )}
              </Link>
            ))}
          </nav>

          <Separator className="my-4" />

          <div className="px-4 pb-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    {user.username && (
                      <p className="text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    )}
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/profile"
                    onClick={closeAndNavigate}
                    className="rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    Το προφίλ μου
                  </Link>
                  <Link
                    href="/fan-profiles"
                    onClick={closeAndNavigate}
                    className="rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    Τα fan profiles μου
                  </Link>
                  <Link
                    href="/settings"
                    onClick={closeAndNavigate}
                    className="rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    Ρυθμίσεις
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted"
                  >
                    Αποσύνδεση
                  </button>
                </nav>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in" onClick={closeAndNavigate}>
                    Σύνδεση
                  </Link>
                </Button>
                <Button variant="cta" asChild>
                  <Link href="/sign-up" onClick={closeAndNavigate}>
                    Εγγραφή
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
