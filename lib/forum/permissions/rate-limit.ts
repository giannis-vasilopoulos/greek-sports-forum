import {
  LIVE_MATCH_POSTS_PER_MIN_HIGH_REP,
  LIVE_MATCH_POSTS_PER_MIN_LOW_REP,
  LIVE_MATCH_SLOW_MODE_REP_THRESHOLD,
} from "@/lib/forum/constants";

export function getLiveMatchPostsPerMinute(reputation: number): number {
  return reputation >= LIVE_MATCH_SLOW_MODE_REP_THRESHOLD
    ? LIVE_MATCH_POSTS_PER_MIN_HIGH_REP
    : LIVE_MATCH_POSTS_PER_MIN_LOW_REP;
}
