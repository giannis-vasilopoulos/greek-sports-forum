"use client";

import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import type { FanProfile } from "@/components/layout/site-data";
import { getInitials } from "@/components/layout/site-data";
import { useSetActiveFanProfile } from "@/hooks/profile/use-set-active-fan-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EntityLogo } from "@/components/brand/entity-logo";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const m = copy.layout.mobileNav;

interface UserPillProps {
  user: { name: string; image?: string; username?: string };
  activeFanProfile?: FanProfile;
  fanProfiles?: FanProfile[];
  className?: string;
}

export function UserPill({
  user,
  activeFanProfile,
  fanProfiles = [],
  className,
}: UserPillProps) {
  const { setActive, pending } = useSetActiveFanProfile();
  const displayName = user.username ?? user.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "border-border bg-background hover:bg-muted/50 inline-flex items-center gap-2 rounded-[20px] border-[0.5px] px-2 py-1 transition-colors",
            className,
          )}
          aria-label={copy.feed.userMenu.ariaLabel}
        >
          <Avatar size="md">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback className="text-[10px]">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[100px] truncate text-[12px] font-medium">
            {displayName}
          </span>
          {activeFanProfile && (
            <span
              className={cn(
                "bg-accent text-accent-foreground inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
              )}
            >
              <EntityLogo
                src={activeFanProfile.teamLogoUrl}
                alt=""
                fallback={activeFanProfile.teamEmoji}
                size="xs"
              />
              <span className="max-w-[72px] truncate">
                {activeFanProfile.leagueName}
              </span>
            </span>
          )}
          <ChevronDownIcon
            className="text-muted-foreground size-3 shrink-0"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/profile">{m.myProfile}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/fan-profiles">{m.myFanProfiles}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/notifications">{copy.notifications.nav.label}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">{m.settings}</Link>
        </DropdownMenuItem>
        {fanProfiles.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
              {m.switchFanProfile}
            </p>
            {fanProfiles.map((profile) => (
              <DropdownMenuItem
                key={profile.id}
                disabled={pending || profile.id === activeFanProfile?.id}
                onClick={() => setActive(profile.id)}
              >
                <EntityLogo
                  src={profile.teamLogoUrl}
                  alt=""
                  fallback={profile.teamEmoji}
                  size="xs"
                />
                <div className="flex flex-col gap-1">
                  <span className="flex-1">{profile.teamName}</span>
                  <span className="text-muted-foreground text-xs">
                    {profile.leagueName}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton
            variant="ghost"
            className="h-auto w-full justify-start px-2 py-1.5 text-sm font-normal"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
