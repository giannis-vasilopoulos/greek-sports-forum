import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { parseSlgrLeagueLogo } from "@/lib/slgr/parse-league-logo";

const fixture = readFileSync(
  join(__dirname, "../../fixtures/slgr/header-snippet.html"),
  "utf8",
);

describe("parseSlgrLeagueLogo", () => {
  it("parses the header league logo, not the rotating team emblem", () => {
    expect(parseSlgrLeagueLogo(fixture)).toBe(
      "https://www.slgr.gr/img/logo.svg",
    );
  });

  it("throws when header league logo is missing", () => {
    expect(() => parseSlgrLeagueLogo("<html><body></body></html>")).toThrow(
      "SLGR league logo: no header logo parsed from HTML",
    );
  });
});
