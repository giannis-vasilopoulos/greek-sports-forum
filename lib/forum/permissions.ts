import { copy } from "@/lib/copy";
import {
  LIVE_MATCH_POSTS_PER_MIN_HIGH_REP,
  LIVE_MATCH_POSTS_PER_MIN_LOW_REP,
  LIVE_MATCH_SLOW_MODE_REP_THRESHOLD,
  REPUTATION_WRITE_OTHER_TEAMS,
  SLOW_MODE_MIN_INTERVAL_MS,
} from "@/lib/forum/constants";
import {
  type SanctionRecord,
  isSanctionActive,
  shouldCollapsePost,
} from "@/lib/forum/moderation";

export type UserRole = "user" | "moderator" | "admin";

export type WriteContext =
  | { kind: "league_feed"; leagueId: number }
  | { kind: "team_section"; leagueId: number; teamId: number };

export type ThreadContext = {
  leagueId: number;
  teamId: number | null;
  isLocked: boolean;
  type?: "discussion" | "match_thread" | "news" | "poll" | "transfer_rumor";
  matchStatus?:
    | "scheduled"
    | "live"
    | "halftime"
    | "finished"
    | "postponed"
    | "cancelled"
    | null;
};

export type WriteSubject = {
  userId: string | null;
  role: UserRole | null;
  fanProfile: {
    id: number;
    leagueId: number;
    favoriteTeamId: number;
    reputation: number;
    trustStatus: "normal" | "watch" | "probable_troll";
  } | null;
  activeSanctions: SanctionRecord[];
};

export type VoteSubject = {
  userId: string | null;
  fanProfile: { id: number; leagueId: number } | null;
};

export type VoteTarget = {
  postId: number;
  authorFanProfileId: number;
  thread: { leagueId: number };
};

export type WriteRestriction = {
  kind: "league_ban" | "account_ban" | "slow_mode" | "live_match_rate_limit";
  message: string;
  retryAfter?: Date;
  maxPerMinute?: number;
};

export type RateLimitContext = {
  leagueId: number;
  thread?: ThreadContext;
  lastPostAt?: Date | null;
  postsInLastMinute?: number;
  now?: Date;
};

function isModerator(role: UserRole | null): boolean {
  return role === "moderator" || role === "admin";
}

function getLeagueId(context: WriteContext): number {
  return context.leagueId;
}

function hasActiveAccountBan(sanctions: SanctionRecord[], now: Date): boolean {
  return sanctions.some(
    (s) =>
      s.type === "account_ban" &&
      isSanctionActive(s, now) &&
      s.leagueId === null,
  );
}

function hasActiveLeagueBan(
  sanctions: SanctionRecord[],
  leagueId: number,
  now: Date,
): boolean {
  return sanctions.some(
    (s) =>
      s.type === "league_ban" &&
      s.leagueId === leagueId &&
      isSanctionActive(s, now),
  );
}

function hasActiveSlowMode(
  sanctions: SanctionRecord[],
  leagueId: number,
  now: Date,
): SanctionRecord | undefined {
  return sanctions.find(
    (s) =>
      s.type === "slow_mode" &&
      s.leagueId === leagueId &&
      isSanctionActive(s, now),
  );
}

function isLiveMatchThread(thread?: ThreadContext): boolean {
  return thread?.type === "match_thread" && thread.matchStatus === "live";
}

export function getLiveMatchPostsPerMinute(reputation: number): number {
  return reputation >= LIVE_MATCH_SLOW_MODE_REP_THRESHOLD
    ? LIVE_MATCH_POSTS_PER_MIN_HIGH_REP
    : LIVE_MATCH_POSTS_PER_MIN_LOW_REP;
}

export function canVote(voter: VoteSubject, post: VoteTarget): boolean {
  if (!voter.userId || !voter.fanProfile) {
    return false;
  }

  if (voter.fanProfile.id === post.authorFanProfileId) {
    return false;
  }

  return voter.fanProfile.leagueId === post.thread.leagueId;
}

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

function resolveWriteContext(thread: ThreadContext): WriteContext {
  if (thread.teamId === null) {
    return { kind: "league_feed", leagueId: thread.leagueId };
  }

  return {
    kind: "team_section",
    leagueId: thread.leagueId,
    teamId: thread.teamId,
  };
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

export { shouldCollapsePost as postShouldCollapse };
