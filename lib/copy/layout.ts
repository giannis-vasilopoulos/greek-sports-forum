import { seoCopy } from "@/lib/copy/seo";

export const layoutCopy = {
  brand: seoCopy.site.name,
  tagline: "Η κερκίδα σου για κάθε league",
  nav: {
    matchThreads: "Match Threads",
    standings: "Βαθμολογίες",
    liveMatchesAria: "Ζωντανά ματς",
    openMenuAria: "Άνοιγμα μενού",
  },
  header: {
    signIn: "Σύνδεση",
    signUp: "Εγγραφή",
  },
  footer: {
    leaguesHeading: "Leagues",
    infoHeading: "Πληροφορίες",
    about: "Σχετικά με εμάς",
    terms: "Όροι χρήσης",
    privacy: seoCopy.pages.privacy.heading,
    contact: "Επικοινωνία",
    copyright: "© 2025 Κερκίδα. Με επιφύλαξη παντός δικαιώματος.",
    madeFor: "Φτιαγμένο για Έλληνες φίλαθλους",
  },
  notifications: {
    label: "Ειδοποιήσεις",
    unreadSuffix: "αδιάβαστες",
  },
  mobileNav: {
    activeFanProfile: "Ενεργό fan profile",
    leaguesHeading: "Leagues",
    myProfile: "Το προφίλ μου",
    myFanProfiles: "Τα fan profiles μου",
    settings: "Ρυθμίσεις",
    switchFanProfile: "Αλλαγή fan profile",
  },
} as const;

export function notificationsAriaLabel(unreadCount: number): string {
  const { label, unreadSuffix } = layoutCopy.notifications;
  if (unreadCount > 0) {
    return `${label}, ${unreadCount} ${unreadSuffix}`;
  }
  return label;
}
