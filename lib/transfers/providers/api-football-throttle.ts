/** API-Football free tier: 10 requests/minute → ≥6000ms between calls; use a buffer. */
export const API_FOOTBALL_MIN_REQUEST_INTERVAL_MS = 6500;

const RATE_LIMIT_RETRY_MS = 60_000;
const RATE_LIMIT_MAX_RETRIES = 3;

let lastRequestAt = 0;

export function resetApiFootballThrottleForTests(): void {
  lastRequestAt = 0;
}

export async function waitForApiFootballSlot(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestAt;

  if (lastRequestAt > 0 && elapsed < API_FOOTBALL_MIN_REQUEST_INTERVAL_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, API_FOOTBALL_MIN_REQUEST_INTERVAL_MS - elapsed),
    );
  }

  lastRequestAt = Date.now();
}

export function isApiFootballRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("too many requests") ||
    message.includes("rate limit") ||
    message.includes("too manyrequests")
  );
}

export async function withApiFootballRateLimitRetry<T>(
  fn: () => Promise<T>,
): Promise<T> {
  for (let attempt = 0; attempt <= RATE_LIMIT_MAX_RETRIES; attempt++) {
    try {
      await waitForApiFootballSlot();
      return await fn();
    } catch (error) {
      const canRetry =
        isApiFootballRateLimitError(error) && attempt < RATE_LIMIT_MAX_RETRIES;

      if (!canRetry) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_RETRY_MS));
    }
  }

  throw new Error("API-Football: rate limit retries exhausted");
}
