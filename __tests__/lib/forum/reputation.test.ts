import { describe, expect, it } from "vitest";

import { reputationEventDeltas } from "@/lib/forum/constants";
import { getReputationDelta } from "@/lib/forum/reputation";

describe("reputation events", () => {
  it("maps post_downvoted to -1", () => {
    expect(getReputationDelta("post_downvoted")).toBe(-1);
  });

  it("maps post_liked to +2", () => {
    expect(getReputationDelta("post_liked")).toBe(2);
  });

  it("documents mod penalties", () => {
    expect(reputationEventDeltas.warning_received).toBe(-15);
    expect(reputationEventDeltas.report_confirmed).toBe(-20);
    expect(reputationEventDeltas.post_removed).toBe(-10);
  });
});
