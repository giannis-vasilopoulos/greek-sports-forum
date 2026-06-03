import { describe, expect, it } from "vitest";

import { parseTheSportsDbStandings } from "@/lib/standings/providers/thesportsdb";

describe("parseTheSportsDbStandings", () => {
  it("maps lookuptable rows", () => {
    const rows = parseTheSportsDbStandings(
      {
        table: [
          {
            intRank: "1",
            strTeam: "Olympiacos",
            intPoints: "38",
            intPlayed: "17",
            intWin: "11",
            intDraw: "5",
            intLoss: "1",
            intGoalsFor: "35",
            intGoalsAgainst: "11",
          },
        ],
      },
      "2025-2026",
    );

    expect(rows[0]).toEqual({
      rank: 1,
      teamName: "Olympiacos",
      points: 38,
      played: 17,
      won: 11,
      drawn: 5,
      lost: 1,
      goalsFor: 35,
      goalsAgainst: 11,
      season: "2025-2026",
    });
  });
});
