import { afterEach, describe, expect, it, vi } from "vitest";

import {
  AD_SLOT_REGISTRY,
  getAdsProvider,
  getGa4MeasurementId,
  getSlotReservedHeight,
  isAdSlotConfigured,
  isAdsEnabled,
} from "@/lib/ads/config";

describe("ads config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("exposes slot registry dimensions", () => {
    expect(AD_SLOT_REGISTRY["home-leaderboard"].minHeight).toBe(90);
    expect(AD_SLOT_REGISTRY["home-mid"].format).toBe("rectangle");
  });

  it("computes reserved height including chrome", () => {
    expect(getSlotReservedHeight("home-leaderboard")).toBe(118);
    expect(getSlotReservedHeight("home-mid")).toBe(278);
  });

  it("reads feature flags from env", () => {
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADS_PROVIDER", "house");
    expect(isAdsEnabled()).toBe(true);
    expect(getAdsProvider()).toBe("house");
    expect(isAdSlotConfigured("home-leaderboard")).toBe(true);
  });

  it("reads GA4 measurement id from env", () => {
    expect(getGa4MeasurementId()).toBeUndefined();

    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "  G-TEST123  ");
    expect(getGa4MeasurementId()).toBe("G-TEST123");
  });

  it("requires AdSense ids when provider is adsense", () => {
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADS_PROVIDER", "adsense");
    expect(isAdSlotConfigured("home-leaderboard")).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-test");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_SLOT_HOME_LEADERBOARD", "1234567890");
    expect(isAdSlotConfigured("home-leaderboard")).toBe(true);
  });
});
