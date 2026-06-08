"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { EntityLogo } from "@/components/brand/entity-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import type { FanProfile, HeaderProps } from "@/components/layout/site-data";
import {
  NAV_LINKS,
  getInitials,
  getLeagueHref,
} from "@/components/layout/site-data";
import { useSetActiveFanProfile } from "@/components/profile/use-set-active-fan-profile";
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
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const l = copy.layout;

interface MobileNavProps {
  user?: HeaderProps["user"];
  activeFanProfile?: FanProfile;
  fanProfiles?: FanProfile[];
  unreadNotifications?: number;
  notificationItems?: HeaderProps["notificationItems"];
  hasLiveMatches?: boolean;
  leagues?: Array<{
    slug: string;
    name: string;
    emoji: string;
    logoUrl?: string | null;
  }>;
}

export function MobileNav({
  user,
  activeFanProfile,
  fanProfiles = [],
  unreadNotifications = 0,
  notificationItems = [],
  hasLiveMatches = false,
  leagues = [],
}: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { setActive, pending } = useSetActiveFanProfile();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const closeAndNavigate = () => setOpen(false);

  return (
    <div className="flex items-center gap-1 md:hidden">
      <Notifications
        unreadCount={unreadNotifications}
        items={notificationItems}
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={l.nav.openMenuAria}>
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
                {l.brand}
              </Link>
            </SheetTitle>
          </SheetHeader>

          {activeFanProfile && fanProfiles.length > 0 && (
            <div className="px-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {l.mobileNav.activeFanProfile}
              </p>
              <div className="flex flex-col gap-1">
                {fanProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    disabled={pending || profile.id === activeFanProfile?.id}
                    onClick={() => {
                      setActive(profile.id);
                      closeAndNavigate();
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-60",
                      profile.id === activeFanProfile?.id && "bg-muted",
                    )}
                  >
                    <EntityLogo
                      src={profile.teamLogoUrl}
                      alt=""
                      fallback={profile.teamEmoji}
                      size="xs"
                    />
                    <span className="font-medium">{profile.leagueName}</span>
                    <span className="text-muted-foreground">
                      {profile.teamName}
                    </span>
                  </button>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          )}

          <nav className="flex flex-col gap-1 px-4">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              {l.mobileNav.leaguesHeading}
            </p>
            {leagues.map((league) => (
              <Link
                key={league.slug}
                href={getLeagueHref(league.slug)}
                onClick={closeAndNavigate}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted",
                  isActive(getLeagueHref(league.slug)) && "bg-muted",
                )}
              >
                <EntityLogo
                  src={league.logoUrl}
                  alt={`Λογότυπο ${league.name}`}
                  fallback={league.emoji}
                  size="sm"
                />
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
                    aria-label={l.nav.liveMatchesAria}
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
                    {l.mobileNav.myProfile}
                  </Link>
                  <Link
                    href="/fan-profiles"
                    onClick={closeAndNavigate}
                    className="rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    {l.mobileNav.myFanProfiles}
                  </Link>
                  <Link
                    href="/notifications"
                    onClick={closeAndNavigate}
                    className="rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    {copy.notifications.nav.label}
                  </Link>
                  <Link
                    href="/settings"
                    onClick={closeAndNavigate}
                    className="rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    {l.mobileNav.settings}
                  </Link>
                  <SignOutButton
                    variant="ghost"
                    className="w-full justify-start rounded-lg px-2 py-1.5 text-sm font-normal"
                  />
                </nav>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in" onClick={closeAndNavigate}>
                    {l.header.signIn}
                  </Link>
                </Button>
                <Button variant="cta" asChild>
                  <Link href="/sign-up" onClick={closeAndNavigate}>
                    {l.header.signUp}
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
