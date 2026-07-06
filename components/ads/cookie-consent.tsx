"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { applyConsentModeUpdate } from "@/lib/ads/consent-mode";
import {
  buildConsentPreferences,
  readStoredConsent,
  writeStoredConsent,
  type ConsentPreferences,
} from "@/lib/ads/consent";
import {
  useClientHydrated,
  useConsentPreferences,
} from "@/hooks/ads/use-consent-store";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const c = copy.ads.cookie;

function ConsentToggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="border-border flex items-start justify-between gap-4 rounded-lg border p-4">
      <div className="space-y-1">
        <label htmlFor={id} className="text-foreground text-sm font-medium">
          {label}
        </label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        className="accent-primary mt-1 size-4 shrink-0"
      />
    </div>
  );
}

function CookieSettingsSheet({
  open,
  onOpenChange,
  draftAnalytics,
  draftMarketing,
  onDraftAnalyticsChange,
  onDraftMarketingChange,
  onSave,
  onRejectAll,
  onAcceptAll,
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftAnalytics: boolean;
  draftMarketing: boolean;
  onDraftAnalyticsChange: (value: boolean) => void;
  onDraftMarketingChange: (value: boolean) => void;
  onSave: () => void;
  onRejectAll: () => void;
  onAcceptAll: () => void;
  description: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle>{c.sheetTitle}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          <div className="border-border bg-muted/30 rounded-lg border p-4">
            <p className="text-foreground text-sm font-medium">
              {c.requiredTitle}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {c.requiredDescription}
            </p>
          </div>
          <ConsentToggle
            id="cookie-analytics"
            label={c.analyticsLabel}
            description={c.analyticsDescription}
            checked={draftAnalytics}
            onChange={onDraftAnalyticsChange}
          />
          <ConsentToggle
            id="cookie-marketing"
            label={c.marketingLabel}
            description={c.marketingDescription}
            checked={draftMarketing}
            onChange={onDraftMarketingChange}
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={onSave}>
            {c.save}
          </Button>
          <Button type="button" variant="outline" onClick={onAcceptAll}>
            {c.acceptAll}
          </Button>
          <Button type="button" variant="outline" onClick={onRejectAll}>
            {c.rejectAll}
          </Button>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          {c.readPrivacyPrefix}{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            {c.readPrivacyLink}
          </Link>
          .
        </p>
      </SheetContent>
    </Sheet>
  );
}

export function CookieConsent() {
  const hydrated = useClientHydrated();
  const preferences = useConsentPreferences();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draftAnalytics, setDraftAnalytics] = useState(preferences.analytics);
  const [draftMarketing, setDraftMarketing] = useState(preferences.marketing);

  useEffect(() => {
    applyConsentModeUpdate(readStoredConsent());
  }, []);

  const openSettings = () => {
    setDraftAnalytics(preferences.analytics);
    setDraftMarketing(preferences.marketing);
    setSettingsOpen(true);
  };

  const persistPreferences = (next: ConsentPreferences) => {
    writeStoredConsent(next);
    applyConsentModeUpdate(next);
    setSettingsOpen(false);
  };

  const acceptAll = () => {
    persistPreferences(
      buildConsentPreferences({ analytics: true, marketing: true }),
    );
  };

  const rejectAll = () => {
    persistPreferences(
      buildConsentPreferences({ analytics: false, marketing: false }),
    );
  };

  const saveSettings = () => {
    persistPreferences(
      buildConsentPreferences({
        analytics: draftAnalytics,
        marketing: draftMarketing,
      }),
    );
  };

  if (!hydrated) {
    return null;
  }

  if (preferences.decided) {
    return (
      <>
        <button
          type="button"
          onClick={openSettings}
          className={cn(
            "border-border bg-background text-muted-foreground hover:text-foreground fixed left-4 z-40 rounded-full border px-3 py-1.5 text-xs shadow-sm transition-colors",
            "bottom-[calc(var(--bottom-chrome-height,0px)+0.75rem+env(safe-area-inset-bottom,0px))]",
            "lg:bottom-4",
          )}
          aria-label={c.settingsAria}
        >
          {c.floatingButton}
        </button>
        <CookieSettingsSheet
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          draftAnalytics={draftAnalytics}
          draftMarketing={draftMarketing}
          onDraftAnalyticsChange={setDraftAnalytics}
          onDraftMarketingChange={setDraftMarketing}
          onSave={saveSettings}
          onRejectAll={rejectAll}
          onAcceptAll={acceptAll}
          description={c.sheetDescriptionDecided}
        />
      </>
    );
  }

  return (
    <>
      <dialog
        open={true}
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
        className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/90 fixed inset-x-0 bottom-0 z-50 w-full border-t p-4 shadow-lg backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2
              id="cookie-consent-title"
              className="text-foreground text-sm font-semibold"
            >
              {c.bannerTitle}
            </h2>
            <p
              id="cookie-consent-description"
              className="text-muted-foreground text-sm"
            >
              {c.bannerDescription}{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                {c.privacyLink}
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={acceptAll}>
              {c.accept}
            </Button>

            <Button type="button" variant="outline" onClick={rejectAll}>
              {c.reject}
            </Button>
            <Button type="button" variant="secondary" onClick={openSettings}>
              {c.settings}
            </Button>
          </div>
        </div>
      </dialog>

      <CookieSettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        draftAnalytics={draftAnalytics}
        draftMarketing={draftMarketing}
        onDraftAnalyticsChange={setDraftAnalytics}
        onDraftMarketingChange={setDraftMarketing}
        onSave={saveSettings}
        onRejectAll={rejectAll}
        onAcceptAll={acceptAll}
        description={c.sheetDescriptionInitial}
      />
    </>
  );
}
