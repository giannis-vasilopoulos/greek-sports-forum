import { describe, expect, it } from "vitest";

import { copy } from "@/lib/copy";
import { pageTitle } from "@/lib/copy/format";
import {
  buildHomeMetadata,
  buildMatchThreadsMetadata,
  buildPageMetadata,
  buildSignInMetadata,
  buildSignUpMetadata,
} from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site";

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

describe("buildMatchThreadsMetadata", () => {
  it("sets match-threads canonical and Greek description", () => {
    const metadata = buildMatchThreadsMetadata();
    expect(metadata.alternates?.canonical).toBe(absoluteUrl("/match-threads"));
    expect(metadata.description).toBe(copy.seo.pages.matchThreads.description);
    expect(metadata.title).toBe(
      pageTitle(copy.seo.pages.matchThreads.titleSegment),
    );
  });
});

describe("buildSignInMetadata", () => {
  it("is noindex with sign-in canonical", () => {
    const metadata = buildSignInMetadata();
    expect(metadata.alternates?.canonical).toBe(absoluteUrl("/sign-in"));
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.title).toBe(pageTitle(copy.seo.pages.signIn.titleSegment));
  });
});

describe("buildSignUpMetadata", () => {
  it("is noindex with sign-up canonical", () => {
    const metadata = buildSignUpMetadata();
    expect(metadata.alternates?.canonical).toBe(absoluteUrl("/sign-up"));
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.title).toBe(pageTitle(copy.seo.pages.signUp.titleSegment));
  });
});
