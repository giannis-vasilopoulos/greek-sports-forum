export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "ΚΕΡΚΙΔΑ";

export const DEFAULT_TITLE = "ΚΕΡΚΙΔΑ — Greek Sports Forum";

export const DEFAULT_DESCRIPTION =
  "Η κερκίδα σου για κάθε πρωτάθλημα — συζητήσεις, match threads και ζωντανή κοινότητα αθλητικών φίλων.";

export const TITLE_TEMPLATE = "%s | ΚΕΡΚΙΔΑ";

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
