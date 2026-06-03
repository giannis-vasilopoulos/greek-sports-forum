import * as cheerio from "cheerio";

import { fetchSlgr } from "@/lib/slgr/fetch";
import { footballSeasonString } from "@/lib/leagues/sources";

/**
 * Resolves the SLGR internal season id (auto-increment per season).
 * Maps e.g. 2025-2026 → 24 via the scoreboard season dropdown.
 */
export function parseSlgrSeasonIdMap(html: string): Map<string, string> {
  const $ = cheerio.load(html);
  const map = new Map<string, string>();

  $('a[href*="/el/scoreboard/"]').each((_, anchor) => {
    const href = $(anchor).attr("href") ?? "";
    const idMatch = href.match(/\/el\/scoreboard\/(\d+)\/?/);
    if (!idMatch) return;

    const label = $(anchor).find("li").first().text().trim();
    if (label) {
      map.set(label, idMatch[1]!);
    }
  });

  return map;
}

export async function resolveSlgrSeasonId(
  season: string = footballSeasonString(),
): Promise<string> {
  try {
    const html = await fetchSlgr("/el/scoreboard/");
    const map = parseSlgrSeasonIdMap(html);
    const id = map.get(season);

    if (id) {
      return id;
    }

    throw new Error(
      `SLGR: no season id for "${season}" (found: ${[...map.keys()].join(", ")})`,
    );
  } catch (error) {
    const envFallback = process.env.SLGR_SEASON_ID?.trim();
    if (envFallback) {
      console.warn(
        `SLGR: using SLGR_SEASON_ID=${envFallback} (season resolve fetch failed)`,
      );
      return envFallback;
    }
    throw error;
  }
}
