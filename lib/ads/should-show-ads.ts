const NO_AD_PATHS = new Set([
  "/sign-in",
  "/sign-up",
  "/dashboard",
  "/profile",
  "/settings",
  "/fan-profiles",
  "/notifications",
  "/privacy",
  "/terms",
  "/about",
  "/contact",
]);

const NO_AD_PREFIXES = ["/dashboard/", "/profile/", "/settings/"];

export interface ShouldShowAdsInput {
  pathname: string;
  adsEnabled?: boolean;
}

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "") {
    return "/";
  }

  const withoutQuery = pathname.split("?")[0]?.split("#")[0] ?? pathname;
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }

  return withoutQuery;
}

export function isAdAllowedPath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);

  if (NO_AD_PATHS.has(normalized)) {
    return false;
  }

  return !NO_AD_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function shouldShowAds({
  pathname,
  adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
}: ShouldShowAdsInput): boolean {
  if (!adsEnabled) {
    return false;
  }

  return isAdAllowedPath(pathname);
}
