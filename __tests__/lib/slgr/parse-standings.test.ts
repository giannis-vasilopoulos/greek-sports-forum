import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  extractSlgrSeasonFromHtml,
  parseSlgrStandings,
} from "@/lib/slgr/parse-standings";

const fixture = readFileSync(
  join(__dirname, "../../fixtures/slgr/standings-snippet.html"),
  "utf8",
);

describe("parseSlgrStandings", () => {
  it("extracts season from title", () => {
    expect(extractSlgrSeasonFromHtml(fixture)).toBe("2025-2026");
  });

  it("parses cumulative standing rows with stats", () => {
    const rows = parseSlgrStandings(fixture, "2025-2026");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      rank: 1,
      teamName: "Α.Ε.Κ.",
      points: 72,
      played: 32,
      won: 21,
      drawn: 9,
      lost: 2,
      goalsFor: 57,
      goalsAgainst: 20,
      season: "2025-2026",
    });
    expect(rows[1]?.rank).toBe(2);
    expect(rows[1]?.teamName).toBe("ΟΛΥΜΠΙΑΚΟΣ");
    expect(rows[1]?.points).toBe(65);
  });
});
