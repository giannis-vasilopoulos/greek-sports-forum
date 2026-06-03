import * as cheerio from "cheerio";

import { SLGR_BASE_URL } from "@/lib/slgr/constants";

export type SlgrTeamRow = {
  name: string;
  logoUrl: string | null;
};

const EXPECTED_TEAM_COUNT = 14;

export function parseSlgrTeams(html: string): SlgrTeamRow[] {
  const $ = cheerio.load(html);
  const teams: SlgrTeamRow[] = [];

  $(".item-team .team-card").each((_, card) => {
    const name = $(card).find("h4").first().text().trim();
    if (!name) return;

    const src = $(card).find(".logo-team img").first().attr("src")?.trim();
    const logoUrl = src
      ? src.startsWith("http")
        ? src
        : `${SLGR_BASE_URL}${src.startsWith("/") ? src : `/${src}`}`
      : null;

    teams.push({ name, logoUrl });
  });

  if (teams.length === 0) {
    throw new Error("SLGR teams: no teams parsed from HTML");
  }

  if (teams.length !== EXPECTED_TEAM_COUNT) {
    console.warn(
      `SLGR teams: expected ${EXPECTED_TEAM_COUNT}, got ${teams.length}`,
    );
  }

  return teams;
}
