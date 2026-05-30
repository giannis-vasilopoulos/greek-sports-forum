import { describe, expect, it } from "vitest";

import { slugify, uniqueSlug } from "./slug";

describe("slugify", () => {
  it("slugifies latin titles", () => {
    expect(slugify("Panathinaikos - AEK")).toBe("panathinaikos-aek");
  });

  it("returns fallback when greek-only title strips to empty", () => {
    expect(slugify("Παναθηναϊκός - ΑΕΚ")).toBe("thread");
  });

  it("returns fallback for empty input", () => {
    expect(slugify("!!!")).toBe("thread");
  });
});

describe("uniqueSlug", () => {
  it("appends numeric suffix", () => {
    expect(uniqueSlug("panathinaikos-aek", 2)).toBe("panathinaikos-aek-2");
  });
});
