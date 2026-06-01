import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import type { FeedLeague } from "@/components/feed/feed-data";
import { getLeagueHref } from "@/components/layout/site-data";
import { cn } from "@/lib/utils";

interface LeagueNavItemProps {
  league: FeedLeague;
  active?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export function LeagueNavItem({
  league,
  active = false,
  icon: Icon,
  className,
}: LeagueNavItemProps) {
  return (
    <Link
      href={getLeagueHref(league.slug)}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-[7px] text-[12px] font-medium transition-colors",
        active
          ? "bg-secondary text-primary"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
        className,
      )}
    >
      {Icon ? (
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      ) : (
        <span aria-hidden="true" className="text-sm">
          {league.emoji}
        </span>
      )}
      <span className="truncate">{league.name}</span>
    </Link>
  );
}

interface LeagueNavListProps {
  leagues: FeedLeague[];
  activeSlug?: string;
  className?: string;
}

export function LeagueNavList({
  leagues,
  activeSlug,
  className,
}: LeagueNavListProps) {
  return (
    <nav
      className={cn("flex flex-col gap-0.5", className)}
      aria-label="Leagues"
    >
      {leagues.map((league) => (
        <LeagueNavItem
          key={league.slug}
          league={league}
          active={league.slug === activeSlug}
        />
      ))}
    </nav>
  );
}
