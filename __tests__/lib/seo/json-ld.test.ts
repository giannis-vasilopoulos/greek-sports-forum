import { describe, expect, it } from "vitest";

import { buildHomeJsonLd, buildMatchThreadsJsonLd } from "@/lib/seo/json-ld";

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

  it("includes ItemList when threads are provided", () => {
    const data = buildHomeJsonLd({
      threadTitles: ["Thread A", "Thread B"],
      threadPaths: [
        "/leagues/super-league/threads/1-thread-a",
        "/leagues/super-league/threads/2-thread-b",
      ],
    });
    const graph = data["@graph"] as Array<{ "@type": string }>;
    expect(graph.map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "WebPage",
      "ItemList",
    ]);
  });
});

describe("buildMatchThreadsJsonLd", () => {
  it("returns a graph with webpage, item list, and breadcrumbs", () => {
    const data = buildMatchThreadsJsonLd({
      threadTitles: ["Thread A", "Thread B"],
      threadPaths: [
        "/leagues/super-league/threads/1-thread-a",
        "/leagues/super-league/threads/2-thread-b",
      ],
    });
    expect(data["@context"]).toBe("https://schema.org");
    const graph = data["@graph"] as Array<{ "@type": string }>;
    expect(graph.map((node) => node["@type"])).toEqual([
      "WebPage",
      "ItemList",
      "BreadcrumbList",
    ]);
  });
});
