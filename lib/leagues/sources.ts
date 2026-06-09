export type TeamsProvider =
  | "football-data"
  | "api-football"
  | "api-basketball"
  | "thesportsdb"
  | "slgr";

export type StandingsProvider =
  | "football-data"
  | "thesportsdb"
  | "slgr"
  | "deferred";

export type LeagueSeed = {
  slug: string;
  name: string;
  displayOrder: number;
  provider: TeamsProvider;
  externalId: string;
  apiSportsSeason?: string;
  thesportsdbSearchName?: string;
  /** Override when provider does not expose a league emblem API. */
  logoSourceUrl?: string;
  sport: "football" | "basketball";
  type?: "league" | "tournament";
};

/** Leagues with no standings sync in v1 (API or format). */
export const DEFERRED_STANDINGS_SLUGS = ["nba", "euroleague"] as const;

export type DeferredStandingsSlug = (typeof DEFERRED_STANDINGS_SLUGS)[number];

/** Tournaments / knockout — no simple table UI in v1. */
export const EXCLUDED_STANDINGS_SLUGS = [
  "champions-league",
  "world-cup",
  "euro",
] as const;

/** Shown on standings pages (synced + deferred). */
export const STANDINGS_UI_SLUGS = [
  "super-league",
  "premier-league",
  "la-liga",
  "bundesliga",
  "serie-a",
  "nba",
  "euroleague",
] as const;

export type StandingsUiSlug = (typeof STANDINGS_UI_SLUGS)[number];

/** Shown on transfers and transfer-rumors league tabs. */
export const TRANSFER_UI_SLUGS = STANDINGS_UI_SLUGS;

export type TransferUiSlug = StandingsUiSlug;

/** Leagues with API-Football transfer sync (football only). */
export const TRANSFER_SYNC_SLUGS = [
  "super-league",
  "premier-league",
  "la-liga",
  "bundesliga",
  "serie-a",
] as const;

export type TransferSyncSlug = (typeof TRANSFER_SYNC_SLUGS)[number];

export function isTransferUiSlug(slug: string): slug is TransferUiSlug {
  return (TRANSFER_UI_SLUGS as readonly string[]).includes(slug);
}

export function isTransferExcluded(slug: string): boolean {
  return isStandingsExcluded(slug);
}

export function isTransferSyncSlug(slug: string): slug is TransferSyncSlug {
  return (TRANSFER_SYNC_SLUGS as readonly string[]).includes(slug);
}

export function footballSeasonString(): string {
  const now = new Date();
  const year = now.getFullYear();
  if (now.getMonth() >= 7) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

export function basketballSeasonString(): string {
  const now = new Date();
  const year = now.getFullYear();
  if (now.getMonth() >= 9) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

const BASKETBALL_SEASON = basketballSeasonString();

export const LEAGUE_SEEDS: LeagueSeed[] = [
  {
    slug: "super-league",
    name: "Super League",
    displayOrder: 1,
    provider: "slgr",
    externalId: "",
    sport: "football",
  },
  {
    slug: "champions-league",
    name: "Champions League",
    displayOrder: 2,
    provider: "football-data",
    externalId: "2001",
    sport: "football",
  },
  {
    slug: "premier-league",
    name: "Premier League",
    displayOrder: 3,
    provider: "football-data",
    externalId: "2021",
    sport: "football",
  },
  {
    slug: "la-liga",
    name: "La Liga",
    displayOrder: 4,
    provider: "football-data",
    externalId: "2014",
    sport: "football",
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    displayOrder: 5,
    provider: "football-data",
    externalId: "2002",
    sport: "football",
  },
  {
    slug: "serie-a",
    name: "Serie A",
    displayOrder: 6,
    provider: "football-data",
    externalId: "2019",
    sport: "football",
  },
  {
    slug: "euroleague",
    name: "Euroleague",
    displayOrder: 7,
    provider: "api-basketball",
    externalId: "120",
    apiSportsSeason: BASKETBALL_SEASON,
    sport: "basketball",
  },
  {
    slug: "nba",
    name: "NBA",
    displayOrder: 8,
    provider: "api-basketball",
    externalId: "12",
    apiSportsSeason: BASKETBALL_SEASON,
    sport: "basketball",
  },
  {
    slug: "basket-league",
    name: "Basket League",
    displayOrder: 9,
    provider: "thesportsdb",
    externalId: "4452",
    thesportsdbSearchName: "Greek_Basket_League",
    sport: "basketball",
  },
  {
    slug: "world-cup",
    name: "Παγκόσμιο Κύπελλο",
    displayOrder: 10,
    provider: "football-data",
    externalId: "2000",
    sport: "football",
    type: "tournament",
  },
  {
    slug: "euro",
    name: "Euro",
    displayOrder: 11,
    provider: "football-data",
    externalId: "2018",
    sport: "football",
    type: "tournament",
  },
];

export type StandingsSourceConfig =
  | {
      slug: string;
      provider: "football-data";
      externalId: string;
    }
  | {
      slug: string;
      provider: "thesportsdb";
      externalId: string;
    }
  | {
      slug: string;
      provider: "slgr";
    }
  | {
      slug: string;
      provider: "deferred";
    };

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

export function getLeagueSeedBySlug(slug: string): LeagueSeed | undefined {
  return LEAGUE_SEEDS.find((l) => l.slug === slug);
}

export type TransfersSourceConfig =
  | {
      slug: string;
      provider: "api-football";
      externalId: string;
    }
  | {
      slug: string;
      provider: "deferred";
    };

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
