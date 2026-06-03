import { footballSeasonString } from "@/lib/leagues/sources";
import { fetchSlgr } from "@/lib/slgr/fetch";
import {
  extractSlgrSeasonFromHtml,
  parseSlgrStandings,
} from "@/lib/slgr/parse-standings";
import { resolveSlgrSeasonId } from "@/lib/slgr/season";
import type { NormalizedStandingRow } from "@/lib/standings/types";

export async function fetchSlgrStandings(
  season: string = footballSeasonString(),
): Promise<NormalizedStandingRow[]> {
  const seasonId = await resolveSlgrSeasonId(season);
  const html = await fetchSlgr(`/el/scoreboard/${seasonId}/`);
  const resolvedSeason = extractSlgrSeasonFromHtml(html) ?? season;
  return parseSlgrStandings(html, resolvedSeason);
}
