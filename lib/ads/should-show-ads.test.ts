import { describe, expect, it } from "vitest";

import {
  isAdAllowedPath,
  normalizePathname,
  shouldShowAds,
} from "@/lib/ads/should-show-ads";

describe("normalizePathname", () => {
  it("normalizes trailing slashes and query strings", () => {
    expect(normalizePathname("/leagues/")).toBe("/leagues");
    expect(normalizePathname("/match-threads?page=2")).toBe("/match-threads");
  });
});

describe("isAdAllowedPath", () => {
  it("allows public indexable routes", () => {
    expect(isAdAllowedPath("/")).toBe(true);
    expect(isAdAllowedPath("/match-threads")).toBe(true);
    expect(isAdAllowedPath("/leagues/super-league/threads/1-title")).toBe(true);
  });

  it("blocks auth, account, and legal routes", () => {
    expect(isAdAllowedPath("/sign-in")).toBe(false);
    expect(isAdAllowedPath("/dashboard")).toBe(false);
    expect(isAdAllowedPath("/privacy")).toBe(false);
    expect(isAdAllowedPath("/settings/notifications")).toBe(false);
  });
});

describe("shouldShowAds", () => {
  it("respects global ads flag", () => {
    expect(shouldShowAds({ pathname: "/", adsEnabled: false })).toBe(false);
    expect(shouldShowAds({ pathname: "/", adsEnabled: true })).toBe(true);
  });
});
