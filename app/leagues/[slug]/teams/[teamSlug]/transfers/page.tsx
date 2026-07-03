import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TeamTransfersPageContent } from "@/components/transfers/team-transfers-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { isTransferExcluded, isTransferUiSlug } from "@/lib/leagues/sources";
import { loadTeamTransfersPage } from "@/lib/transfers/page-data";
import { buildTeamTransfersJsonLd } from "@/lib/seo/json-ld";
import { buildTeamTransfersMetadata } from "@/lib/seo/metadata";
import { getTeamByLeagueAndUrlSlug } from "@/lib/teams/queries";

interface PageProps {
  params: Promise<{ slug: string; teamSlug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, teamSlug } = await params;

  if (isTransferExcluded(slug) || !isTransferUiSlug(slug)) {
    notFound();
  }

  const resolved = await getTeamByLeagueAndUrlSlug(slug, teamSlug);
  if (!resolved) {
    notFound();
  }

  return buildTeamTransfersMetadata({
    teamName: resolved.team.name,
    leagueName: resolved.league.name,
    leagueSlug: slug,
    teamUrlSlug: teamSlug,
  });
}

export default async function TeamTransfersPage({ params }: PageProps) {
  const { slug, teamSlug } = await params;
  const { team, league, rows, deferred } = await loadTeamTransfersPage(
    slug,
    teamSlug,
  );

  return (
    <>
      <JsonLd
        data={buildTeamTransfersJsonLd({
          teamName: team.name,
          leagueName: league.name,
          leagueSlug: slug,
          teamUrlSlug: teamSlug,
        })}
      />
      <TeamTransfersPageContent
        teamName={team.name}
        leagueName={league.name}
        leagueSlug={slug}
        teamUrlSlug={teamSlug}
        rows={rows}
        deferred={deferred}
      />
    </>
  );
}
