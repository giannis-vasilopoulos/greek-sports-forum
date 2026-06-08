export const notificationsCopy = {
  popover: {
    title: "Ειδοποιήσεις",
    empty: "Δεν υπάρχουν ειδοποιήσεις",
    viewAll: "Δες όλες",
  },
  page: {
    title: "Ειδοποιήσεις",
    description: "Οι ειδοποιήσεις σου στην ΚΕΡΚΙΔΑ.",
    empty: "Δεν έχεις ειδοποιήσεις ακόμα.",
    backToProfile: "Επιστροφή στο προφίλ",
  },
  nav: {
    label: "Ειδοποιήσεις",
  },
  genericActor: "Κάποιος",
  types: {
    reply: (actor: string) => `Ο ${actor} απάντησε στο post σου`,
    like: (actor: string) => `Το post σου πήρε like από τον ${actor}`,
    mention: (actor: string) => `Ο ${actor} σού ανέφερε σε post`,
    matchStarting: "Αγώνας ξεκινά σύντομα",
  },
} as const;
