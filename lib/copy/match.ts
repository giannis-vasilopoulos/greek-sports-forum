export const matchCopy = {
  status: {
    live: "ζωντανά",
    halftime: "ημίχρονο",
    finished: "τελικό",
    postponed: "αναβολή",
    cancelled: "ακυρώθηκε",
  },
  liveMinute: (minute: string) => `ζωντανά, ${minute}ο λεπτό`,
} as const;
