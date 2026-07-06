import { basketballSeasonString, type LeagueSeed } from "./types";

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

export function getLeagueSeedBySlug(slug: string): LeagueSeed | undefined {
  return LEAGUE_SEEDS.find((l) => l.slug === slug);
}
