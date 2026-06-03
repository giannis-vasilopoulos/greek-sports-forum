import Link from "next/link";

import type { StandingsLeagueOption } from "@/lib/standings/queries";
import { leagueStandingsPath } from "@/lib/seo/paths";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface StandingsLeagueTabsProps {
  leagues: StandingsLeagueOption[];
  activeSlug: string;
  className?: string;
}

export function StandingsLeagueTabs({
  leagues,
  activeSlug,
  className,
}: StandingsLeagueTabsProps) {
  return (
    <nav
      className={cn("flex flex-wrap gap-2", className)}
      aria-label={copy.standings.leagueTabsAriaLabel}
    >
      {leagues.map((league) => {
        const isActive = league.slug === activeSlug;
        return (
          <Link
            key={league.slug}
            href={leagueStandingsPath(league.slug)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
              isActive
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span aria-hidden>{league.emoji}</span>
            {league.name}
          </Link>
        );
      })}
    </nav>
  );
}
