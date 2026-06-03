import { describe, expect, it } from "vitest";

import { parseFootballDataStandings } from "@/lib/standings/providers/football-data";

describe("parseFootballDataStandings", () => {
  it("maps TOTAL table to normalized rows", () => {
    const rows = parseFootballDataStandings({
      season: { startDate: "2025-08-01" },
      standings: [
        {
          type: "TOTAL",
          table: [
            {
              position: 1,
              team: { name: "Arsenal FC" },
              playedGames: 10,
              won: 7,
              draw: 2,
              lost: 1,
              goalsFor: 20,
              goalsAgainst: 8,
              points: 23,
            },
          ],
        },
      ],
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      rank: 1,
      teamName: "Arsenal FC",
      points: 23,
      played: 10,
      season: "2025-2026",
    });
  });
});
