import { feedCopy } from "@/lib/copy/feed";

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

const t = feedCopy.relativeTime;

export function formatRelativeTime(date: Date, now = new Date()): string {
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < MINUTE_MS) {
    return t.now;
  }

  const minutes = Math.floor(diffMs / MINUTE_MS);
  if (minutes < 60) {
    return `${minutes}${t.minutesSuffix}`;
  }

  const hours = Math.floor(diffMs / HOUR_MS);
  if (hours < 24) {
    return `${hours}${t.hoursSuffix}`;
  }

  const days = Math.floor(diffMs / DAY_MS);
  return `${days}${t.daysSuffix}`;
}
