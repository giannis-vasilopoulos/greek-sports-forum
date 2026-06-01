"use client";

import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

import type { FanProfile } from "@/components/layout/site-data";
import {
  getInitials,
  getLeagueHref,
  getLeagueSlug,
} from "@/components/layout/site-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
  const displayName = user.username ?? user.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-[20px] border-[0.5px] border-border bg-background px-2 py-1 transition-colors hover:bg-muted/50",
            className,
          )}
          aria-label="Μενού χρήστη"
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
                "inline-flex items-center gap-0.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground",
              )}
            >
              <span aria-hidden="true">{activeFanProfile.teamEmoji}</span>
              <span className="max-w-[72px] truncate">
                {activeFanProfile.leagueName}
              </span>
            </span>
          )}
          <ChevronDownIcon
            className="size-3 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/profile">Το προφίλ μου</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/fan-profiles">Τα fan profiles μου</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Ρυθμίσεις</Link>
        </DropdownMenuItem>
        {fanProfiles.length > 0 && (
          <>
            <DropdownMenuSeparator />
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
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>Αποσύνδεση</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
