import * as cheerio from "cheerio";

import type { NormalizedStandingRow } from "@/lib/standings/types";

const EXPECTED_ROW_COUNT = 14;

function parseIntCell(text: string): number | undefined {
  const trimmed = text.trim().replace(/^\+/, "");
  const n = Number.parseInt(trimmed, 10);
  return Number.isNaN(n) ? undefined : n;
}

export function extractSlgrSeasonFromHtml(html: string): string | null {
  const $ = cheerio.load(html);
  const title = $("title").first().text();
  const match = title.match(/(\d{4}-\d{4})/);
  if (match) return match[1]!;

  const meta = $('meta[name="description"]').attr("content");
  const metaMatch = meta?.match(/(\d{4}-\d{4})/);
  return metaMatch?.[1] ?? null;
}

export function parseSlgrStandings(
  html: string,
  season: string,
): NormalizedStandingRow[] {
  const $ = cheerio.load(html);
  const rows: NormalizedStandingRow[] = [];

  $(".table-body .table-row[rate-shown]").each((_, rowEl) => {
    const row = $(rowEl);
    const rank = parseIntCell(row.find(".rank").first().text());
    if (rank === undefined) return;

    const teamName =
      row.find(".full-name").first().text().trim() ||
      row.find(".team-name").attr("title")?.trim() ||
      row.find(".team-name a").first().text().trim();

    if (!teamName) return;

    const mainCells = row
      .find(".score-info-section .row.no-paddings > div")
      .toArray()
      .map((el) => $(el).text());

    const played = parseIntCell(mainCells[0] ?? "");
    const goalsFor = parseIntCell(mainCells[1] ?? "");
    const goalsAgainst = parseIntCell(mainCells[2] ?? "");
    const pointsEl = row.find(".score-info-section .bold").first();
    const points =
      parseIntCell(pointsEl.text()) ?? parseIntCell(mainCells[4] ?? "") ?? 0;

    const wdlCells = row
      .find(".score-filter-info-section .filter-option.option-0")
      .toArray()
      .map((el) => $(el).text());

    const won = parseIntCell(wdlCells[0] ?? "");
    const drawn = parseIntCell(wdlCells[1] ?? "");
    const lost = parseIntCell(wdlCells[2] ?? "");

    rows.push({
      rank,
      teamName,
      points,
      season,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
    });
  });

  rows.sort((a, b) => a.rank - b.rank);

  if (rows.length === 0) {
    throw new Error("SLGR standings: no rows parsed from HTML");
  }

  if (rows.length !== EXPECTED_ROW_COUNT) {
    console.warn(
      `SLGR standings: expected ${EXPECTED_ROW_COUNT}, got ${rows.length}`,
    );
  }

  return rows;
}
