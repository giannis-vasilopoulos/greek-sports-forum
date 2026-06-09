import Link from "next/link";

import { EntityLogo } from "@/components/brand/entity-logo";
import type { LeagueTabOption } from "@/lib/leagues/queries";
import { cn } from "@/lib/utils";

interface LeaguePillTabsProps {
  leagues: LeagueTabOption[];
  activeSlug: string;
  hrefForSlug: (slug: string) => string;
  ariaLabel: string;
  className?: string;
}

export function LeaguePillTabs({
  leagues,
  activeSlug,
  hrefForSlug,
  ariaLabel,
  className,
}: LeaguePillTabsProps) {
  return (
    <nav
      className={cn("flex flex-wrap gap-2", className)}
      aria-label={ariaLabel}
    >
      {leagues.map((league) => {
        const isActive = league.slug === activeSlug;
        return (
          <Link
            key={league.slug}
            href={hrefForSlug(league.slug)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
              isActive
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <EntityLogo
              src={league.logoUrl}
              alt={`Λογότυπο ${league.name}`}
              fallback={league.emoji}
              size="xs"
            />
            {league.name}
          </Link>
        );
      })}
    </nav>
  );
}
