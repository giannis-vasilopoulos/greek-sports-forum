import Link from "next/link";

import { ThreadRowList } from "@/components/feed/thread-row";
import { SubmitRumorForm } from "@/components/transfer-rumors/submit-rumor-form";
import type { FeedThread } from "@/components/feed/feed-data";
import type { HubTeamOption } from "@/lib/transfers/page-data";
import { teamTransfersPath, transfersPath } from "@/lib/seo/paths";
import { copy } from "@/lib/copy";

interface TeamTransferRumorsPageContentProps {
  teamName: string;
  leagueName: string;
  leagueSlug: string;
  teamUrlSlug: string;
  teamId: number;
  teams: HubTeamOption[];
  threads: FeedThread[];
  isSignedIn: boolean;
  hasFanProfileForLeague: boolean;
}

export function TeamTransferRumorsPageContent({
  teamName,
  leagueName,
  leagueSlug,
  teamUrlSlug,
  teamId,
  teams,
  threads,
  isSignedIn,
  hasFanProfileForLeague,
}: TeamTransferRumorsPageContentProps) {
  const hubHref = `/transfer-rumors?league=${leagueSlug}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        {copy.transferRumors.teamPageTitle(teamName)}
      </h1>
      <p className="text-muted-foreground mb-2 text-sm">{leagueName}</p>
      <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link
          href={hubHref}
          className="text-primary font-medium hover:underline"
        >
          {copy.transferRumors.backToHub(leagueName)}
        </Link>
        <Link
          href={teamTransfersPath(leagueSlug, teamUrlSlug)}
          className="text-primary font-medium hover:underline"
        >
          {copy.transferRumors.crossLinkTransfers}
        </Link>
        <Link
          href={transfersPath()}
          className="text-primary font-medium hover:underline"
        >
          {copy.transfers.pageTitle}
        </Link>
      </div>

      <SubmitRumorForm
        leagueSlug={leagueSlug}
        teams={teams}
        fixedTeamId={teamId}
        isSignedIn={isSignedIn}
        hasFanProfileForLeague={hasFanProfileForLeague}
      />

      {threads.length > 0 ? (
        <section aria-label={copy.transferRumors.listAriaLabel}>
          <ThreadRowList
            threads={threads}
            className="border-border rounded-lg border"
          />
        </section>
      ) : (
        <div className="border-border bg-muted/30 rounded-lg border px-4 py-8 text-center">
          <p className="text-sm font-medium">{copy.transferRumors.empty}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {copy.transferRumors.emptyHint}
          </p>
        </div>
      )}
    </div>
  );
}
