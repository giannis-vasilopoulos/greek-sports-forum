import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ThreadPageContent } from "@/components/thread/thread-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { mockUpcomingMatches } from "@/components/feed/feed-mock-data";
import { loadThreadPage } from "@/lib/forum/thread-page";
import {
  getThreadDetail,
  threadDescriptionFromOp,
} from "@/lib/forum/queries/thread-detail";
import { buildThreadJsonLd } from "@/lib/seo/json-ld";
import { buildThreadMetadata } from "@/lib/seo/metadata";
import { pageTitle } from "@/lib/copy";
import {
  leagueThreadsPath,
  parseThreadSlug,
  threadPath,
} from "@/lib/seo/paths";

interface PageProps {
  params: Promise<{ slug: string; threadSlug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, threadSlug } = await params;
  const parsed = parseThreadSlug(threadSlug);
  if (!parsed) notFound();

  const data = await getThreadDetail(parsed.id, slug);
  if (!data) notFound();

  const path = threadPath(slug, data.thread.id, data.thread.slug);

  return buildThreadMetadata({
    title: pageTitle(`${data.thread.title} | ${data.thread.leagueName}`),
    description: threadDescriptionFromOp(data.opContent),
    path,
    openGraphImage: undefined,
  });
}

export default async function ThreadPage({ params }: PageProps) {
  const { slug, threadSlug } = await params;
  const page = await loadThreadPage(slug, threadSlug);
  const opPost = page.data.posts.find((post) => post.isOp);

  return (
    <>
      <JsonLd
        data={buildThreadJsonLd({
          title: page.data.thread.title,
          path: page.path,
          authorName: page.data.thread.authorName,
          datePublished: (
            opPost?.createdAt ?? page.data.thread.createdAt
          ).toISOString(),
          dateModified: page.data.thread.lastActivityAt.toISOString(),
          replyCount: page.data.thread.replyCount,
          breadcrumbs: [
            {
              name: page.data.thread.leagueName,
              path: `/leagues/${slug}`,
            },
            {
              name: "Συζητήσεις",
              path: leagueThreadsPath(slug),
            },
            { name: page.data.thread.title, path: page.path },
          ],
        })}
      />
      <ThreadPageContent
        data={page.data}
        leagues={page.leagues}
        standings={page.standings}
        upcomingMatches={mockUpcomingMatches}
        trendingThreads={page.trendingThreads}
        user={page.sessionContext.user}
        activeFanProfile={page.sessionContext.activeFanProfile}
        viewerFanProfileId={page.subject.fanProfile?.id}
        isSignedIn={page.isSignedIn}
        hasFanProfileForLeague={page.hasFanProfileForLeague}
        canReply={page.canReply}
        blockMessage={page.blockMessage}
      />
    </>
  );
}
