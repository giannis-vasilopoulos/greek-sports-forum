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
