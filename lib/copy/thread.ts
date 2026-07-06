export const threadCopy = {
  breadcrumb: {
    league: "Πρωτάθλημα",
    threads: "Συζητήσεις",
  },
  header: {
    locked: "Κλειδωμένο",
    activeAgo: (time: string) => `ενεργό πριν ${time}`,
  },
  composer: {
    label: "Η απάντησή σου",
    placeholder: "Γράψε την άποψή σου…",
    submit: "Αποστολή",
    submitting: "Αποστολή…",
    guestSubmitHint: "Σύνδεση για δημοσίευση",
    draftRestored:
      "Η απάντησή σου αποθηκεύτηκε — δημοσίευσέ την όταν είσαι έτοιμος.",
    posted: "Η απάντησή σου δημοσιεύτηκε.",
    replyTo: (author: string) => `Απάντηση σε ${author}`,
    cancelReply: "Ακύρωση",
    signInPrompt: "Συνδέσου για να συμμετέχεις στη συζήτηση.",
    signInLink: "Σύνδεση",
    fanProfilePrompt: "Ολοκλήρωσε το fan profile σου για αυτό το πρωτάθλημα.",
    fanProfileLink: "Fan profile",
    rateLimitWait: "Περίμενε λίγο πριν ξαναγράψεις.",
    expandComposer: "Άνοιγμα πεδίου απάντησης",
    collapseComposer: "Σύμπτυξη",
  },
  post: {
    reply: "Απάντηση",
    op: "Αρχική δημοσίευση",
    listAriaLabel: "Απαντήσεις στο θέμα",
  },
  vote: {
    up: "Θετική ψήφος",
    down: "Αρνητική ψήφος",
    score: (score: number) => `${score} βαθμοί`,
    signInToVote: "Σύνδεση για ψήφο",
  },
  conversion: {
    joinDiscussion: "Μπες στη συζήτηση — γράψε την άποψή σου.",
  },
  errors: {
    generic: "Η αποστολή απέτυχε. Δοκίμασε ξανά.",
    mustBeSignedIn: "Πρέπει να συνδεθείς για να απαντήσεις.",
    needFanProfile: "Χρειάζεσαι fan profile για αυτό το πρωτάθλημα.",
  },
} as const;
