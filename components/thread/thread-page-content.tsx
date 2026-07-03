"use client";

import {
  ThreadInContentAd,
  ThreadTopAd,
} from "@/components/ads/slots/content-ad-slots";
import { mockStandings } from "@/components/feed/feed-mock-data";
import type {
  FeedLeague,
  StandingRow,
  TrendingThread,
  UpcomingMatch,
} from "@/components/feed/feed-data";
import { FeedShell } from "@/components/feed/feed-shell";
import { LeftSidebar } from "@/components/feed/left-sidebar";
import { RightSidebar } from "@/components/feed/right-sidebar";
import { PostList, useReplyTarget } from "@/components/thread/post-list";
import { ReplyComposer } from "@/components/thread/reply-composer";
import { ThreadHeader } from "@/components/thread/thread-header";
import type { FanProfile } from "@/components/layout/site-data";
import type { ThreadDetailBundle } from "@/lib/forum/queries/thread-detail";

interface ThreadPageContentProps {
  data: ThreadDetailBundle;
  leagues: FeedLeague[];
  standings: StandingRow[];
  upcomingMatches: UpcomingMatch[];
  trendingThreads: TrendingThread[];
  user?: { name: string; image?: string; username?: string };
  activeFanProfile?: FanProfile;
  viewerFanProfileId?: number;
  isSignedIn: boolean;
  hasFanProfileForLeague: boolean;
  canReply: boolean;
  blockMessage?: string | null;
}

export function ThreadPageContent({
  data,
  leagues,
  standings,
  upcomingMatches,
  trendingThreads,
  user,
  activeFanProfile,
  viewerFanProfileId,
  isSignedIn,
  hasFanProfileForLeague,
  canReply,
  blockMessage,
}: ThreadPageContentProps) {
  const { replyTarget, handleReply, clearReplyTarget } = useReplyTarget();
  const { thread, posts } = data;

  const inContentAdIndex = Math.min(5, posts.length - 1);

  return (
    <>
      <FeedShell
        left={
          <LeftSidebar
            leagues={leagues}
            activeSlug={thread.leagueSlug}
            user={user}
            activeFanProfile={activeFanProfile}
          />
        }
        main={
          <div className="flex flex-col gap-4 pb-32 lg:pb-4">
            <ThreadHeader thread={thread} />
            <ThreadTopAd />

            <PostList
              posts={posts}
              isSignedIn={isSignedIn}
              viewerFanProfileId={viewerFanProfileId}
              onReply={handleReply}
            />

            {posts.length > inContentAdIndex && inContentAdIndex >= 0 && (
              <ThreadInContentAd />
            )}

            <div className="hidden lg:block">
              <ReplyComposer
                key={`desktop-${thread.id}`}
                threadId={thread.id}
                leagueSlug={thread.leagueSlug}
                isSignedIn={isSignedIn}
                hasFanProfileForLeague={hasFanProfileForLeague}
                canReply={canReply}
                blockMessage={blockMessage}
                replyTarget={replyTarget}
                onClearReplyTarget={clearReplyTarget}
              />
            </div>
          </div>
        }
        right={
          <RightSidebar
            standings={standings.length > 0 ? standings : mockStandings}
            upcomingMatches={upcomingMatches}
            trendingThreads={trendingThreads}
          />
        }
      />

      <ReplyComposer
        key={`mobile-${thread.id}`}
        threadId={thread.id}
        leagueSlug={thread.leagueSlug}
        isSignedIn={isSignedIn}
        hasFanProfileForLeague={hasFanProfileForLeague}
        canReply={canReply}
        blockMessage={blockMessage}
        replyTarget={replyTarget}
        onClearReplyTarget={clearReplyTarget}
        sticky
        className="lg:hidden"
      />
    </>
  );
}
