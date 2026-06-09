export const transfersCopy = {
  pageTitle: "Μεταγραφές",
  leaguePageTitle: (leagueName: string) => `Μεταγραφές — ${leagueName}`,
  teamPageTitle: (teamName: string) => `Μεταγραφές — ${teamName}`,
  temporarilyUnavailable: "Προσωρινά μη διαθέσιμο",
  temporarilyUnavailableHint:
    "Οι μεταγραφές για αυτό το πρωτάθλημα θα προστεθούν σύντομα.",
  emptySync: "Δεν υπάρχουν μεταγραφές ακόμα. Δοκιμάστε ξανά αργότερα.",
  leagueTabsAriaLabel: "Επιλογή πρωταθλήματος",
  crossLinkRumors: "Δείτε τις φήμες της κοινότητας",
  hubSubtitle: "Επιλέξτε ομάδα για να δείτε τις μεταγραφές της.",
  backToHub: (leagueName: string) => `Όλες οι ομάδες — ${leagueName}`,
  teamGridAriaLabel: "Επιλογή ομάδας",
  directionTabsAriaLabel: "Φιλτράρισμα μεταγραφών",
  directionIn: "Άφιξη",
  directionOut: "Αποχώρηση",
  table: {
    player: "Παίκτης",
    from: "Από",
    to: "Σε",
    date: "Ημερομηνία",
    fee: "Αξία",
    direction: "Κίνηση",
    ariaLabel: "Πίνακας μεταγραφών",
  },
  feeLabels: {
    free: "Ελεύθερος",
    loan: "Δανεισμός",
    unknown: "Άγνωστο",
  },
} as const;

export function formatTransferFee(feeText: string | null | undefined): string {
  if (!feeText) return "—";
  const normalized = feeText.trim().toLowerCase();
  if (normalized === "free") return transfersCopy.feeLabels.free;
  if (normalized === "loan") return transfersCopy.feeLabels.loan;
  if (normalized === "n/a") return transfersCopy.feeLabels.unknown;
  return feeText;
}
