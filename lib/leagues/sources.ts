export type TeamsProvider =
  | "football-data"
  | "api-football"
  | "api-basketball"
  | "thesportsdb";

export type StandingsProvider = "football-data" | "thesportsdb" | "deferred";

export type LeagueSeed = {
  slug: string;
  name: string;
  displayOrder: number;
  provider: TeamsProvider;
  externalId: string;
  apiSportsSeason?: string;
  thesportsdbSearchName?: string;
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

const FOOTBALL_SEASON = "2024";
const BASKETBALL_SEASON = basketballSeasonString();

export const LEAGUE_SEEDS: LeagueSeed[] = [
  {
    slug: "super-league",
    name: "Super League",
    displayOrder: 1,
    provider: "api-football",
    externalId: "197",
    apiSportsSeason: FOOTBALL_SEASON,
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

/** TheSportsDB Greek Super League — standings only (teams still from api-football). */
export const SUPER_LEAGUE_STANDINGS_LEAGUE_ID = "4336";

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
      provider: "deferred";
    };

const STANDINGS_SOURCES: StandingsSourceConfig[] = [
  {
    slug: "super-league",
    provider: "thesportsdb",
    externalId: SUPER_LEAGUE_STANDINGS_LEAGUE_ID,
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
