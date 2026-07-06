import { type SanctionRecord, isSanctionActive } from "@/lib/forum/moderation";

import type { ThreadContext, UserRole, WriteContext } from "./types";

export function isModerator(role: UserRole | null): boolean {
  return role === "moderator" || role === "admin";
}

export function getLeagueId(context: WriteContext): number {
  return context.leagueId;
}

export function hasActiveAccountBan(
  sanctions: SanctionRecord[],
  now: Date,
): boolean {
  return sanctions.some(
    (s) =>
      s.type === "account_ban" &&
      isSanctionActive(s, now) &&
      s.leagueId === null,
  );
}

export function hasActiveLeagueBan(
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

export function hasActiveSlowMode(
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

export function isLiveMatchThread(thread?: ThreadContext): boolean {
  return thread?.type === "match_thread" && thread.matchStatus === "live";
}

export function resolveWriteContext(thread: ThreadContext): WriteContext {
  if (thread.teamId === null) {
    return { kind: "league_feed", leagueId: thread.leagueId };
  }

  return {
    kind: "team_section",
    leagueId: thread.leagueId,
    teamId: thread.teamId,
  };
}
