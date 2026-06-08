import { describe, expect, it } from "vitest";

import { leagueLogoKey, teamLogoKey } from "@/lib/logos/keys";

describe("logo keys", () => {
  it("builds team webp key from slug", () => {
    expect(teamLogoKey("super-league-panathinaikos", "webp")).toBe(
      "teams/super-league-panathinaikos.webp",
    );
  });

  it("builds league svg key from slug", () => {
    expect(leagueLogoKey("premier-league", "svg")).toBe(
      "leagues/premier-league.svg",
    );
  });
});
