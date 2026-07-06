import { getBrowserGlobal, isBrowser } from "@/lib/ads/browser";

export const CONSENT_STORAGE_KEY = "kerkida-cookie-consent";
export const CONSENT_UPDATED_EVENT = "kerkida-consent-updated";

export interface ConsentPreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
  updatedAt: string;
}

export const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  decided: false,
  updatedAt: "",
};

export function parseConsentPreferences(
  raw: string | null | undefined,
): ConsentPreferences {
  if (!raw) {
    return DEFAULT_CONSENT;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (typeof parsed !== "object" || parsed === null) {
      return DEFAULT_CONSENT;
    }

    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      decided: Boolean(parsed.decided),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

export function serializeConsentPreferences(
  preferences: ConsentPreferences,
): string {
  return JSON.stringify(preferences);
}

export function buildConsentPreferences(input: {
  analytics: boolean;
  marketing: boolean;
}): ConsentPreferences {
  return {
    necessary: true,
    analytics: input.analytics,
    marketing: input.marketing,
    decided: true,
    updatedAt: new Date().toISOString(),
  };
}

export function hasMarketingConsent(preferences: ConsentPreferences): boolean {
  return preferences.decided && preferences.marketing;
}

export function hasAnalyticsConsent(preferences: ConsentPreferences): boolean {
  return preferences.decided && preferences.analytics;
}

export function readStoredConsent(): ConsentPreferences {
  if (!isBrowser()) {
    return DEFAULT_CONSENT;
  }

  const { localStorage } = getBrowserGlobal();
  if (!localStorage) {
    return DEFAULT_CONSENT;
  }

  return parseConsentPreferences(localStorage.getItem(CONSENT_STORAGE_KEY));
}

export function subscribeToConsent(onStoreChange: () => void): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  globalThis.addEventListener(CONSENT_UPDATED_EVENT, onStoreChange);
  return () => {
    globalThis.removeEventListener(CONSENT_UPDATED_EVENT, onStoreChange);
  };
}

export function writeStoredConsent(preferences: ConsentPreferences): void {
  if (!isBrowser()) {
    return;
  }

  const browser = getBrowserGlobal();
  if (!browser.localStorage) {
    return;
  }

  browser.localStorage.setItem(
    CONSENT_STORAGE_KEY,
    serializeConsentPreferences(preferences),
  );
  browser.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT));
}
