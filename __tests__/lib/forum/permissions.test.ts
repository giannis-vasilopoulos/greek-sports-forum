import { describe, expect, it } from "vitest";

import {
  canReply,
  canVote,
  canWrite,
  getLiveMatchPostsPerMinute,
  getWriteRestriction,
  writeBlockReason,
} from "@/lib/forum/permissions";
import type { WriteSubject } from "@/lib/forum/permissions";

function baseSubject(overrides: Partial<WriteSubject> = {}): WriteSubject {
  return {
    userId: "user-1",
    role: "user",
    fanProfile: {
      id: 1,
      leagueId: 1,
      favoriteTeamId: 10,
      reputation: 0,
      trustStatus: "normal",
    },
    activeSanctions: [],
    ...overrides,
  };
}

describe("canWrite", () => {
  it("denies guests", () => {
    expect(
      canWrite(
        { kind: "league_feed", leagueId: 1 },
        baseSubject({ userId: null, fanProfile: null, role: null }),
      ),
    ).toBe(false);
  });

  it("allows own team at low rep", () => {
    expect(
      canWrite(
        { kind: "team_section", leagueId: 1, teamId: 10 },
        baseSubject({
          fanProfile: { ...baseSubject().fanProfile!, reputation: -15 },
        }),
      ),
    ).toBe(true);
  });

  it("denies other team when rep below 30", () => {
    expect(
      canWrite(
        { kind: "team_section", leagueId: 1, teamId: 99 },
        baseSubject(),
      ),
    ).toBe(false);
  });

  it("allows other team when rep is 30", () => {
    expect(
      canWrite(
        { kind: "team_section", leagueId: 1, teamId: 99 },
        baseSubject({
          fanProfile: { ...baseSubject().fanProfile!, reputation: 30 },
        }),
      ),
    ).toBe(true);
  });

  it("denies when league ban is active", () => {
    expect(
      canWrite(
        { kind: "team_section", leagueId: 1, teamId: 10 },
        baseSubject({
          activeSanctions: [
            {
              type: "league_ban",
              leagueId: 1,
              startsAt: new Date(Date.now() - 60_000),
              expiresAt: new Date(Date.now() + 86_400_000),
              revokedAt: null,
            },
          ],
        }),
      ),
    ).toBe(false);
  });

  it("denies when account ban is active", () => {
    expect(
      canWrite(
        { kind: "league_feed", leagueId: 1 },
        baseSubject({
          fanProfile: { ...baseSubject().fanProfile!, reputation: 50 },
          activeSanctions: [
            {
              type: "account_ban",
              leagueId: null,
              startsAt: new Date(Date.now() - 60_000),
              expiresAt: null,
              revokedAt: null,
            },
          ],
        }),
      ),
    ).toBe(false);
  });
});

describe("canReply", () => {
  it("denies locked thread for regular users", () => {
    expect(
      canReply(
        {
          leagueId: 1,
          teamId: null,
          isLocked: true,
        },
        baseSubject({
          fanProfile: { ...baseSubject().fanProfile!, reputation: 50 },
        }),
      ),
    ).toBe(false);
  });

  it("allows locked thread for moderators", () => {
    expect(
      canReply(
        { leagueId: 1, teamId: null, isLocked: true },
        baseSubject({ role: "moderator" }),
      ),
    ).toBe(true);
  });
});

describe("canVote", () => {
  const post = {
    postId: 1,
    authorFanProfileId: 2,
    thread: { leagueId: 1 },
  };

  it("denies guest", () => {
    expect(canVote({ userId: null, fanProfile: null }, post)).toBe(false);
  });

  it("denies cross-league vote", () => {
    expect(
      canVote({ userId: "u1", fanProfile: { id: 3, leagueId: 2 } }, post),
    ).toBe(false);
  });

  it("allows same-league vote", () => {
    expect(
      canVote({ userId: "u1", fanProfile: { id: 3, leagueId: 1 } }, post),
    ).toBe(true);
  });

  it("denies self-vote", () => {
    expect(
      canVote({ userId: "u1", fanProfile: { id: 2, leagueId: 1 } }, post),
    ).toBe(false);
  });
});

describe("getWriteRestriction", () => {
  it("returns slow mode when posting too soon", () => {
    const now = new Date("2026-06-02T12:00:00Z");
    const restriction = getWriteRestriction(
      baseSubject({
        activeSanctions: [
          {
            type: "slow_mode",
            leagueId: 1,
            startsAt: new Date("2026-06-02T11:00:00Z"),
            expiresAt: new Date("2026-06-05T11:00:00Z"),
            revokedAt: null,
          },
        ],
      }),
      {
        leagueId: 1,
        lastPostAt: new Date("2026-06-02T11:55:00Z"),
        now,
      },
    );

    expect(restriction?.kind).toBe("slow_mode");
  });

  it("returns live match rate limit for low rep", () => {
    const restriction = getWriteRestriction(baseSubject(), {
      leagueId: 1,
      thread: {
        leagueId: 1,
        teamId: null,
        isLocked: false,
        type: "match_thread",
        matchStatus: "live",
      },
      postsInLastMinute: 1,
      now: new Date(),
    });

    expect(restriction?.kind).toBe("live_match_rate_limit");
    expect(restriction?.maxPerMinute).toBe(1);
  });

  it("allows higher throughput at rep 50", () => {
    expect(getLiveMatchPostsPerMinute(49)).toBe(1);
    expect(getLiveMatchPostsPerMinute(50)).toBe(3);

    const restriction = getWriteRestriction(
      baseSubject({
        fanProfile: { ...baseSubject().fanProfile!, reputation: 50 },
      }),
      {
        leagueId: 1,
        thread: {
          leagueId: 1,
          teamId: null,
          isLocked: false,
          type: "match_thread",
          matchStatus: "live",
        },
        postsInLastMinute: 2,
        now: new Date(),
      },
    );

    expect(restriction).toBeNull();
  });

  it("skips live match limit for moderators", () => {
    const restriction = getWriteRestriction(
      baseSubject({ role: "moderator" }),
      {
        leagueId: 1,
        thread: {
          leagueId: 1,
          teamId: null,
          isLocked: false,
          type: "match_thread",
          matchStatus: "live",
        },
        postsInLastMinute: 99,
        now: new Date(),
      },
    );

    expect(restriction).toBeNull();
  });
});

describe("writeBlockReason", () => {
  it("returns other-team gate message", () => {
    expect(
      writeBlockReason(
        { kind: "team_section", leagueId: 1, teamId: 99 },
        baseSubject(),
      ),
    ).toContain("30 reputation");
  });
});
