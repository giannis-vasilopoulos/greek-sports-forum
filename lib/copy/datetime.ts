export const datetimeCopy = {
  now: "τώρα",
  yesterday: "χθες",
  minutesAgo: (n: number) => `πριν ${n} λ.`,
  hoursAgo: (n: number) => `πριν ${n} ώρ.`,
  daysAgo: (n: number) => `πριν ${n} ημ.`,
  today: "Σήμερα",
  tomorrow: "Αύριο",
} as const;
