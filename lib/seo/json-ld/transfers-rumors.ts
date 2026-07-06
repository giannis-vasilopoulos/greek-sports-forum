import { copy } from "@/lib/copy";
import { pageTitle } from "@/lib/copy/format";

import { absoluteUrl } from "../site";

import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
  seoPages,
} from "./site-wide";
import type { JsonLd, TransferRumorsJsonLdInput } from "./types";

const { breadcrumbs: crumbs } = copy.seo;

export function buildTransfersJsonLd(): JsonLd {
  const pageName = pageTitle(seoPages.transfers.titleSegment);
  const pageDescription = seoPages.transfers.description;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        name: pageName,
        description: pageDescription,
        path: "/transfers",
      }),
      buildBreadcrumbJsonLd([
        { name: crumbs.home, path: "/" },
        { name: crumbs.transfers, path: "/transfers" },
      ]),
    ],
  };
}

export function buildLeagueTransfersJsonLd(input: {
  leagueName: string;
  slug: string;
}): JsonLd {
  const pageName = pageTitle(`Μεταγραφές — ${input.leagueName}`);
  const pageDescription = seoPages.leagueTransfers.description(
    input.leagueName,
  );
  const path = `/leagues/${input.slug}/transfers`;

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
        { name: crumbs.transfers, path: "/transfers" },
        { name: input.leagueName, path },
      ]),
    ],
  };
}

export function buildTeamTransfersJsonLd(input: {
  teamName: string;
  leagueName: string;
  leagueSlug: string;
  teamUrlSlug: string;
}): JsonLd {
  const pageName = pageTitle(`Μεταγραφές — ${input.teamName}`);
  const pageDescription = seoPages.teamTransfers.description(
    input.teamName,
    input.leagueName,
  );
  const path = `/leagues/${input.leagueSlug}/teams/${input.teamUrlSlug}/transfers`;

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
        { name: crumbs.transfers, path: "/transfers" },
        {
          name: input.leagueName,
          path: `/leagues/${input.leagueSlug}/transfers`,
        },
        { name: input.teamName, path },
      ]),
    ],
  };
}

export function buildTransferRumorsJsonLd(
  input: TransferRumorsJsonLdInput,
): JsonLd {
  const pageName = pageTitle(seoPages.transferRumors.titleSegment);
  const pageDescription = seoPages.transferRumors.description;

  const graph: Record<string, unknown>[] = [
    buildWebPageJsonLd({
      name: pageName,
      description: pageDescription,
      path: "/transfer-rumors",
    }),
  ];

  if (input.threadTitles.length > 0) {
    graph.push({
      "@type": "ItemList",
      name: seoPages.transferRumors.itemListName,
      itemListElement: input.threadTitles.map((title, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: title,
        url: absoluteUrl(input.threadPaths[index] ?? "/transfer-rumors"),
      })),
    });
  }

  graph.push(
    buildBreadcrumbJsonLd([
      { name: crumbs.home, path: "/" },
      { name: crumbs.transferRumors, path: "/transfer-rumors" },
    ]),
  );

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildLeagueTransferRumorsJsonLd(input: {
  leagueName: string;
  slug: string;
}): JsonLd {
  const pageName = pageTitle(`Φήμες Μεταγραφών — ${input.leagueName}`);
  const pageDescription = seoPages.leagueTransferRumors.description(
    input.leagueName,
  );
  const path = `/leagues/${input.slug}/transfer-rumors`;

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
        { name: crumbs.transferRumors, path: "/transfer-rumors" },
        { name: input.leagueName, path },
      ]),
    ],
  };
}

export function buildTeamTransferRumorsJsonLd(
  input: TransferRumorsJsonLdInput & {
    teamName: string;
    leagueName: string;
    leagueSlug: string;
    teamUrlSlug: string;
  },
): JsonLd {
  const pageName = pageTitle(`Φήμες Μεταγραφών — ${input.teamName}`);
  const pageDescription = seoPages.teamTransferRumors.description(
    input.teamName,
    input.leagueName,
  );
  const path = `/leagues/${input.leagueSlug}/teams/${input.teamUrlSlug}/transfer-rumors`;

  const graph: Record<string, unknown>[] = [
    buildWebPageJsonLd({
      name: pageName,
      description: pageDescription,
      path,
    }),
  ];

  if (input.threadTitles.length > 0) {
    graph.push({
      "@type": "ItemList",
      name: seoPages.transferRumors.itemListName,
      itemListElement: input.threadTitles.map((title, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: title,
        url: absoluteUrl(input.threadPaths[index] ?? path),
      })),
    });
  }

  graph.push(
    buildBreadcrumbJsonLd([
      { name: crumbs.home, path: "/" },
      { name: crumbs.transferRumors, path: "/transfer-rumors" },
      {
        name: input.leagueName,
        path: `/leagues/${input.leagueSlug}/transfer-rumors`,
      },
      { name: input.teamName, path },
    ]),
  );

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
