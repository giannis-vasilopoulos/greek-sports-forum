import { describe, expect, it } from "vitest";

import { buildHomeMetadata, buildPageMetadata } from "./metadata";
import { absoluteUrl } from "./site";

describe("buildPageMetadata", () => {
  it("sets canonical and Greek description", () => {
    const metadata = buildPageMetadata({
      title: "Super League",
      description: "Συζητήσεις για το πρωτάθλημα.",
      path: "/leagues/super-league",
    });

    expect(metadata.alternates?.canonical).toBe(
      absoluteUrl("/leagues/super-league"),
    );
    expect(metadata.description).toBe("Συζητήσεις για το πρωτάθλημα.");
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });
});

describe("buildHomeMetadata", () => {
  it("uses root path canonical", () => {
    const metadata = buildHomeMetadata();
    expect(metadata.alternates?.canonical).toBe(absoluteUrl("/"));
  });
});
