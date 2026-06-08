import { authCopy } from "@/lib/copy/auth";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "ΚΕΡΚΙΔΑ";

export const seoCopy = {
  site: {
    name: siteName,
    defaultTitle: "ΚΕΡΚΙΔΑ — Greek Sports Forum",
    defaultDescription:
      "Η κερκίδα σου για κάθε πρωτάθλημα — συζητήσεις, match threads και ζωντανή κοινότητα αθλητικών φίλων.",
  },
  pages: {
    privacy: {
      titleSegment: "Πολιτική απορρήτου",
      heading: "Πολιτική απορρήτου",
      description:
        "Πώς η ΚΕΡΚΙΔΑ συλλέγει και προστατεύει τα προσωπικά σας δεδομένα.",
    },
    matchThreads: {
      titleSegment: "Match Threads",
      description:
        "Ζωντανές και επερχόμενες συζητήσεις αγώνων από όλα τα πρωταθληματα.",
      itemListName: "Match Threads",
    },
    standings: {
      titleSegment: "Βαθμολογίες",
      description:
        "Ζωντανές βαθμολογίες από τα κορυφαία ποδοσφαιρικά και μπασκετικά πρωταθλήματα.",
    },
    leagueStandings: {
      description: (leagueName: string) =>
        `Βαθμολογία και στατιστικά για το ${leagueName}.`,
    },
    signIn: {
      titleSegment: authCopy.signIn.title,
      description: authCopy.signIn.description,
    },
    signUp: {
      titleSegment: authCopy.signUp.title,
      description: authCopy.signUp.description,
    },
    onboarding: {
      titleSegment: "Fan profile",
      description: "Δημιούργησε το fan profile σου στην ΚΕΡΚΙΔΑ.",
    },
    profile: {
      titleSegment: "Το προφίλ μου",
      description: "Στοιχεία λογαριασμού και ενεργό fan profile στην ΚΕΡΚΙΔΑ.",
    },
    fanProfiles: {
      titleSegment: "Τα fan profiles μου",
      description: "Διαχείριση fan profiles ανά πρωτάθλημα στην ΚΕΡΚΙΔΑ.",
    },
    settings: {
      titleSegment: "Ρυθμίσεις",
      description: "Ρυθμίσεις λογαριασμού στην ΚΕΡΚΙΔΑ.",
    },
    notifications: {
      titleSegment: "Ειδοποιήσεις",
      description: "Οι ειδοποιήσεις σου στην ΚΕΡΚΙΔΑ.",
    },
  },
  breadcrumbs: {
    home: "Αρχική",
    matchThreads: "Match Threads",
    standings: "Βαθμολογίες",
  },
} as const;
