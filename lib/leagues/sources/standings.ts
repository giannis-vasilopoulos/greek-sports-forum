import {
  DEFERRED_STANDINGS_SLUGS,
  EXCLUDED_STANDINGS_SLUGS,
  type DeferredStandingsSlug,
  type StandingsSourceConfig,
} from "./types";

const STANDINGS_SOURCES: StandingsSourceConfig[] = [
  {
    slug: "super-league",
    provider: "slgr",
  },
  {
    slug: "premier-league",
    provider: "football-data",
    externalId: "2021",
  },
  {
    slug: "la-liga",
    provider: "football-data",
    externalId: "2014",
  },
  {
    slug: "bundesliga",
    provider: "football-data",
    externalId: "2002",
  },
  {
    slug: "serie-a",
    provider: "football-data",
    externalId: "2019",
  },
  ...DEFERRED_STANDINGS_SLUGS.map(
    (slug) => ({ slug, provider: "deferred" }) as const,
  ),
];

export function isStandingsDeferred(
  slug: string,
): slug is DeferredStandingsSlug {
  return (DEFERRED_STANDINGS_SLUGS as readonly string[]).includes(slug);
}

export function isStandingsExcluded(slug: string): boolean {
  return (EXCLUDED_STANDINGS_SLUGS as readonly string[]).includes(slug);
}

export function isTransferExcluded(slug: string): boolean {
  return isStandingsExcluded(slug);
}

export function getStandingsSource(
  slug: string,
): StandingsSourceConfig | undefined {
  return STANDINGS_SOURCES.find((s) => s.slug === slug);
}

export function getStandingsSyncSources(): Array<
  Exclude<StandingsSourceConfig, { provider: "deferred" }>
> {
  return STANDINGS_SOURCES.filter(
    (s): s is Exclude<StandingsSourceConfig, { provider: "deferred" }> =>
      s.provider !== "deferred",
  );
}
