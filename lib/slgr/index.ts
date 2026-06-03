export { SLGR_BASE_URL, slgrRequestHeaders } from "@/lib/slgr/constants";
export { fetchSlgr } from "@/lib/slgr/fetch";
export { parseSlgrTeams, type SlgrTeamRow } from "@/lib/slgr/parse-teams";
export {
  extractSlgrSeasonFromHtml,
  parseSlgrStandings,
} from "@/lib/slgr/parse-standings";
export { parseSlgrSeasonIdMap, resolveSlgrSeasonId } from "@/lib/slgr/season";
