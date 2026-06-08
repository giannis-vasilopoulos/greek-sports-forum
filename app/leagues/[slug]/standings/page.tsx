import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StandingsPageContent } from "@/components/standings/standings-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getStandingsByLeagueSlug,
  getStandingsLeagueOptions,
  isDeferredStandingsSlug,
} from "@/lib/standings/queries";
import { getLeagueBySlug } from "@/lib/leagues/queries";
import { isStandingsExcluded, STANDINGS_UI_SLUGS } from "@/lib/leagues/sources";
import { buildLeagueStandingsJsonLd } from "@/lib/seo/json-ld";
import {
  buildLeagueStandingsMetadata,
  buildStandingsMetadata,
} from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!(STANDINGS_UI_SLUGS as readonly string[]).includes(slug)) {
    return buildStandingsMetadata();
  }

  const league = await getLeagueBySlug(slug);
  if (!league) {
    return buildStandingsMetadata();
  }

  return buildLeagueStandingsMetadata({
    leagueName: league.name,
    slug,
  });
}

export default async function LeagueStandingsPage({ params }: PageProps) {
  const { slug } = await params;

  if (
    isStandingsExcluded(slug) ||
    !(STANDINGS_UI_SLUGS as readonly string[]).includes(slug)
  ) {
    notFound();
  }

  const league = await getLeagueBySlug(slug);
  if (!league) {
    notFound();
  }

  const [leagues, rows] = await Promise.all([
    getStandingsLeagueOptions(),
    getStandingsByLeagueSlug(slug),
  ]);

  const deferred = isDeferredStandingsSlug(slug);

  return (
    <>
      <JsonLd
        data={buildLeagueStandingsJsonLd({
          leagueName: league.name,
          slug,
        })}
      />
      <StandingsPageContent
        leagues={leagues}
        activeSlug={slug}
        activeLeagueName={league.name}
        rows={rows}
        deferred={deferred}
      />
    </>
  );
}
