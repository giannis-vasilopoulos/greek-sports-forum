import { describe, expect, it } from "vitest";

import { getBrowserGlobal, isBrowser } from "@/lib/ads/browser";

describe("browser helpers", () => {
  it("detects browser runtime in happy-dom", () => {
    expect(isBrowser()).toBe(true);
  });

  it("returns globalThis as browser global", () => {
    expect(getBrowserGlobal()).toBe(globalThis);
  });
});
