import { describe, expect, it } from "vitest";

import { getVoteReputationDelta } from "@/lib/forum/vote-reputation";

describe("getVoteReputationDelta", () => {
  it.each([
    { previous: null, next: 1, expected: 2 },
    { previous: null, next: -1, expected: -1 },
    { previous: 1, next: null, expected: -2 },
    { previous: -1, next: null, expected: 1 },
    { previous: 1, next: -1, expected: -3 },
    { previous: -1, next: 1, expected: 3 },
  ] as const)(
    "returns $expected when previous=$previous and next=$next",
    ({ previous, next, expected }) => {
      expect(getVoteReputationDelta(previous, next)).toBe(expected);
    },
  );

  it("returns 0 when vote is unchanged", () => {
    expect(getVoteReputationDelta(1, 1)).toBe(0);
    expect(getVoteReputationDelta(-1, -1)).toBe(0);
    expect(getVoteReputationDelta(null, null)).toBe(0);
  });
});
