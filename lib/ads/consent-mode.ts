import { getBrowserGlobal, isBrowser } from "@/lib/ads/browser";
import type { ConsentPreferences } from "@/lib/ads/consent";

type GtagConsentCommand = "consent";
type GtagConsentAction = "default" | "update";

type GtagConsentParams = Record<string, "granted" | "denied">;

function gtag(
  command: GtagConsentCommand,
  action: GtagConsentAction,
  params: GtagConsentParams,
): void {
  const browser = getBrowserGlobal();
  browser.dataLayer = browser.dataLayer ?? [];
  browser.dataLayer.push(["consent", action, params]);
}

export const CONSENT_MODE_DEFAULT_SCRIPT = `
globalThis.dataLayer = globalThis.dataLayer || [];
function gtag(){globalThis.dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
`;

export function applyConsentModeUpdate(preferences: ConsentPreferences): void {
  if (!isBrowser()) {
    return;
  }

  gtag("consent", "update", {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: preferences.marketing ? "granted" : "denied",
    ad_user_data: preferences.marketing ? "granted" : "denied",
    ad_personalization: preferences.marketing ? "granted" : "denied",
  });
}
