import { describe, expect, it } from "vitest";

import { createFanProfileSchema } from "@/lib/validation/profiles";

describe("createFanProfileSchema", () => {
  it("parses league, team, and display name", () => {
    const result = createFanProfileSchema.safeParse({
      leagueId: "1",
      favoriteTeamId: "2",
      displayName: "  FanName  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.leagueId).toBe(1);
      expect(result.data.favoriteTeamId).toBe(2);
      expect(result.data.displayName).toBe("FanName");
    }
  });

  it("rejects missing team", () => {
    expect(
      createFanProfileSchema.safeParse({
        leagueId: "1",
        favoriteTeamId: "",
        displayName: "FanName",
      }).success,
    ).toBe(false);
  });

  it("rejects missing league and short display name", () => {
    expect(
      createFanProfileSchema.safeParse({
        leagueId: "",
        favoriteTeamId: "1",
        displayName: "a",
      }).success,
    ).toBe(false);
  });
});
