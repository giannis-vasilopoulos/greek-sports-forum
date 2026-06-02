import Link from "next/link";

import { LeagueNavList } from "@/components/feed/league-nav-item";
import type { FeedLeague } from "@/components/feed/feed-data";
import type { FanProfile } from "@/components/layout/site-data";
import { getInitials } from "@/components/layout/site-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface LeftSidebarProps {
  leagues: FeedLeague[];
  activeSlug?: string;
  user?: { name: string; image?: string; username?: string };
  activeFanProfile?: FanProfile;
  className?: string;
}

export function LeftSidebar({
  leagues,
  activeSlug,
  user,
  activeFanProfile,
  className,
}: LeftSidebarProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {user && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Avatar size="md">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="text-[10px]">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium">
                {user.username ?? user.name}
              </p>
              {activeFanProfile && (
                <p className="truncate text-[11px] text-muted-foreground">
                  {activeFanProfile.teamEmoji} {activeFanProfile.teamName}
                </p>
              )}
            </div>
          </div>
          <Link
            href="/profile"
            className="text-[11px] font-medium text-primary hover:underline"
          >
            {copy.feed.sidebar.viewProfile}
          </Link>
        </div>
      )}

      <div>
        <p className="section-label mb-2 px-2">Leagues</p>
        <LeagueNavList leagues={leagues} activeSlug={activeSlug} />
      </div>
    </div>
  );
}
