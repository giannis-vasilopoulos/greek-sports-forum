export const SLGR_BASE_URL = "https://www.slgr.gr";

export const SLGR_FETCH_TIMEOUT_MS = 30_000;

export const SLGR_FETCH_MAX_ATTEMPTS = 3;

export const SLGR_FETCH_RETRY_DELAY_MS = 500;

/**
 * SLGR/nginx rejects non-browser User-Agents (connection closed with no body).
 * Use standard browser headers for seed/cron scrapes.
 */
export function slgrRequestHeaders(): HeadersInit {
  return {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "el-GR,el;q=0.9,en-US;q=0.8,en;q=0.7",
    Referer: `${SLGR_BASE_URL}/el/`,
    "Cache-Control": "no-cache",
  };
}
