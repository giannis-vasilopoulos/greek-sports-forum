"use client";

import { useSyncExternalStore } from "react";

import { isBrowser } from "@/lib/ads/browser";
import {
  CONSENT_UPDATED_EVENT,
  DEFAULT_CONSENT,
  parseConsentPreferences,
  readStoredConsent,
  serializeConsentPreferences,
  type ConsentPreferences,
} from "@/lib/ads/consent";

export function subscribeToConsent(onStoreChange: () => void): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  globalThis.addEventListener(CONSENT_UPDATED_EVENT, onStoreChange);
  return () => {
    globalThis.removeEventListener(CONSENT_UPDATED_EVENT, onStoreChange);
  };
}

function getConsentSnapshot(): string {
  return serializeConsentPreferences(readStoredConsent());
}

function getServerConsentSnapshot(): string {
  return serializeConsentPreferences(DEFAULT_CONSENT);
}

export function useConsentPreferences(): ConsentPreferences {
  const snapshot = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  return parseConsentPreferences(snapshot);
}

export function useClientHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
