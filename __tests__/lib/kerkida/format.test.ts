import { describe, expect, it } from "vitest";

import {
  formatFeeEl,
  formatKickoffEl,
  formatRelativeEl,
  matchAriaLabel,
} from "@/lib/kerkida/format";
import type { Match } from "@/lib/kerkida/types";

describe("formatRelativeEl", () => {
  const now = new Date("2026-06-10T12:00:00Z");
  const ago = (ms: number) => new Date(now.getTime() - ms).toISOString();

  it.each([
    [30_000, "τώρα"],
    [-120_000, "τώρα"], // clock skew: future counts as now
    [12 * 60_000, "πριν 12 λ."],
    [59 * 60_000 + 50_000, "πριν 59 λ."],
    [2 * 3_600_000, "πριν 2 ώρ."],
    [30 * 3_600_000, "χθες"],
    [3 * 86_400_000, "πριν 3 ημ."],
  ])("%i ms ago → %s", (ms, expected) => {
    expect(formatRelativeEl(ago(ms), now)).toBe(expected);
  });

  it("falls back to a short Athens date after a week", () => {
    // 22:30 UTC on 1 June is already 2 June in Athens (UTC+3)
    expect(formatRelativeEl("2026-06-01T22:30:00Z", now)).toBe("2 Ιουν");
  });
});

describe("formatKickoffEl", () => {
  // 20:00 UTC = 23:00 in Athens (EEST)
  const now = new Date("2026-06-10T20:00:00Z");

  it("labels today in 24h Athens time", () => {
    expect(formatKickoffEl("2026-06-10T18:45:00Z", now)).toBe("Σήμερα 21:45");
  });

  it("uses the Athens calendar day, not UTC", () => {
    // 22:15 UTC on the 10th is 01:15 on the 11th in Athens
    expect(formatKickoffEl("2026-06-10T22:15:00Z", now)).toBe("Αύριο 01:15");
  });

  it("uses the short weekday further out", () => {
    expect(formatKickoffEl("2026-06-14T15:00:00Z", now)).toBe("Κυρ 18:00");
  });

  it("uses a date for past kick-offs and a week or more ahead", () => {
    expect(formatKickoffEl("2026-06-09T15:00:00Z", now)).toBe("9 Ιουν 18:00");
    expect(formatKickoffEl("2026-06-17T15:00:00Z", now)).toBe("17 Ιουν 18:00");
  });
});

describe("formatFeeEl", () => {
  it.each([
    ["loan", 5_000_000, "Δανεισμός"],
    ["loan_return", null, "Επιστροφή από δανεισμό"],
    ["free", null, "Ελεύθερος"],
    ["permanent", null, "—"],
    ["permanent", 1_200_000, "€ 1,2 εκ."],
    ["permanent", 850_000, "€ 850 χιλ."],
    ["permanent", 999_999, "€ 1 εκ."],
  ] as const)("%s %s → %s", (kind, fee, expected) => {
    expect(formatFeeEl(kind, fee)).toBe(expected);
  });
});

describe("matchAriaLabel", () => {
  const base: Match = {
    id: "1",
    league: {
      slug: "super-league",
      name: "Super League",
      short: "SL",
      group: "football",
      hasStandings: true,
    },
    home: { id: "1", slug: "aek", name: "ΑΕΚ" },
    away: { id: "2", slug: "paok", name: "ΠΑΟΚ" },
    status: "live",
    kickoff: "2026-06-10T17:00:00Z",
    minute: "82′",
    homeScore: 2,
    awayScore: 0,
  };

  it("reads score, live minute and league", () => {
    expect(matchAriaLabel(base)).toBe(
      "ΑΕΚ 2, ΠΑΟΚ 0, ζωντανά, 82ο λεπτό, Super League",
    );
  });

  it("reads kick-off for scheduled matches without a score", () => {
    const m: Match = {
      ...base,
      status: "scheduled",
      minute: null,
      homeScore: null,
      awayScore: null,
    };
    expect(matchAriaLabel(m, new Date("2026-06-10T09:00:00Z"))).toBe(
      "ΑΕΚ – ΠΑΟΚ, Σήμερα 20:00, Super League",
    );
  });

  it("reads plain status otherwise", () => {
    expect(matchAriaLabel({ ...base, status: "finished" })).toBe(
      "ΑΕΚ 2, ΠΑΟΚ 0, τελικό, Super League",
    );
  });
});
