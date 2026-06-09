import { describe, expect, it } from "vitest";

import { teamUrlSlug } from "@/lib/teams/queries";

describe("teamUrlSlug", () => {
  it("strips league prefix from db slug", () => {
    expect(teamUrlSlug("super-league-panathinaikos", "super-league")).toBe(
      "panathinaikos",
    );
  });

  it("returns slug unchanged when prefix does not match", () => {
    expect(teamUrlSlug("panathinaikos", "super-league")).toBe("panathinaikos");
  });
});
