import { describe, expect, it } from "vitest";

import { getThreadDisplayMode } from "@/lib/forum/display-mode";
import { parseThreadSlug, threadPath } from "@/lib/seo/paths";

describe("parseThreadSlug", () => {
  it("parses id-slug segment", () => {
    expect(parseThreadSlug("42-panathinaikos-aek")).toEqual({
      id: 42,
      slug: "panathinaikos-aek",
    });
  });

  it("rejects invalid segments", () => {
    expect(parseThreadSlug("invalid")).toBeNull();
    expect(parseThreadSlug("0-bad")).toBeNull();
    expect(parseThreadSlug("42-")).toBeNull();
  });
});

describe("threadPath", () => {
  it("builds id-slug thread URL", () => {
    expect(threadPath("super-league", 42, "panathinaikos-aek")).toBe(
      "/leagues/super-league/threads/42-panathinaikos-aek",
    );
  });
});

describe("getThreadDisplayMode", () => {
  it("returns flat in v1", () => {
    expect(getThreadDisplayMode("discussion")).toBe("flat");
    expect(getThreadDisplayMode("match_thread")).toBe("flat");
  });
});
