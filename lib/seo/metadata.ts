import type { Metadata } from "next";

import { copy } from "@/lib/copy";
import { pageTitle } from "@/lib/copy/format";

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  OG_LOCALE,
  SITE_NAME,
  TWITTER_SITE,
  absoluteUrl,
} from "./site";

const p = copy.seo.pages;

export const ROBOTS_INDEX: Metadata["robots"] = {
  index: true,
  follow: true,
};

export const ROBOTS_NOINDEX_FOLLOW: Metadata["robots"] = {
  index: false,
  follow: true,
};

export const ROBOTS_NOINDEX_NOFOLLOW: Metadata["robots"] = {
  index: false,
  follow: false,
};

export interface PageMetadataInput {
  title?: string;
  description?: string;
  path: string;
  robots?: Metadata["robots"];
  openGraphType?: "website" | "article" | "profile";
  openGraphImage?: string;
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  robots = ROBOTS_INDEX,
  openGraphType = "website",
  openGraphImage = DEFAULT_OG_IMAGE,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const resolvedTitle = title ?? DEFAULT_TITLE;

  return {
    title: title ? resolvedTitle : { absolute: DEFAULT_TITLE },
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      title: title ?? DEFAULT_TITLE,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      type: openGraphType,
      images: [
        { url: openGraphImage, width: 1200, height: 630, alt: SITE_NAME },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_SITE,
      title: title ?? DEFAULT_TITLE,
      description,
      images: [openGraphImage],
    },
  };
}

export function buildHomeMetadata(): Metadata {
  return buildPageMetadata({
    path: "/",
    description: DEFAULT_DESCRIPTION,
    openGraphType: "website",
  });
}

export interface ThreadMetadataInput {
  title: string;
  description: string;
  path: string;
  openGraphImage?: string;
}

export function buildPrivacyMetadata(): Metadata {
  return buildPageMetadata({
    title: pageTitle(p.privacy.titleSegment),
    description: p.privacy.description,
    path: "/privacy",
  });
}

export function buildMatchThreadsMetadata(): Metadata {
  return buildPageMetadata({
    title: pageTitle(p.matchThreads.titleSegment),
    description: p.matchThreads.description,
    path: "/match-threads",
  });
}

export function buildSignInMetadata(): Metadata {
  return buildPageMetadata({
    title: pageTitle(p.signIn.titleSegment),
    description: p.signIn.description,
    path: "/sign-in",
    robots: ROBOTS_NOINDEX_FOLLOW,
  });
}

export function buildSignUpMetadata(): Metadata {
  return buildPageMetadata({
    title: pageTitle(p.signUp.titleSegment),
    description: p.signUp.description,
    path: "/sign-up",
    robots: ROBOTS_NOINDEX_FOLLOW,
  });
}

export function buildOnboardingMetadata(): Metadata {
  return buildPageMetadata({
    title: pageTitle(p.onboarding.titleSegment),
    description: p.onboarding.description,
    path: "/onboarding",
    robots: ROBOTS_NOINDEX_FOLLOW,
  });
}

export function buildThreadMetadata({
  title,
  description,
  path,
  openGraphImage,
}: ThreadMetadataInput): Metadata {
  return buildPageMetadata({
    title,
    description,
    path,
    openGraphType: "article",
    openGraphImage,
  });
}
