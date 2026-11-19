// Greek formatting helpers (pure, server-safe). Calendar logic runs in Athens time,
// so server (UTC) and browser render the same label.
import { copy } from "@/lib/copy";
import type { Match, TransferKind } from "@/lib/kerkida/types";

const TIME_ZONE = "Europe/Athens";
const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }); // YYYY-MM-DD
const shortDate = new Intl.DateTimeFormat("el", {
  day: "numeric",
  month: "short",
  timeZone: TIME_ZONE,
});
const clock = new Intl.DateTimeFormat("el", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: TIME_ZONE,
});
const weekday = new Intl.DateTimeFormat("el", {
  weekday: "short",
  timeZone: TIME_ZONE,
});
const eur = new Intl.NumberFormat("el", { maximumFractionDigits: 1 });

export const numberEl = new Intl.NumberFormat("el");

/** "πριν 12 λ.", "πριν 2 ώρ.", "χθες" — use inside <time dateTime={iso}>. */
export function formatRelativeEl(iso: string, now: Date = new Date()): string {
  const t = copy.datetime;
  const date = new Date(iso);
  const diff = now.getTime() - date.getTime();
  if (diff < MINUTE_MS) return t.now;
  if (diff < HOUR_MS) return t.minutesAgo(Math.floor(diff / MINUTE_MS));
  if (diff < DAY_MS) return t.hoursAgo(Math.floor(diff / HOUR_MS));
  const days = Math.floor(diff / DAY_MS);
  if (days === 1) return t.yesterday;
  if (days < 7) return t.daysAgo(days);
  return shortDate.format(date);
}

/** Kick-off label for chips: "Σήμερα 21:00", "Αύριο 21:15", "Κυρ 18:00". */
export function formatKickoffEl(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const time = clock.format(date);
  const delta = Math.round(
    (Date.parse(dayKey.format(date)) - Date.parse(dayKey.format(now))) / DAY_MS,
  );
  if (delta === 0) return `${copy.datetime.today} ${time}`;
  if (delta === 1) return `${copy.datetime.tomorrow} ${time}`;
  if (delta > 1 && delta < 7) return `${weekday.format(date)} ${time}`;
  return `${shortDate.format(date)} ${time}`;
}

/** "€ 1,2 εκ.", "€ 850 χιλ.", "Δανεισμός", "Ελεύθερος", "—". */
export function formatFeeEl(
  kind: TransferKind,
  feeEur?: number | null,
): string {
  const t = copy.transfers.feeLabels;
  if (kind === "loan") return t.loan;
  if (kind === "loan_return") return t.loanReturn;
  if (kind === "free") return t.free;
  if (!feeEur) return "—";
  // 999_950+ would round to "1.000 χιλ."
  if (feeEur >= 999_950) return t.millions(eur.format(feeEur / 1_000_000));
  return t.thousands(eur.format(feeEur / 1000));
}

/** Screen-reader label for a match: "ΑΕΚ 2, ΠΑΟΚ 0, ζωντανά, 82ο λεπτό, Super League". */
export function matchAriaLabel(m: Match, now: Date = new Date()): string {
  const scored = m.homeScore != null && m.awayScore != null;
  const teams = scored
    ? `${m.home.name} ${m.homeScore}, ${m.away.name} ${m.awayScore}`
    : `${m.home.name} – ${m.away.name}`;
  let status: string;
  if (m.status === "scheduled") status = formatKickoffEl(m.kickoff, now);
  else if (m.status === "live" && m.minute)
    status = copy.match.liveMinute(m.minute.replace("′", ""));
  else status = copy.match.status[m.status];
  return `${teams}, ${status}, ${m.league.name}`;
}
