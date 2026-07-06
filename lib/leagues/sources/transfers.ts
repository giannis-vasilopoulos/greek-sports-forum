import {
  DEFERRED_STANDINGS_SLUGS,
  TRANSFER_SYNC_SLUGS,
  type TransferSyncSlug,
  type TransfersSourceConfig,
} from "./types";
import { isStandingsDeferred } from "./standings";

const TRANSFER_SYNC_SOURCES: TransfersSourceConfig[] = [
  { slug: "super-league", provider: "api-football", externalId: "197" },
  { slug: "premier-league", provider: "api-football", externalId: "39" },
  { slug: "la-liga", provider: "api-football", externalId: "140" },
  { slug: "bundesliga", provider: "api-football", externalId: "78" },
  { slug: "serie-a", provider: "api-football", externalId: "135" },
  ...DEFERRED_STANDINGS_SLUGS.map(
    (slug) => ({ slug, provider: "deferred" }) as const,
  ),
];

export function isTransferSyncSlug(slug: string): slug is TransferSyncSlug {
  return (TRANSFER_SYNC_SLUGS as readonly string[]).includes(slug);
}

export function footballSeasonStartYear(): number {
  const now = new Date();
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
}

/** API-Football free plan: seasons 2022–2024 only (see dashboard error text). */
export const API_FOOTBALL_FREE_TIER_MAX_SEASON_YEAR = 2024;

/** Season year for API-Football team list; clamped on free tier unless overridden. */
export function resolveApiFootballSeasonYear(): number {
  const envOverride = process.env.API_SPORTS_FOOTBALL_SEASON?.trim();
  if (envOverride) {
    const parsed = Number.parseInt(envOverride, 10);
    if (!Number.isNaN(parsed)) return parsed;
  }

  return Math.min(
    footballSeasonStartYear(),
    API_FOOTBALL_FREE_TIER_MAX_SEASON_YEAR,
  );
}

export function apiFootballSeasonString(seasonYear?: number): string {
  const year = seasonYear ?? resolveApiFootballSeasonYear();
  return `${year}-${year + 1}`;
}

export function isTransfersDeferred(slug: string): boolean {
  return isStandingsDeferred(slug);
}

export function getTransfersSyncSources(): Array<
  Extract<TransfersSourceConfig, { provider: "api-football" }>
> {
  return TRANSFER_SYNC_SOURCES.filter(
    (s): s is Extract<TransfersSourceConfig, { provider: "api-football" }> =>
      s.provider === "api-football",
  );
}
