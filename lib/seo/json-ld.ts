import { copy } from "@/lib/copy";
import { pageTitle } from "@/lib/copy/format";

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
} from "./site";

const { pages: seoPages, breadcrumbs: crumbs } = copy.seo;

export type JsonLd = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildOrganizationJsonLd(): JsonLd {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/og/logo.png`,
    sameAs: [
      "https://x.com/kerkida",
      "https://instagram.com/kerkida",
      "https://tiktok.com/@kerkida",
    ],
  };
}

export function buildWebSiteJsonLd(): JsonLd {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: "el-GR",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}

export function buildWebPageJsonLd(input: {
  name: string;
  description?: string;
  path: string;
}): JsonLd {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description ?? DEFAULT_DESCRIPTION,
    url: absoluteUrl(input.path),
    inLanguage: "el-GR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export interface HomeJsonLdInput {
  threadTitles?: string[];
  threadPaths?: string[];
}

export function buildHomeJsonLd(input: HomeJsonLdInput = {}): JsonLd {
  const graph: JsonLd[] = [
    buildOrganizationJsonLd(),
    buildWebSiteJsonLd(),
    buildWebPageJsonLd({
      name: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      path: "/",
    }),
  ];

  const { threadTitles = [], threadPaths = [] } = input;

  if (threadTitles.length > 0) {
    graph.push({
      "@type": "ItemList",
      name: "Match Threads",
      itemListElement: threadTitles.map((title, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: title,
        url: absoluteUrl(threadPaths[index] ?? "/"),
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export interface MatchThreadsJsonLdInput {
  threadTitles: string[];
  threadPaths: string[];
}

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

export interface TransferRumorsJsonLdInput {
  threadTitles: string[];
  threadPaths: string[];
}

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

export function buildSportsOrganizationJsonLd(input: {
  leagueName: string;
  path: string;
  sport: "football" | "basketball";
}): JsonLd {
  const sportLabel = input.sport === "football" ? "Soccer" : "Basketball";

  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: input.leagueName,
    url: absoluteUrl(input.path),
    sport: sportLabel,
  };
}

export interface ThreadJsonLdInput {
  title: string;
  path: string;
  authorName: string;
  datePublished: string;
  dateModified: string;
  replyCount: number;
  breadcrumbs: BreadcrumbItem[];
}

export function buildThreadJsonLd(input: ThreadJsonLdInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DiscussionForumPosting",
        headline: input.title,
        url: absoluteUrl(input.path),
        datePublished: input.datePublished,
        dateModified: input.dateModified,
        author: {
          "@type": "Person",
          name: input.authorName,
        },
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/CommentAction",
          userInteractionCount: input.replyCount,
        },
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: getSiteUrl().toString().replace(/\/$/, ""),
        },
      },
      buildWebPageJsonLd({
        name: input.title,
        path: input.path,
      }),
      buildBreadcrumbJsonLd(input.breadcrumbs),
    ],
  };
}
