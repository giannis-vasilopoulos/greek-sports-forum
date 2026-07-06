"use client";

import { useConsentPreferences } from "@/hooks/ads/use-consent-store";
import { hasMarketingConsent } from "@/lib/ads/consent";

export function useMarketingConsentGranted(): boolean {
  const consent = useConsentPreferences();
  return hasMarketingConsent(consent);
}
