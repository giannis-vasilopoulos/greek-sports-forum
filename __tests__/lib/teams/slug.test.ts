import { describe, expect, it } from "vitest";

import { greekToLatin, slugifyTeamName, teamSlug } from "@/lib/teams/slug";

/** Current SLGR Super League 2025-26 team names. */
const SLGR_SUPER_LEAGUE_TEAMS = [
  "Α.Ε.Κ.",
  "ΑΕΛ NOVIBET",
  "ΑΡΗΣ",
  "ASTERAS AKTOR",
  "ΑΤΡΟΜΗΤΟΣ ΑΘ.",
  "ΒΟΛΟΣ ΝΠΣ",
  "ΚΗΦΙΣΙΑ",
  "ΛΕΒΑΔΕΙΑΚΟΣ",
  "ΟΛΥΜΠΙΑΚΟΣ",
  "Ο.Φ.Η.",
  "ΠΑΝΑΘΗΝΑΪΚΟΣ",
  "ΠΑΝΑΙΤΩΛΙΚΟΣ",
  "ΠΑΝΣΕΡΡΑΪΚΟΣ",
  "Π.Α.Ο.Κ.",
] as const;

describe("greekToLatin", () => {
  it("transliterates greek letters to latin", () => {
    expect(greekToLatin("ΟΛΥΜΠΙΑΚΟΣ")).toBe("olympiakos");
    expect(greekToLatin("Α.Ε.Κ.")).toBe("a.e.k.");
  });
});

describe("teamSlug", () => {
  it("produces latin slugs for known examples", () => {
    expect(teamSlug("super-league", "Α.Ε.Κ.")).toBe("super-league-aek");
    expect(teamSlug("super-league", "ΟΛΥΜΠΙΑΚΟΣ")).toBe(
      "super-league-olympiakos",
    );
    expect(teamSlug("super-league", "ASTERAS AKTOR")).toBe(
      "super-league-asteras-aktor",
    );
  });

  it("assigns 14 unique slugs for all SLGR Super League teams", () => {
    const slugs = SLGR_SUPER_LEAGUE_TEAMS.map((name) =>
      teamSlug("super-league", name),
    );
    expect(new Set(slugs).size).toBe(14);
    for (const slug of slugs) {
      expect(slug).toMatch(/^super-league-[a-z0-9-]+$/);
      expect(slug).not.toBe("super-league-");
    }
  });

  it("never returns an empty slugifyTeamName for SLGR names", () => {
    for (const name of SLGR_SUPER_LEAGUE_TEAMS) {
      expect(slugifyTeamName(name).length).toBeGreaterThan(0);
    }
  });
});
