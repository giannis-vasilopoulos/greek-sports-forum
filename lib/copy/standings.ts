export const standingsCopy = {
  pageTitle: "Βαθμολογίες",
  leaguePageTitle: (leagueName: string) => `Βαθμολογία — ${leagueName}`,
  temporarilyUnavailable: "Προσωρινά μη διαθέσιμο",
  temporarilyUnavailableHint:
    "Η βαθμολογία για αυτό το πρωτάθλημα θα προστεθεί σύντομα.",
  emptySync:
    "Δεν υπάρχουν δεδομένα βαθμολογίας ακόμα. Δοκιμάστε ξανά αργότερα.",
  phaseSeparatorPlayoffs: "Ζώνη πλέι-οφ",
  phaseSeparatorPlayouts: "Ζώνη πλέι-άουτ",
  table: {
    rank: "Θέση",
    team: "Ομάδα",
    played: "Αγ.",
    won: "Ν",
    drawn: "Ι",
    lost: "Η",
    goalsFor: "Γ",
    goalsAgainst: "Κ",
    points: "Βαθμοί",
    ariaLabel: "Πίνακας βαθμολογίας",
  },
  leagueTabsAriaLabel: "Επιλογή πρωταθλήματος",
  backToOverview: "Όλες οι βαθμολογίες",
} as const;
