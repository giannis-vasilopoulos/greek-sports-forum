import type { Metadata } from "next";

import { TeamTransferRumorsPageContent } from "@/components/transfer-rumors/team-transfer-rumors-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { isTransferUiSlug } from "@/lib/leagues/sources";
import { loadTeamTransferRumorsPage } from "@/lib/transfers/page-data";
import {
  getTransferRumorJsonLdInput,
  getTransferRumorThreads,
} from "@/lib/transfers/rumor-queries";
import { buildTeamTransferRumorsJsonLd } from "@/lib/seo/json-ld";
import {
  buildTeamTransferRumorsMetadata,
  buildTransferRumorsMetadata,
} from "@/lib/seo/metadata";
import { getTeamByLeagueAndUrlSlug } from "@/lib/teams/queries";

interface PageProps {
  params: Promise<{ slug: string; teamSlug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, teamSlug } = await params;

  if (!isTransferUiSlug(slug)) {
    return buildTransferRumorsMetadata();
  }

  const resolved = await getTeamByLeagueAndUrlSlug(slug, teamSlug);
  if (!resolved) {
    return buildTransferRumorsMetadata();
  }

  return buildTeamTransferRumorsMetadata({
    teamName: resolved.team.name,
    leagueName: resolved.league.name,
    leagueSlug: slug,
    teamUrlSlug: teamSlug,
  });
}

export default async function TeamTransferRumorsPage({ params }: PageProps) {
  const { slug, teamSlug } = await params;
  const pageData = await loadTeamTransferRumorsPage(slug, teamSlug);
  const { team, league, isSignedIn, hasFanProfileForLeague } = pageData;

  const threads = await getTransferRumorThreads({
    leagueSlug: slug,
    teamId: team.id,
  });
  const jsonLdInput = getTransferRumorJsonLdInput(threads);

  const teams = [
    {
      id: team.id,
      name: team.name,
      urlSlug: teamSlug,
      logoUrl: team.logoUrl,
    },
  ];

  return (
    <>
      <JsonLd
        data={buildTeamTransferRumorsJsonLd({
          ...jsonLdInput,
          teamName: team.name,
          leagueName: league.name,
          leagueSlug: slug,
          teamUrlSlug: teamSlug,
        })}
      />
      <TeamTransferRumorsPageContent
        teamName={team.name}
        leagueName={league.name}
        leagueSlug={slug}
        teamUrlSlug={teamSlug}
        teamId={team.id}
        teams={teams}
        threads={threads}
        isSignedIn={isSignedIn}
        hasFanProfileForLeague={hasFanProfileForLeague}
      />
    </>
  );
}
