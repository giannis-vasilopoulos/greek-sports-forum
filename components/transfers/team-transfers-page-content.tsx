import Link from "next/link";

import {
  TransfersBottomAd,
  TransfersTopAd,
} from "@/components/ads/slots/content-ad-slots";
import { TeamTransfersTableSection } from "@/components/transfers/team-transfers-table-section";
import { TransfersUnavailable } from "@/components/transfers/transfers-unavailable";
import type { TransfersTableRow } from "@/lib/transfers/queries";
import { teamTransferRumorsPath, transferRumorsPath } from "@/lib/seo/paths";
import { copy } from "@/lib/copy";

interface TeamTransfersPageContentProps {
  teamName: string;
  leagueName: string;
  leagueSlug: string;
  teamUrlSlug: string;
  rows: TransfersTableRow[];
  deferred: boolean;
}

export function TeamTransfersPageContent({
  teamName,
  leagueName,
  leagueSlug,
  teamUrlSlug,
  rows,
  deferred,
}: TeamTransfersPageContentProps) {
  const hubHref = `/transfers?league=${leagueSlug}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        {copy.transfers.teamPageTitle(teamName)}
      </h1>
      <p className="text-muted-foreground mb-2 text-sm">{leagueName}</p>
      <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link
          href={hubHref}
          className="text-primary font-medium hover:underline"
        >
          {copy.transfers.backToHub(leagueName)}
        </Link>
        <Link
          href={teamTransferRumorsPath(leagueSlug, teamUrlSlug)}
          className="text-primary font-medium hover:underline"
        >
          {copy.transfers.crossLinkRumors}
        </Link>
        <Link
          href={transferRumorsPath()}
          className="text-primary font-medium hover:underline"
        >
          {copy.transferRumors.pageTitle}
        </Link>
      </div>

      <TransfersTopAd />

      {deferred ? (
        <TransfersUnavailable />
      ) : (
        <>
          <TeamTransfersTableSection rows={rows} leagueSlug={leagueSlug} />
          {rows.length > 0 ? <TransfersBottomAd /> : null}
        </>
      )}
    </div>
  );
}
