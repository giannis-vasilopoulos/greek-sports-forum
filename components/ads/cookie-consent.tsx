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
} from "@/lib/ads/use-consent-store";

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
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
      <div className="space-y-1">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        className="mt-1 size-4 shrink-0 accent-primary"
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
      <SheetContent side="bottom" className="max-h-[85vh] p-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ρυθμίσεις cookies</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground">Απαραίτητα</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Απαιτούνται για τη λειτουργία του ιστότοπου και δεν μπορούν να
              απενεργοποιηθούν.
            </p>
          </div>
          <ConsentToggle
            id="cookie-analytics"
            label="Αναλυτικά"
            description="Βοηθούν στην κατανόηση της χρήσης του ιστότοπου."
            checked={draftAnalytics}
            onChange={onDraftAnalyticsChange}
          />
          <ConsentToggle
            id="cookie-marketing"
            label="Διαφημίσεις"
            description="Επιτρέπουν την εμφάνιση εξατομικευμένων διαφημίσεων."
            checked={draftMarketing}
            onChange={onDraftMarketingChange}
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={onSave}>
            Αποθήκευση
          </Button>
          <Button type="button" variant="outline" onClick={onAcceptAll}>
            Αποδοχή όλων
          </Button>
          <Button type="button" variant="outline" onClick={onRejectAll}>
            Απόρριψη όλων
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Διαβάστε την{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            πολιτική απορρήτου
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
          className="fixed bottom-4 left-4 z-40 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          aria-label="Ρυθμίσεις cookies"
        >
          Cookies
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
          description="Διαχειριστείτε τις προτιμήσεις σας για cookies και διαφημίσεις."
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
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/90"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2
              id="cookie-consent-title"
              className="text-sm font-semibold text-foreground"
            >
              Χρησιμοποιούμε cookies
            </h2>
            <p
              id="cookie-consent-description"
              className="text-sm text-muted-foreground"
            >
              Χρησιμοποιούμε cookies για αναλυτικά στοιχεία και διαφημίσεις.
              Μπορείτε να αποδεχτείτε, να απορρίψετε ή να ρυθμίσετε τις
              προτιμήσεις σας.{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                Πολιτική απορρήτου
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={rejectAll}>
              Απόρριψη
            </Button>
            <Button type="button" variant="secondary" onClick={openSettings}>
              Ρυθμίσεις
            </Button>
            <Button type="button" onClick={acceptAll}>
              Αποδοχή
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
        description="Επιλέξτε ποιες κατηγορίες cookies επιτρέπετε."
      />
    </>
  );
}
