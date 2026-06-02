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
        "Ζωντανές και επερχόμενες συζητήσεις αγώνων από όλα τα πρωτάθληματα.",
      itemListName: "Match Threads",
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
  },
  breadcrumbs: {
    home: "Αρχική",
    matchThreads: "Match Threads",
  },
} as const;
