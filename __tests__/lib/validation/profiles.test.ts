import { describe, expect, it } from "vitest";

import { createFanProfileSchema } from "@/lib/validation/profiles";

describe("createFanProfileSchema", () => {
  it("parses league and optional team", () => {
    const result = createFanProfileSchema.safeParse({
      leagueId: "1",
      favoriteTeamId: "",
      displayName: "  FanName  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.leagueId).toBe(1);
      expect(result.data.favoriteTeamId).toBe(null);
      expect(result.data.displayName).toBe("FanName");
    }
  });

  it("rejects missing league and short display name", () => {
    expect(
      createFanProfileSchema.safeParse({
        leagueId: "",
        displayName: "a",
      }).success,
    ).toBe(false);
  });
});
