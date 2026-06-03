import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { parseSlgrSeasonIdMap } from "@/lib/slgr/season";

const fixture = readFileSync(
  join(__dirname, "../../fixtures/slgr/season-dropdown.html"),
  "utf8",
);

describe("parseSlgrSeasonIdMap", () => {
  it("maps season labels to scoreboard ids", () => {
    const map = parseSlgrSeasonIdMap(fixture);
    expect(map.get("2025-2026")).toBe("24");
    expect(map.get("2024-2025")).toBe("23");
  });
});
