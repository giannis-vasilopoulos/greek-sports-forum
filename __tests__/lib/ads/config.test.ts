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
    expect(AD_SLOT_REGISTRY["match-threads-top"].minHeight).toBe(90);
    expect(AD_SLOT_REGISTRY["match-threads-mid"].format).toBe("rectangle");
    expect(AD_SLOT_REGISTRY["standings-top"].minHeight).toBe(90);
    expect(AD_SLOT_REGISTRY["standings-bottom"].format).toBe("rectangle");
    expect(AD_SLOT_REGISTRY["transfers-top"].minHeight).toBe(90);
    expect(AD_SLOT_REGISTRY["transfers-bottom"].format).toBe("rectangle");
  });

  it("computes reserved height including chrome", () => {
    expect(getSlotReservedHeight("match-threads-top")).toBe(118);
    expect(getSlotReservedHeight("match-threads-mid")).toBe(278);
    expect(getSlotReservedHeight("standings-top")).toBe(118);
    expect(getSlotReservedHeight("standings-bottom")).toBe(278);
    expect(getSlotReservedHeight("transfers-top")).toBe(118);
    expect(getSlotReservedHeight("transfers-bottom")).toBe(278);
  });

  it("reads feature flags from env", () => {
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADS_PROVIDER", "house");
    expect(isAdsEnabled()).toBe(true);
    expect(getAdsProvider()).toBe("house");
    expect(isAdSlotConfigured("match-threads-top")).toBe(true);
  });

  it("reads GA4 measurement id from env", () => {
    expect(getGa4MeasurementId()).toBeUndefined();

    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "  G-TEST123  ");
    expect(getGa4MeasurementId()).toBe("G-TEST123");
  });

  it("requires AdSense ids when provider is adsense", () => {
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADS_PROVIDER", "adsense");
    expect(isAdSlotConfigured("match-threads-top")).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-test");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_SLOT_MATCH_THREADS_TOP", "1234567890");
    expect(isAdSlotConfigured("match-threads-top")).toBe(true);

    vi.stubEnv("NEXT_PUBLIC_ADSENSE_SLOT_STANDINGS_TOP", "9876543210");
    expect(isAdSlotConfigured("standings-top")).toBe(true);
  });
});
