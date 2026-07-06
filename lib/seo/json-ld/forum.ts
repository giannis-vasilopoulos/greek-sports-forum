import { SITE_NAME, absoluteUrl, getSiteUrl } from "../site";

import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "./site-wide";
import type { JsonLd, ThreadJsonLdInput } from "./types";

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
