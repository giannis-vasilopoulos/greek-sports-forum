import { StandingsLeagueTabs } from "@/components/standings/standings-league-tabs";
import { StandingsTable } from "@/components/standings/standings-table";
import { StandingsUnavailable } from "@/components/standings/standings-unavailable";
import type {
  StandingsLeagueOption,
  StandingsTableRow,
} from "@/lib/standings/queries";
import { copy } from "@/lib/copy";

interface StandingsPageContentProps {
  leagues: StandingsLeagueOption[];
  activeSlug: string;
  activeLeagueName: string;
  rows: StandingsTableRow[];
  deferred: boolean;
}

export function StandingsPageContent({
  leagues,
  activeSlug,
  activeLeagueName,
  rows,
  deferred,
}: StandingsPageContentProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        {copy.standings.pageTitle}
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">{activeLeagueName}</p>

      <StandingsLeagueTabs
        leagues={leagues}
        activeSlug={activeSlug}
        className="mb-6"
      />

      {deferred ? (
        <StandingsUnavailable />
      ) : (
        <StandingsTable
          rows={rows}
          phaseBreaksAfterRanks={
            activeSlug === "super-league" ? [4, 8] : undefined
          }
        />
      )}
    </div>
  );
}
