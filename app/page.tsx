/** SEO spec: seo/pages/home.md */
import type { Metadata } from "next";

import { MatchBar } from "@/components/feed/match-bar";
import { MatchThreadsContent } from "@/components/feed/match-threads-content";
import {
  mockFeedMatches,
  mockStandings,
  mockUpcomingMatches,
} from "@/components/feed/feed-mock-data";
import { JsonLd } from "@/components/seo/json-ld";
import { getFeedThreads, getTrendingThreads } from "@/lib/feed/queries";
import { getFeedLeagues } from "@/lib/leagues/queries";
import { getSidebarStandings } from "@/lib/standings/queries";
import { getSessionFanContext } from "@/lib/layout/get-header-data";
import { buildHomeJsonLd } from "@/lib/seo/json-ld";
import { buildHomeMetadata } from "@/lib/seo/metadata";
import { threadPath } from "@/lib/seo/paths";

export const metadata: Metadata = buildHomeMetadata();

export default async function Home() {
  const [leagues, threads, trendingThreads, sessionContext, standings] =
    await Promise.all([
      getFeedLeagues(),
      getFeedThreads(),
      getTrendingThreads(),
      getSessionFanContext(),
      getSidebarStandings("super-league"),
    ]);

  const jsonLdThreads = threads.slice(0, 10);

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
      {/* Match bar — keep mock until live scores API exists */}
      <MatchBar matches={mockFeedMatches} />
      <MatchThreadsContent
        leagues={leagues}
        threads={threads}
        standings={standings.length > 0 ? standings : mockStandings}
        upcomingMatches={mockUpcomingMatches}
        trendingThreads={trendingThreads}
        user={sessionContext.user}
        activeFanProfile={sessionContext.activeFanProfile}
      />
    </>
  );
}
