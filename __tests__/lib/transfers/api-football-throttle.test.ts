import { afterEach, describe, expect, it, vi } from "vitest";

import {
  API_FOOTBALL_MIN_REQUEST_INTERVAL_MS,
  isApiFootballRateLimitError,
  resetApiFootballThrottleForTests,
  waitForApiFootballSlot,
  withApiFootballRateLimitRetry,
} from "@/lib/transfers/providers/api-football-throttle";

describe("api-football throttle", () => {
  afterEach(() => {
    resetApiFootballThrottleForTests();
    vi.useRealTimers();
  });

  it("spaces consecutive requests by the minimum interval", async () => {
    vi.useFakeTimers();

    const first = waitForApiFootballSlot();
    await vi.advanceTimersByTimeAsync(0);
    await first;

    const second = waitForApiFootballSlot();
    await vi.advanceTimersByTimeAsync(API_FOOTBALL_MIN_REQUEST_INTERVAL_MS - 1);
    expect(vi.getTimerCount()).toBe(1);

    await vi.advanceTimersByTimeAsync(1);
    await second;
  });

  it("detects rate-limit API errors", () => {
    expect(
      isApiFootballRateLimitError(
        new Error(
          'API-Football: ["Too many requests. Your rate limit is 10 requests per minute."]',
        ),
      ),
    ).toBe(true);
    expect(isApiFootballRateLimitError(new Error("Not found"))).toBe(false);
  });

  it("retries after a rate-limit error", async () => {
    vi.useFakeTimers();

    let attempts = 0;
    const work = withApiFootballRateLimitRetry(async () => {
      attempts += 1;
      if (attempts === 1) {
        throw new Error(
          'API-Football: ["Too many requests. Your rate limit is 10 requests per minute."]',
        );
      }
      return "ok";
    });

    const resultPromise = work;
    await vi.runAllTimersAsync();
    await expect(resultPromise).resolves.toBe("ok");
    expect(attempts).toBe(2);
  });
});
