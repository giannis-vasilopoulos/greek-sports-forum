import { copy } from "@/lib/copy";
import {
  REPUTATION_WRITE_OTHER_TEAMS,
  SLOW_MODE_MIN_INTERVAL_MS,
} from "@/lib/forum/constants";

import {
  getLeagueId,
  hasActiveAccountBan,
  hasActiveLeagueBan,
  hasActiveSlowMode,
  isLiveMatchThread,
  isModerator,
  resolveWriteContext,
} from "./helpers";
import { getLiveMatchPostsPerMinute } from "./rate-limit";
import type {
  RateLimitContext,
  ThreadContext,
  WriteContext,
  WriteRestriction,
  WriteSubject,
} from "./types";

export function canWrite(
  context: WriteContext,
  subject: WriteSubject,
): boolean {
  if (!subject.userId || !subject.fanProfile) {
    return false;
  }

  const now = new Date();

  if (hasActiveAccountBan(subject.activeSanctions, now)) {
    return false;
  }

  const leagueId = getLeagueId(context);

  if (subject.fanProfile.leagueId !== leagueId) {
    return false;
  }

  if (hasActiveLeagueBan(subject.activeSanctions, leagueId, now)) {
    return false;
  }

  if (isModerator(subject.role)) {
    return true;
  }

  if (context.kind === "league_feed") {
    return true;
  }

  if (context.teamId === subject.fanProfile.favoriteTeamId) {
    return true;
  }

  return subject.fanProfile.reputation >= REPUTATION_WRITE_OTHER_TEAMS;
}

export function canReply(
  thread: ThreadContext,
  subject: WriteSubject,
): boolean {
  if (!canWrite(resolveWriteContext(thread), subject)) {
    return false;
  }

  if (thread.isLocked && !isModerator(subject.role)) {
    return false;
  }

  return true;
}

export function getWriteRestriction(
  subject: WriteSubject,
  rateLimit: RateLimitContext,
): WriteRestriction | null {
  if (!subject.userId || !subject.fanProfile) {
    return null;
  }

  const now = rateLimit.now ?? new Date();

  if (hasActiveAccountBan(subject.activeSanctions, now)) {
    return {
      kind: "account_ban",
      message: copy.moderation.accountBan,
    };
  }

  if (hasActiveLeagueBan(subject.activeSanctions, rateLimit.leagueId, now)) {
    return {
      kind: "league_ban",
      message: copy.moderation.leagueBan,
    };
  }

  if (isModerator(subject.role)) {
    return null;
  }

  const slowMode = hasActiveSlowMode(
    subject.activeSanctions,
    rateLimit.leagueId,
    now,
  );

  if (slowMode && rateLimit.lastPostAt) {
    const elapsed = now.getTime() - rateLimit.lastPostAt.getTime();
    if (elapsed < SLOW_MODE_MIN_INTERVAL_MS) {
      return {
        kind: "slow_mode",
        message: copy.moderation.slowMode,
        retryAfter: new Date(
          rateLimit.lastPostAt.getTime() + SLOW_MODE_MIN_INTERVAL_MS,
        ),
      };
    }
  }

  if (
    rateLimit.thread &&
    isLiveMatchThread(rateLimit.thread) &&
    rateLimit.postsInLastMinute !== undefined
  ) {
    const maxPerMinute = getLiveMatchPostsPerMinute(
      subject.fanProfile.reputation,
    );

    if (rateLimit.postsInLastMinute >= maxPerMinute) {
      return {
        kind: "live_match_rate_limit",
        message: copy.forum.liveMatchRateLimit,
        maxPerMinute,
        retryAfter: new Date(now.getTime() + 60_000),
      };
    }
  }

  return null;
}

export function writeBlockReason(
  context: WriteContext,
  subject: WriteSubject,
): string | null {
  if (!subject.userId) {
    return copy.forum.guestWriteBlocked;
  }

  if (!subject.fanProfile) {
    return copy.forum.noFanProfile;
  }

  const now = new Date();
  const leagueId = getLeagueId(context);

  if (hasActiveAccountBan(subject.activeSanctions, now)) {
    return copy.moderation.accountBan;
  }

  if (hasActiveLeagueBan(subject.activeSanctions, leagueId, now)) {
    return copy.moderation.leagueBan;
  }

  if (isModerator(subject.role)) {
    return null;
  }

  if (
    context.kind === "team_section" &&
    context.teamId !== subject.fanProfile.favoriteTeamId &&
    subject.fanProfile.reputation < REPUTATION_WRITE_OTHER_TEAMS
  ) {
    return copy.forum.otherTeamReputationGate;
  }

  return null;
}
