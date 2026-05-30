"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { AdDisclosure } from "@/components/ads/ad-disclosure";
import { HouseAd } from "@/components/ads/house/house-ad";
import { getBrowserGlobal } from "@/lib/ads/browser";
import { hasMarketingConsent } from "@/lib/ads/consent";
import { useConsentPreferences } from "@/lib/ads/use-consent-store";
import {
  AD_SLOT_REGISTRY,
  getAdSenseClientId,
  getAdSenseSlotUnitId,
  getAdsProvider,
  getSlotReservedHeight,
  isAdsEnabled,
  type AdSlotId,
} from "@/lib/ads/config";
import { shouldShowAds } from "@/lib/ads/should-show-ads";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  id: AdSlotId;
  className?: string;
}

function useMarketingConsentGranted(): boolean {
  const consent = useConsentPreferences();
  return hasMarketingConsent(consent);
}

function useLazyVisible(lazy: boolean): {
  ref: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!lazy);

  useEffect(() => {
    if (!lazy) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [lazy]);

  return { ref, visible };
}

function AdSenseUnit({ slotId }: { slotId: AdSlotId }) {
  const pushedRef = useRef(false);
  const clientId = getAdSenseClientId();
  const unitId = getAdSenseSlotUnitId(slotId);
  const slot = AD_SLOT_REGISTRY[slotId];

  useEffect(() => {
    if (pushedRef.current || !clientId || !unitId) {
      return;
    }

    pushedRef.current = true;
    try {
      const browser = getBrowserGlobal();
      (browser.adsbygoogle = browser.adsbygoogle ?? []).push({});
    } catch {
      pushedRef.current = false;
    }
  }, [clientId, unitId]);

  if (!clientId || !unitId) {
    return null;
  }

  return (
    <div className="overflow-hidden" style={{ height: slot.minHeight }}>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block", height: slot.minHeight }}
        data-ad-client={clientId}
        data-ad-slot={unitId}
        data-ad-format={slot.format === "rectangle" ? "rectangle" : "auto"}
        data-full-width-responsive={
          slot.format !== "rectangle" ? "true" : undefined
        }
      />
    </div>
  );
}

export function AdSlot({ id, className }: AdSlotProps) {
  const pathname = usePathname();
  const marketingGranted = useMarketingConsentGranted();
  const slot = AD_SLOT_REGISTRY[id];
  const { ref, visible } = useLazyVisible(slot.lazy);

  const adsEnabled = isAdsEnabled();
  const allowedOnRoute = shouldShowAds({ pathname, adsEnabled });
  const provider = getAdsProvider();

  if (!adsEnabled || !allowedOnRoute) {
    return null;
  }

  const showAdSense = marketingGranted && provider === "adsense" && visible;
  const reservedHeight = getSlotReservedHeight(id);

  return (
    <aside
      ref={ref}
      className={cn("mx-auto w-full max-w-6xl", className)}
      aria-label={marketingGranted ? "Διαφήμιση" : undefined}
      aria-hidden={!marketingGranted}
      data-ad-slot={id}
      data-ad-slot-active={marketingGranted ? "true" : "false"}
      style={{ minHeight: reservedHeight }}
    >
      {marketingGranted ? (
        <div className="flex flex-col gap-2">
          <AdDisclosure />
          {provider === "house" || !showAdSense ? (
            <HouseAd height={slot.minHeight} />
          ) : (
            <AdSenseUnit slotId={id} />
          )}
        </div>
      ) : null}
    </aside>
  );
}
