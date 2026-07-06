"use client";

import { useSyncExternalStore } from "react";

import {
  DEFAULT_CONSENT,
  parseConsentPreferences,
  readStoredConsent,
  serializeConsentPreferences,
  subscribeToConsent,
  type ConsentPreferences,
} from "@/lib/ads/consent";

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
