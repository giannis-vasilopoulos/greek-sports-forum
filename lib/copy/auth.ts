export const authCopy = {
  signUp: {
    title: "Εγγραφή",
    description: "Δημιούργησε δωρεάν λογαριασμό στην ΚΕΡΚΙΔΑ.",
    nameLabel: "Ονοματεπώνυμο",
    nameHint: "Για τον λογαριασμό σου. Δεν εμφανίζεται στις δημοσιεύσεις.",
    usernameLabel: "Όνομα χρήστη",
    usernameHint:
      "Εμφανίζεται δίπλα στις δημοσιεύσεις σου. 3–30 λατινικούς χαρακτήρες, αριθμοί ή _.",
    emailLabel: "Email",
    passwordLabel: "Κωδικός",
    submit: "Εγγραφή",
    submitPending: "Εγγραφή…",
    hasAccount: "Έχεις ήδη λογαριασμό;",
    signInLink: "Σύνδεση",
  },
  signIn: {
    title: "Σύνδεση",
    description: "Συνδέσου στον λογαριασμό σου στην ΚΕΡΚΙΔΑ.",
    emailLabel: "Email",
    passwordLabel: "Κωδικός",
    submit: "Σύνδεση",
    submitPending: "Σύνδεση…",
    invalidCredentials: "Λάθος email ή κωδικός. Δοκίμασε ξανά.",
    noAccount: "Δεν έχεις λογαριασμό;",
    signUpLink: "Εγγραφή",
  },
  signOut: {
    label: "Αποσύνδεση",
    pending: "Αποσύνδεση…",
  },
  passwordInput: {
    show: "Εμφάνιση κωδικού",
    hide: "Απόκρυψη κωδικού",
  },
  google: {
    continue: "Συνέχεια με Google",
    pending: "Μεταφορά στο Google…",
    error:
      "Η σύνδεση με Google απέτυχε. Έλεγξε τις ρυθμίσεις OAuth ή δοκίμασε ξανά.",
  },
  errors: {
    usernameInvalid:
      "Μη έγκυρο όνομα χρήστη. Χρησιμοποίησε 3–30 λατινικούς χαρακτήρες, αριθμούς ή _.",
    usernameTaken: "Το όνομα χρήστη χρησιμοποιείται ήδη.",
    emailTaken: "Υπάρχει ήδη λογαριασμός με αυτό το email.",
    signUpFailed:
      "Η εγγραφή απέτυχε. Έλεγξε τα στοιχεία σου και δοκίμασε ξανά.",
  },
  onboarding: {
    title: "Δημιούργησε fan profile",
    description:
      "Διάλεξε πρωτάθλημα και ομάδα για να συμμετέχεις στις συζητήσεις.",
    leagueLabel: "Πρωτάθλημα",
    leaguePlaceholder: "Επίλεξε πρωτάθλημα",
    favoriteTeamLabel: "Αγαπημένη ομάδα",
    favoriteTeamPlaceholder: "Προαιρετικό",
    displayNameLabel: "Όνομα εμφάνισης",
    displayNameHint:
      "Το όνομα που θα εμφανίζεται στις δημοσιεύσεις σου σε αυτό το πρωτάθλημα.",
    submit: "Συνέχεια",
    submitPending: "Αποθήκευση…",
    mustBeSignedIn: "Πρέπει να είσαι συνδεδεμένος.",
    profileConflict:
      "Έχεις ήδη fan profile σε αυτό το πρωτάθλημα ή το όνομα χρησιμοποιείται.",
    genericError: "Κάτι πήγε στραβά. Δοκίμασε ξανά.",
  },
} as const;
