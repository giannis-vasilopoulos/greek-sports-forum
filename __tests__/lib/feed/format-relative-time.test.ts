import { describe, expect, it } from "vitest";

import { formatRelativeTime } from "@/lib/feed/format-relative-time";

describe("formatRelativeTime", () => {
  const now = new Date("2026-06-01T12:00:00Z");

  it("returns τώρα for under a minute", () => {
    expect(formatRelativeTime(new Date("2026-06-01T11:59:30Z"), now)).toBe(
      "τώρα",
    );
  });

  it("returns minutes in Greek shorthand", () => {
    expect(formatRelativeTime(new Date("2026-06-01T11:58:00Z"), now)).toBe(
      "2λ",
    );
  });

  it("returns hours in Greek shorthand", () => {
    expect(formatRelativeTime(new Date("2026-06-01T10:00:00Z"), now)).toBe(
      "2ώ",
    );
  });
});
