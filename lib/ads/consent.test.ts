import { describe, expect, it } from "vitest";

import {
  buildConsentPreferences,
  DEFAULT_CONSENT,
  hasAnalyticsConsent,
  hasMarketingConsent,
  parseConsentPreferences,
  serializeConsentPreferences,
} from "@/lib/ads/consent";

describe("parseConsentPreferences", () => {
  it("returns defaults for invalid input", () => {
    expect(parseConsentPreferences(null)).toEqual(DEFAULT_CONSENT);
    expect(parseConsentPreferences("not-json")).toEqual(DEFAULT_CONSENT);
  });

  it("parses stored consent", () => {
    const raw = serializeConsentPreferences(
      buildConsentPreferences({ analytics: true, marketing: false }),
    );

    expect(parseConsentPreferences(raw)).toEqual({
      necessary: true,
      analytics: true,
      marketing: false,
      decided: true,
      updatedAt: expect.any(String),
    });
  });
});

describe("consent helpers", () => {
  it("requires decided flag for marketing and analytics consent", () => {
    expect(
      hasMarketingConsent({
        ...DEFAULT_CONSENT,
        marketing: true,
        decided: false,
      }),
    ).toBe(false);

    expect(
      hasMarketingConsent(
        buildConsentPreferences({ analytics: false, marketing: true }),
      ),
    ).toBe(true);

    expect(
      hasAnalyticsConsent(
        buildConsentPreferences({ analytics: true, marketing: false }),
      ),
    ).toBe(true);
  });
});
