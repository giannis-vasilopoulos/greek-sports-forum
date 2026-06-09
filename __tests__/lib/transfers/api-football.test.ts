import { describe, expect, it, vi } from "vitest";

import { parseApiFootballTransfers } from "@/lib/transfers/providers/api-football";

describe("parseApiFootballTransfers", () => {
  it("maps in-season transfers and dedupes", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15"));

    const rows = parseApiFootballTransfers(
      [
        {
          player: { id: 1, name: "Test Player" },
          transfers: [
            {
              date: "2025-08-01",
              type: "Free",
              teams: {
                out: { id: 10, name: "Team A" },
                in: { id: 20, name: "Team B" },
              },
            },
            {
              date: "2024-01-01",
              type: "€ 5M",
              teams: {
                out: { id: 30, name: "Old Club" },
                in: { id: 10, name: "Team A" },
              },
            },
          ],
        },
        {
          player: { id: 1, name: "Test Player" },
          transfers: [
            {
              date: "2025-08-01",
              type: "Free",
              teams: {
                out: { id: 10, name: "Team A" },
                in: { id: 20, name: "Team B" },
              },
            },
          ],
        },
      ],
      2025,
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      playerName: "Test Player",
      fromTeamName: "Team A",
      toTeamName: "Team B",
      transferDate: "2025-08-01",
      feeText: "Free",
      season: "2025-2026",
    });

    vi.useRealTimers();
  });
});
