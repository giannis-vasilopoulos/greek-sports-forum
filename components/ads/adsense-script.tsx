"use client";

import Script from "next/script";

import { hasMarketingConsent } from "@/lib/ads/consent";
import {
  getAdSenseClientId,
  getAdsProvider,
  isAdsEnabled,
} from "@/lib/ads/config";
import { useConsentPreferences } from "@/hooks/ads/use-consent-store";

export function AdsenseScript() {
  const consent = useConsentPreferences();
  const marketingGranted = hasMarketingConsent(consent);
  const clientId = getAdSenseClientId();
  const shouldLoad =
    isAdsEnabled() &&
    getAdsProvider() === "adsense" &&
    marketingGranted &&
    Boolean(clientId);

  if (!shouldLoad || !clientId) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="afterInteractive"
    />
  );
}
