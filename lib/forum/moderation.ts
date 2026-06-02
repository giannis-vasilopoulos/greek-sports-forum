import {
  LEAGUE_BAN_DAYS,
  POST_COLLAPSE_SCORE,
  POST_REPORT_FLAG_COUNT,
  SHADOW_BAN_DAYS,
  SLOW_MODE_DAYS,
} from "@/lib/forum/constants";
import { type Result, conflict, err, ok } from "@/lib/db/result";

export const SANCTION_TYPES = [
  "warning",
  "slow_mode",
  "shadow_ban",
  "league_ban",
  "account_ban",
] as const;

export type SanctionType = (typeof SANCTION_TYPES)[number];

export type SanctionRecord = {
  type: SanctionType;
  leagueId: number | null;
  startsAt: Date;
  expiresAt: Date | null;
  revokedAt: Date | null;
};

export function shouldCollapsePost(score: number): boolean {
  return score <= POST_COLLAPSE_SCORE;
}

export function shouldFlagPost(reportCount: number): boolean {
  return reportCount >= POST_REPORT_FLAG_COUNT;
}

export function isSanctionActive(
  sanction: SanctionRecord,
  now: Date = new Date(),
): boolean {
  if (sanction.revokedAt) {
    return false;
  }

  if (sanction.startsAt.getTime() > now.getTime()) {
    return false;
  }

  if (sanction.expiresAt && sanction.expiresAt.getTime() <= now.getTime()) {
    return false;
  }

  return true;
}

const LEAGUE_SCOPED_SANCTIONS = new Set<SanctionType>([
  "league_ban",
  "shadow_ban",
  "slow_mode",
]);

export function validateSanctionInput(input: {
  type: SanctionType;
  leagueId: number | null;
}): Result<void> {
  if (input.type === "account_ban") {
    if (input.leagueId !== null) {
      return err(conflict("leagueId"));
    }
    return ok(undefined);
  }

  if (LEAGUE_SCOPED_SANCTIONS.has(input.type)) {
    if (input.leagueId === null) {
      return err(conflict("leagueId"));
    }
    return ok(undefined);
  }

  return ok(undefined);
}

export function getSanctionDurationDays(type: SanctionType): number | null {
  switch (type) {
    case "slow_mode":
      return SLOW_MODE_DAYS;
    case "shadow_ban":
      return SHADOW_BAN_DAYS;
    case "league_ban":
      return LEAGUE_BAN_DAYS;
    case "account_ban":
    case "warning":
      return null;
  }
}

export function buildSanctionExpiresAt(
  type: SanctionType,
  startsAt: Date,
): Date | null {
  const days = getSanctionDurationDays(type);
  if (days === null) {
    return null;
  }

  return new Date(startsAt.getTime() + days * 24 * 60 * 60_000);
}

export type CreateSanctionInput = {
  fanProfileId: number;
  type: SanctionType;
  leagueId: number | null;
  issuedByUserId: string;
  reason: string;
  startsAt?: Date;
};

export function prepareSanctionInsert(input: CreateSanctionInput): Result<{
  fanProfileId: number;
  type: SanctionType;
  leagueId: number | null;
  issuedByUserId: string;
  reason: string;
  startsAt: Date;
  expiresAt: Date | null;
}> {
  const validation = validateSanctionInput({
    type: input.type,
    leagueId: input.leagueId,
  });

  if (!validation.ok) {
    return validation;
  }

  const startsAt = input.startsAt ?? new Date();

  return ok({
    fanProfileId: input.fanProfileId,
    type: input.type,
    leagueId: input.leagueId,
    issuedByUserId: input.issuedByUserId,
    reason: input.reason,
    startsAt,
    expiresAt: buildSanctionExpiresAt(input.type, startsAt),
  });
}

export function isLeagueScopedSanctionError(error: {
  kind: string;
  field?: string;
}): boolean {
  return error.kind === "conflict" && error.field === "leagueId";
}
