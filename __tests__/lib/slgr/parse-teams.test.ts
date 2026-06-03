import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { parseSlgrTeams } from "@/lib/slgr/parse-teams";

const fixture = readFileSync(
  join(__dirname, "../../fixtures/slgr/teams-snippet.html"),
  "utf8",
);

describe("parseSlgrTeams", () => {
  it("parses team names and absolute logo URLs", () => {
    const teams = parseSlgrTeams(fixture);
    expect(teams).toHaveLength(2);
    expect(teams[0]).toEqual({
      name: "Α.Ε.Κ.",
      logoUrl: "https://www.slgr.gr/img/uploads/big/156284491142.png",
    });
    expect(teams[1]?.name).toBe("ΟΛΥΜΠΙΑΚΟΣ");
    expect(teams[1]?.logoUrl).toContain("172070387647.png");
  });
});
