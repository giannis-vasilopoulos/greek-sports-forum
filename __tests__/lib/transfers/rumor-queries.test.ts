import { describe, expect, it } from "vitest";

import type { FeedThread } from "@/components/feed/feed-data";
import { getTransferRumorJsonLdInput } from "@/lib/transfers/rumor-queries";

describe("getTransferRumorJsonLdInput", () => {
  it("maps thread titles and paths for JSON-LD", () => {
    const threads: FeedThread[] = [
      {
        id: 42,
        slug: "panathinaikos-signing",
        title: "Φήμη για Παναθηναϊκό",
        leagueSlug: "super-league",
        leagueName: "Super League",
        type: "transfer_rumor",
        isLive: false,
        authorName: "Nikos",
        authorInitials: "N",
        replyCount: 3,
        lastActivity: "1ώ",
      },
    ];

    const result = getTransferRumorJsonLdInput(threads);

    expect(result.threadTitles).toEqual(["Φήμη για Παναθηναϊκό"]);
    expect(result.threadPaths).toEqual([
      "/leagues/super-league/threads/42-panathinaikos-signing",
    ]);
  });
});
