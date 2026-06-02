"use client";

import { useMemo, useState } from "react";

import {
  MatchThreadsMidAd,
  MatchThreadsTopAd,
} from "@/components/ads/slots/content-ad-slots";
import type {
  FeedLeague,
  FeedThread,
  StandingRow,
  TrendingThread,
  UpcomingMatch,
} from "@/components/feed/feed-data";
import { copy } from "@/lib/copy";
import { FeedShell } from "@/components/feed/feed-shell";
import { LeagueTabs } from "@/components/feed/league-tab";
import { LeftSidebar } from "@/components/feed/left-sidebar";
import { RightSidebar } from "@/components/feed/right-sidebar";
import { ThreadRowList } from "@/components/feed/thread-row";
import type { FanProfile } from "@/components/layout/site-data";

interface MatchThreadsContentProps {
  leagues: FeedLeague[];
  threads: FeedThread[];
  standings: StandingRow[];
  upcomingMatches: UpcomingMatch[];
  trendingThreads: TrendingThread[];
  user?: { name: string; image?: string; username?: string };
  activeFanProfile?: FanProfile;
}

export function MatchThreadsContent({
  leagues,
  threads,
  standings,
  upcomingMatches,
  trendingThreads,
  user,
  activeFanProfile,
}: MatchThreadsContentProps) {
  const [activeLeague, setActiveLeague] = useState<string | null>(null);
  const [liveOnly, setLiveOnly] = useState(false);

  const filteredThreads = useMemo(() => {
    let result = threads;

    if (liveOnly) {
      result = result.filter((t) => t.isLive);
    }

    if (activeLeague) {
      result = result.filter((t) => t.leagueSlug === activeLeague);
    }

    return result;
  }, [threads, activeLeague, liveOnly]);

  const midIndex = Math.min(6, filteredThreads.length);

  return (
    <FeedShell
      left={
        <LeftSidebar
          leagues={leagues}
          activeSlug={activeLeague ?? undefined}
          user={user}
          activeFanProfile={activeFanProfile}
        />
      }
      main={
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="sr-only">Match Threads</h1>
            <MatchThreadsTopAd />
          </div>

          <LeagueTabs
            leagues={leagues}
            activeSlug={activeLeague}
            onChange={setActiveLeague}
            liveActive={liveOnly}
            onLiveChange={setLiveOnly}
          />

          {filteredThreads.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-muted-foreground">
              {copy.feed.matchThreads.emptyFiltered}
            </p>
          ) : (
            <div
              role="region"
              aria-label={copy.feed.matchThreads.listAriaLabel}
            >
              <ThreadRowList threads={filteredThreads.slice(0, midIndex)} />
              {filteredThreads.length > midIndex && (
                <>
                  <MatchThreadsMidAd />
                  <ThreadRowList threads={filteredThreads.slice(midIndex)} />
                </>
              )}
            </div>
          )}
        </div>
      }
      right={
        <RightSidebar
          standings={standings}
          upcomingMatches={upcomingMatches}
          trendingThreads={trendingThreads}
        />
      }
    />
  );
}
