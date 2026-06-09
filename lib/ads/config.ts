export const AD_SLOT_IDS = [
  "thread-top",
  "thread-in-content",
  "list-sidebar",
  "match-threads-top",
  "match-threads-mid",
  "league-sidebar",
  "standings-top",
  "standings-bottom",
  "transfers-top",
  "transfers-bottom",
] as const;

export type AdSlotId = (typeof AD_SLOT_IDS)[number];

export type AdsProvider = "house" | "adsense";

export interface AdSlotDefinition {
  id: AdSlotId;
  minHeight: number;
  format: "leaderboard" | "rectangle" | "responsive";
  lazy: boolean;
}

export const AD_SLOT_REGISTRY: Record<AdSlotId, AdSlotDefinition> = {
  "thread-top": {
    id: "thread-top",
    minHeight: 90,
    format: "leaderboard",
    lazy: false,
  },
  "thread-in-content": {
    id: "thread-in-content",
    minHeight: 250,
    format: "rectangle",
    lazy: true,
  },
  "list-sidebar": {
    id: "list-sidebar",
    minHeight: 250,
    format: "rectangle",
    lazy: true,
  },
  "match-threads-top": {
    id: "match-threads-top",
    minHeight: 90,
    format: "leaderboard",
    lazy: false,
  },
  "match-threads-mid": {
    id: "match-threads-mid",
    minHeight: 250,
    format: "rectangle",
    lazy: true,
  },
  "league-sidebar": {
    id: "league-sidebar",
    minHeight: 250,
    format: "rectangle",
    lazy: true,
  },
  "standings-top": {
    id: "standings-top",
    minHeight: 90,
    format: "leaderboard",
    lazy: false,
  },
  "standings-bottom": {
    id: "standings-bottom",
    minHeight: 250,
    format: "rectangle",
    lazy: true,
  },
  "transfers-top": {
    id: "transfers-top",
    minHeight: 90,
    format: "leaderboard",
    lazy: false,
  },
  "transfers-bottom": {
    id: "transfers-bottom",
    minHeight: 250,
    format: "rectangle",
    lazy: true,
  },
};

/** Disclosure label + gap above the creative area. */
export const AD_SLOT_CHROME_HEIGHT = 28;

export function getSlotReservedHeight(slotId: AdSlotId): number {
  return AD_SLOT_REGISTRY[slotId].minHeight + AD_SLOT_CHROME_HEIGHT;
}

export function isAdsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
}

export function getAdsProvider(): AdsProvider {
  const provider = process.env.NEXT_PUBLIC_ADS_PROVIDER;
  return provider === "adsense" ? "adsense" : "house";
}

export function getAdSenseClientId(): string | undefined {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  return clientId || undefined;
}

export function getAdSenseSlotUnitId(slotId: AdSlotId): string | undefined {
  const envKey = `NEXT_PUBLIC_ADSENSE_SLOT_${slotId.toUpperCase().replace(/-/g, "_")}`;
  const unitId = process.env[envKey]?.trim();
  return unitId || undefined;
}

export function getGa4MeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA4_ID?.trim();
  return id || undefined;
}

export function isAdSlotConfigured(slotId: AdSlotId): boolean {
  if (!isAdsEnabled()) {
    return false;
  }

  if (getAdsProvider() === "house") {
    return true;
  }

  return Boolean(getAdSenseClientId() && getAdSenseSlotUnitId(slotId));
}
