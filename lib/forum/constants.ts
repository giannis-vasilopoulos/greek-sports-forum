/** Reputation threshold to write in rival team sections (W3). */
export const REPUTATION_WRITE_OTHER_TEAMS = 30;

/** Rep at or below this triggers probable_troll pattern (T2). */
export const REPUTATION_PROBABLE_TROLL = -20;

/** Net post score at or below this collapses the post (P3). */
export const POST_COLLAPSE_SCORE = -5;

/** Distinct reports before a post is flagged (P4). */
export const POST_REPORT_FLAG_COUNT = 3;

/** Rep boundary for live match post rate (W10). */
export const LIVE_MATCH_SLOW_MODE_REP_THRESHOLD = 50;

/** Max posts per minute in a live match thread when rep < threshold (W10). */
export const LIVE_MATCH_POSTS_PER_MIN_LOW_REP = 1;

/** Max posts per minute in a live match thread when rep >= threshold (W10). */
export const LIVE_MATCH_POSTS_PER_MIN_HIGH_REP = 3;

export const SLOW_MODE_DAYS = 3;
export const SHADOW_BAN_DAYS = 7;
export const LEAGUE_BAN_DAYS = 30;

/** Minimum interval between posts under slow_mode (W7). */
export const SLOW_MODE_MIN_INTERVAL_MS = 15 * 60_000;

export const WATCH_COLLAPSED_POSTS = 3;
export const WATCH_WINDOW_DAYS = 7;
export const WATCH_CONFIRMED_REPORTS = 2;
export const PROBABLE_TROLL_REMOVALS = 5;
export const PROBABLE_TROLL_WINDOW_DAYS = 30;

export const reputationEventDeltas = {
  post_liked: 2,
  thread_liked: 3,
  best_answer: 10,
  post_downvoted: -1,
  post_removed: -10,
  warning_received: -15,
  report_confirmed: -20,
} as const;

export type ReputationEventType = keyof typeof reputationEventDeltas;
