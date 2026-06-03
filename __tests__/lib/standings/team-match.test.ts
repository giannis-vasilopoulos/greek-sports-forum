import { describe, expect, it } from "vitest";

import { findTeamIdByName } from "@/lib/standings/team-match";

const teams = [
  { id: 1, name: "Α.Ε.Κ." },
  { id: 2, name: "ΟΛΥΜΠΙΑΚΟΣ" },
  { id: 3, name: "Π.Α.Ο.Κ." },
];

describe("findTeamIdByName", () => {
  it("matches SLGR official names", () => {
    expect(findTeamIdByName("Α.Ε.Κ.", teams)).toBe(1);
    expect(findTeamIdByName("ΟΛΥΜΠΙΑΚΟΣ", teams)).toBe(2);
  });

  it("matches legacy short names via aliases", () => {
    expect(findTeamIdByName("ΑΕΚ", teams)).toBe(1);
    expect(findTeamIdByName("Olympiacos", teams)).toBe(2);
    expect(findTeamIdByName("PAOK", teams)).toBe(3);
  });
});
