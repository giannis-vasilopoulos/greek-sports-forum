import { afterEach, describe, expect, it, vi } from "vitest";

import {
  API_FOOTBALL_FREE_TIER_MAX_SEASON_YEAR,
  apiFootballSeasonString,
  resolveApiFootballSeasonYear,
} from "@/lib/leagues/sources";

describe("resolveApiFootballSeasonYear", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("clamps to free-tier max when current season is newer", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15"));

    expect(resolveApiFootballSeasonYear()).toBe(
      API_FOOTBALL_FREE_TIER_MAX_SEASON_YEAR,
    );
    expect(apiFootballSeasonString()).toBe("2024-2025");
  });

  it("respects API_SPORTS_FOOTBALL_SEASON override for paid plans", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15"));
    vi.stubEnv("API_SPORTS_FOOTBALL_SEASON", "2025");

    expect(resolveApiFootballSeasonYear()).toBe(2025);
    expect(apiFootballSeasonString()).toBe("2025-2026");
  });
});
