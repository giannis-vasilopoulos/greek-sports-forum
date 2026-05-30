import { describe, expect, it } from "vitest";

import { threadPath } from "./paths";

describe("threadPath", () => {
  it("builds id-slug thread URL", () => {
    expect(threadPath("super-league", 42, "panathinaikos-aek")).toBe(
      "/leagues/super-league/threads/42-panathinaikos-aek",
    );
  });
});
