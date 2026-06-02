import { describe, expect, it } from "vitest";

import {
  prepareSanctionInsert,
  shouldCollapsePost,
  shouldFlagPost,
  validateSanctionInput,
} from "@/lib/forum/moderation";

describe("post moderation helpers", () => {
  it("collapses at score -5", () => {
    expect(shouldCollapsePost(-5)).toBe(true);
    expect(shouldCollapsePost(-4)).toBe(false);
  });

  it("flags at 3 reports", () => {
    expect(shouldFlagPost(3)).toBe(true);
    expect(shouldFlagPost(2)).toBe(false);
  });
});

describe("validateSanctionInput", () => {
  it("requires leagueId for league_ban", () => {
    expect(
      validateSanctionInput({ type: "league_ban", leagueId: null }).ok,
    ).toBe(false);
  });

  it("requires leagueId for slow_mode and shadow_ban", () => {
    expect(
      validateSanctionInput({ type: "slow_mode", leagueId: null }).ok,
    ).toBe(false);
    expect(
      validateSanctionInput({ type: "shadow_ban", leagueId: null }).ok,
    ).toBe(false);
  });

  it("requires null leagueId for account_ban", () => {
    expect(validateSanctionInput({ type: "account_ban", leagueId: 1 }).ok).toBe(
      false,
    );
    expect(
      validateSanctionInput({ type: "account_ban", leagueId: null }).ok,
    ).toBe(true);
  });

  it("accepts league_ban with leagueId", () => {
    expect(validateSanctionInput({ type: "league_ban", leagueId: 1 }).ok).toBe(
      true,
    );
  });
});

describe("prepareSanctionInsert", () => {
  it("rejects invalid account_ban league scope", () => {
    const result = prepareSanctionInsert({
      fanProfileId: 1,
      type: "account_ban",
      leagueId: 1,
      issuedByUserId: "mod-1",
      reason: "repeat offender",
    });

    expect(result.ok).toBe(false);
  });

  it("builds expiresAt for slow_mode", () => {
    const startsAt = new Date("2026-06-01T00:00:00Z");
    const result = prepareSanctionInsert({
      fanProfileId: 1,
      type: "slow_mode",
      leagueId: 1,
      issuedByUserId: "mod-1",
      reason: "spam",
      startsAt,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.expiresAt?.toISOString()).toBe(
        "2026-06-04T00:00:00.000Z",
      );
    }
  });
});
