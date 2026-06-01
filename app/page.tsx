/** SEO spec: seo/pages/home.md */
import type { Metadata } from "next";

import { MatchBar } from "@/components/feed/match-bar";
import { MatchThreadsContent } from "@/components/feed/match-threads-content";
import {
  mockFeedLeagues,
  mockFeedMatches,
  mockFeedThreads,
  mockStandings,
  mockTrendingThreads,
  mockUpcomingMatches,
} from "@/components/feed/feed-mock-data";
import {
  mockActiveFanProfile,
  mockUser,
} from "@/components/layout/site-mock-data";
import { JsonLd } from "@/components/seo/json-ld";
import { buildHomeJsonLd } from "@/lib/seo/json-ld";
import { buildHomeMetadata } from "@/lib/seo/metadata";
import { threadPath } from "@/lib/seo/paths";

export const metadata: Metadata = buildHomeMetadata();

export default function Home() {
  const jsonLdThreads = mockFeedThreads.slice(0, 10);

  return (
    <>
      <JsonLd
        data={buildHomeJsonLd({
          threadTitles: jsonLdThreads.map((t) => t.title),
          threadPaths: jsonLdThreads.map((t) =>
            threadPath(t.leagueSlug, t.id, t.slug),
          ),
        })}
      />
      {/* Mock data — replace when feed is wired to DB/API */}
      <MatchBar matches={mockFeedMatches} />
      <MatchThreadsContent
        leagues={mockFeedLeagues}
        threads={mockFeedThreads}
        standings={mockStandings}
        upcomingMatches={mockUpcomingMatches}
        trendingThreads={mockTrendingThreads}
        user={mockUser}
        activeFanProfile={mockActiveFanProfile}
      />
    </>
  );
}
