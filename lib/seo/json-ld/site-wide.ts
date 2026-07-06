import { copy } from "@/lib/copy";

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
} from "../site";

import type { BreadcrumbItem, HomeJsonLdInput, JsonLd } from "./types";

const { pages: seoPages } = copy.seo;

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

export { seoPages };
