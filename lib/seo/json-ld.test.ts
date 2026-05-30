import { describe, expect, it } from "vitest";

import { buildHomeJsonLd } from "./json-ld";

describe("buildHomeJsonLd", () => {
  it("returns a graph with organization, website, and webpage", () => {
    const data = buildHomeJsonLd();
    expect(data["@context"]).toBe("https://schema.org");
    expect(Array.isArray(data["@graph"])).toBe(true);
    const graph = data["@graph"] as Array<{ "@type": string }>;
    expect(graph.map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "WebPage",
    ]);
  });
});
