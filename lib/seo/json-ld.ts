import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
} from "./site";

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

export function buildHomeJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationJsonLd(),
      buildWebSiteJsonLd(),
      buildWebPageJsonLd({
        name: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        path: "/",
      }),
    ],
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
