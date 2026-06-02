import { seoCopy } from "@/lib/copy/seo";

export const SITE_NAME = seoCopy.site.name;

export const DEFAULT_TITLE = seoCopy.site.defaultTitle;

export const DEFAULT_DESCRIPTION = seoCopy.site.defaultDescription;

export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

export const OG_LOCALE = "el_GR";

export const TWITTER_SITE = "@kerkida";

export const DEFAULT_OG_IMAGE = "/og/default.png";

const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;
  return new URL(raw);
}

export function absoluteUrl(path: string): string {
  return new URL(
    path.startsWith("/") ? path : `/${path}`,
    getSiteUrl(),
  ).toString();
}
