import Link from "next/link";
import type { ReactNode } from "react";

import { EntityLogo } from "@/components/brand/entity-logo";
import { LeaguePillTabs } from "@/components/leagues/league-pill-tabs";
import type { LeagueTabOption } from "@/lib/leagues/queries";
import type { HubTeamOption } from "@/lib/transfers/page-data";
import { cn } from "@/lib/utils";

interface TeamPickerHubProps {
  leagues: LeagueTabOption[];
  activeSlug: string;
  teams: HubTeamOption[];
  basePath: string;
  hrefForTeam: (leagueSlug: string, teamUrlSlug: string) => string;
  leagueTabsAriaLabel: string;
  teamGridAriaLabel: string;
  middleSlot?: ReactNode;
  deferred?: boolean;
  unavailableSlot?: ReactNode;
  className?: string;
}

export function TeamPickerHub({
  leagues,
  activeSlug,
  teams,
  basePath,
  hrefForTeam,
  leagueTabsAriaLabel,
  teamGridAriaLabel,
  middleSlot,
  deferred = false,
  unavailableSlot,
  className,
}: TeamPickerHubProps) {
  return (
    <div className={cn(className)}>
      <LeaguePillTabs
        leagues={leagues}
        activeSlug={activeSlug}
        hrefForSlug={(slug) => `${basePath}?league=${slug}`}
        ariaLabel={leagueTabsAriaLabel}
        className="mb-6"
      />

      {middleSlot}

      {deferred && unavailableSlot ? (
        unavailableSlot
      ) : (
        <nav
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          aria-label={teamGridAriaLabel}
        >
          {teams.map((team) => (
            <Link
              key={team.id}
              href={hrefForTeam(activeSlug, team.urlSlug)}
              className="border-border hover:border-primary/40 hover:bg-primary/5 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <EntityLogo src={team.logoUrl} alt="" fallback="⚽" size="xs" />
              <span className="truncate">{team.name}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
