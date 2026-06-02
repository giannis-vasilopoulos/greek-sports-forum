import { seoCopy } from "@/lib/copy/seo";

export const adsCopy = {
  cookie: {
    bannerTitle: "Χρησιμοποιούμε cookies",
    bannerDescription:
      "Χρησιμοποιούμε cookies για αναλυτικά στοιχεία και διαφημίσεις. Μπορείτε να αποδεχτείτε, να απορρίψετε ή να ρυθμίσετε τις προτιμήσεις σας.",
    privacyLink: seoCopy.pages.privacy.heading,
    reject: "Απόρριψη",
    settings: "Ρυθμίσεις",
    accept: "Αποδοχή",
    floatingButton: "Cookies",
    settingsAria: "Ρυθμίσεις cookies",
    sheetTitle: "Ρυθμίσεις cookies",
    sheetDescriptionDecided:
      "Διαχειριστείτε τις προτιμήσεις σας για cookies και διαφημίσεις.",
    sheetDescriptionInitial: "Επιλέξτε ποιες κατηγορίες cookies επιτρέπετε.",
    requiredTitle: "Απαραίτητα",
    requiredDescription:
      "Απαιτούνται για τη λειτουργία του ιστότοπου και δεν μπορούν να απενεργοποιηθούν.",
    analyticsLabel: "Αναλυτικά",
    analyticsDescription: "Βοηθούν στην κατανόηση της χρήσης του ιστότοπου.",
    marketingLabel: "Διαφημίσεις",
    marketingDescription:
      "Επιτρέπουν την εμφάνιση εξατομικευμένων διαφημίσεων.",
    save: "Αποθήκευση",
    acceptAll: "Αποδοχή όλων",
    rejectAll: "Απόρριψη όλων",
    readPrivacyPrefix: "Διαβάστε την",
    readPrivacyLink: "πολιτική απορρήτου",
  },
  aria: {
    ad: "Διαφήμιση",
    adSlot: "Χώρος διαφήμισης",
  },
  houseAdPlaceholder: "Χώρος διαφήμισης",
} as const;
