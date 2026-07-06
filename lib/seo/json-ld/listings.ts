import { copy } from "@/lib/copy";
import { pageTitle } from "@/lib/copy/format";

import { absoluteUrl } from "../site";

import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
  seoPages,
} from "./site-wide";
import type { JsonLd, MatchThreadsJsonLdInput } from "./types";

const { breadcrumbs: crumbs } = copy.seo;

export function buildMatchThreadsJsonLd(
  input: MatchThreadsJsonLdInput,
): JsonLd {
  const pageName = pageTitle(seoPages.matchThreads.titleSegment);
  const pageDescription = seoPages.matchThreads.description;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        name: pageName,
        description: pageDescription,
        path: "/match-threads",
      }),
      {
        "@type": "ItemList",
        name: seoPages.matchThreads.itemListName,
        itemListElement: input.threadTitles.map((title, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: title,
          url: absoluteUrl(input.threadPaths[index] ?? "/match-threads"),
        })),
      },
      buildBreadcrumbJsonLd([
        { name: crumbs.home, path: "/" },
        { name: crumbs.matchThreads, path: "/match-threads" },
      ]),
    ],
  };
}

export function buildStandingsJsonLd(): JsonLd {
  const pageName = pageTitle(seoPages.standings.titleSegment);
  const pageDescription = seoPages.standings.description;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        name: pageName,
        description: pageDescription,
        path: "/standings",
      }),
      buildBreadcrumbJsonLd([
        { name: crumbs.home, path: "/" },
        { name: crumbs.standings, path: "/standings" },
      ]),
    ],
  };
}

export function buildLeagueStandingsJsonLd(input: {
  leagueName: string;
  slug: string;
}): JsonLd {
  const pageName = pageTitle(`Βαθμολογία — ${input.leagueName}`);
  const pageDescription = seoPages.leagueStandings.description(
    input.leagueName,
  );
  const path = `/leagues/${input.slug}/standings`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        name: pageName,
        description: pageDescription,
        path,
      }),
      buildBreadcrumbJsonLd([
        { name: crumbs.home, path: "/" },
        { name: crumbs.standings, path: "/standings" },
        { name: input.leagueName, path },
      ]),
    ],
  };
}
