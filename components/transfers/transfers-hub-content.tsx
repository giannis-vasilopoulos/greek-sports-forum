import Link from "next/link";

import { TransfersTopAd } from "@/components/ads/slots/content-ad-slots";
import { TeamPickerHub } from "@/components/leagues/team-picker-hub";
import { TransfersUnavailable } from "@/components/transfers/transfers-unavailable";
import type { LeagueTabOption } from "@/lib/leagues/queries";
import type { HubTeamOption } from "@/lib/transfers/page-data";
import {
  leagueTransfersPath,
  teamTransfersPath,
  transferRumorsPath,
} from "@/lib/seo/paths";
import { copy } from "@/lib/copy";

interface TransfersHubContentProps {
  leagues: LeagueTabOption[];
  activeSlug: string;
  activeLeagueName: string;
  teams: HubTeamOption[];
  deferred: boolean;
}

export function TransfersHubContent({
  leagues,
  activeSlug,
  activeLeagueName,
  teams,
  deferred,
}: TransfersHubContentProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        {copy.transfers.pageTitle}
      </h1>
      <p className="text-muted-foreground mb-2 text-sm">{activeLeagueName}</p>
      <p className="text-muted-foreground mb-2 text-sm">
        {copy.transfers.hubSubtitle}
      </p>
      <Link
        href={transferRumorsPath()}
        className="text-primary mb-6 inline-block text-sm font-medium hover:underline"
      >
        {copy.transfers.crossLinkRumors}
      </Link>

      <TransfersTopAd />

      <TeamPickerHub
        leagues={leagues}
        activeSlug={activeSlug}
        teams={teams}
        hrefForLeague={leagueTransfersPath}
        hrefForTeam={teamTransfersPath}
        leagueTabsAriaLabel={copy.transfers.leagueTabsAriaLabel}
        teamGridAriaLabel={copy.transfers.teamGridAriaLabel}
        deferred={deferred}
        unavailableSlot={<TransfersUnavailable />}
        className="mt-2"
      />
    </div>
  );
}
