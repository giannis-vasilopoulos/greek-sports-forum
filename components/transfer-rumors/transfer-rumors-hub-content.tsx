import Link from "next/link";

import { TeamPickerHub } from "@/components/leagues/team-picker-hub";
import { SubmitRumorForm } from "@/components/transfer-rumors/submit-rumor-form";
import type { LeagueTabOption } from "@/lib/leagues/queries";
import type { HubTeamOption } from "@/lib/transfers/page-data";
import { teamTransferRumorsPath, transfersPath } from "@/lib/seo/paths";
import { copy } from "@/lib/copy";

interface TransferRumorsHubContentProps {
  leagues: LeagueTabOption[];
  activeSlug: string;
  activeLeagueName: string;
  teams: HubTeamOption[];
  isSignedIn: boolean;
  hasFanProfileForLeague: boolean;
}

export function TransferRumorsHubContent({
  leagues,
  activeSlug,
  activeLeagueName,
  teams,
  isSignedIn,
  hasFanProfileForLeague,
}: TransferRumorsHubContentProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        {copy.transferRumors.pageTitle}
      </h1>
      <p className="text-muted-foreground mb-2 text-sm">{activeLeagueName}</p>
      <p className="text-muted-foreground mb-2 text-sm">
        {copy.transferRumors.hubSubtitle}
      </p>
      <Link
        href={transfersPath()}
        className="text-primary mb-6 inline-block text-sm font-medium hover:underline"
      >
        {copy.transferRumors.crossLinkTransfers}
      </Link>

      <TeamPickerHub
        leagues={leagues}
        activeSlug={activeSlug}
        teams={teams}
        basePath="/transfer-rumors"
        hrefForTeam={teamTransferRumorsPath}
        leagueTabsAriaLabel={copy.transferRumors.leagueTabsAriaLabel}
        teamGridAriaLabel={copy.transferRumors.teamGridAriaLabel}
        middleSlot={
          <SubmitRumorForm
            leagueSlug={activeSlug}
            teams={teams}
            isSignedIn={isSignedIn}
            hasFanProfileForLeague={hasFanProfileForLeague}
          />
        }
      />
    </div>
  );
}
