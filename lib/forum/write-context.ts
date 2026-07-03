import type { ThreadContext } from "@/lib/forum/permissions";

export function resolveWriteContext(thread: {
  leagueId: number;
  teamId: number | null;
}) {
  if (thread.teamId === null) {
    return { kind: "league_feed" as const, leagueId: thread.leagueId };
  }

  return {
    kind: "team_section" as const,
    leagueId: thread.leagueId,
    teamId: thread.teamId,
  };
}

export function toThreadContext(thread: {
  leagueId: number;
  teamId: number | null;
  isLocked: boolean;
  type: ThreadContext["type"];
  matchStatus: ThreadContext["matchStatus"];
}): ThreadContext {
  return {
    leagueId: thread.leagueId,
    teamId: thread.teamId,
    isLocked: thread.isLocked,
    type: thread.type,
    matchStatus: thread.matchStatus,
  };
}
