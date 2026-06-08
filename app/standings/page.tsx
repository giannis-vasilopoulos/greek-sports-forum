import type { Metadata } from "next";

import { StandingsPageContent } from "@/components/standings/standings-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getStandingsByLeagueSlug,
  getStandingsLeagueOptions,
} from "@/lib/standings/queries";
import { buildStandingsJsonLd } from "@/lib/seo/json-ld";
import { buildStandingsMetadata } from "@/lib/seo/metadata";

const DEFAULT_SLUG = "super-league";

export const metadata: Metadata = buildStandingsMetadata();

export default async function StandingsPage() {
  const [leagues, rows] = await Promise.all([
    getStandingsLeagueOptions(),
    getStandingsByLeagueSlug(DEFAULT_SLUG),
  ]);

  const activeLeague = leagues.find((l) => l.slug === DEFAULT_SLUG);

  return (
    <>
      <JsonLd data={buildStandingsJsonLd()} />
      <StandingsPageContent
        leagues={leagues}
        activeSlug={DEFAULT_SLUG}
        activeLeagueName={activeLeague?.name ?? "Super League"}
        rows={rows}
        deferred={false}
      />
    </>
  );
}
