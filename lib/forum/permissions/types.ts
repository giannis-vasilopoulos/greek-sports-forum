import type { SanctionRecord } from "@/lib/forum/moderation";

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
