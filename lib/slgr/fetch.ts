import {
  SLGR_BASE_URL,
  SLGR_FETCH_MAX_ATTEMPTS,
  SLGR_FETCH_RETRY_DELAY_MS,
  SLGR_FETCH_TIMEOUT_MS,
  slgrRequestHeaders,
} from "@/lib/slgr/constants";

function isRetryableFetchError(error: unknown): boolean {
  if (!(error instanceof TypeError) || error.message !== "fetch failed") {
    return false;
  }
  const cause = error.cause as { code?: string } | undefined;
  return (
    cause?.code === "UND_ERR_SOCKET" ||
    cause?.code === "ECONNRESET" ||
    cause?.code === "ETIMEDOUT"
  );
}

function slgrFetchHint(): string {
  const seasonFallback = process.env.SLGR_SEASON_ID?.trim();
  if (seasonFallback) {
    return "";
  }
  return " Set SLGR_SEASON_ID (e.g. 24) in .env.local as a fallback if SLGR is unreachable.";
}

/**
 * Fetches a path from the official Super League site (HTML scrape).
 * Layout changes on slgr.gr can break parsers — monitor cron failures.
 */
export async function fetchSlgr(path: string): Promise<string> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = `${SLGR_BASE_URL}${normalized}`;
  let lastError: unknown;

  for (let attempt = 1; attempt <= SLGR_FETCH_MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SLGR_FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        headers: slgrRequestHeaders(),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(
          `SLGR ${normalized}: HTTP ${res.status} — ${body.slice(0, 200)}`,
        );
      }

      return await res.text();
    } catch (error) {
      lastError = error;
      if (attempt < SLGR_FETCH_MAX_ATTEMPTS && isRetryableFetchError(error)) {
        await new Promise((r) =>
          setTimeout(r, SLGR_FETCH_RETRY_DELAY_MS * attempt),
        );
        continue;
      }
      break;
    } finally {
      clearTimeout(timeout);
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : "Unknown fetch error";
  throw new Error(`SLGR ${normalized}: ${message}.${slgrFetchHint()}`, {
    cause: lastError,
  });
}
