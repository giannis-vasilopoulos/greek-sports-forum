import { notFound, permanentRedirect } from "next/navigation";

import {
  canReply,
  getWriteRestriction,
  writeBlockReason,
} from "@/lib/forum/permissions";
import { getThreadDetail } from "@/lib/forum/queries/thread-detail";
import { buildWriteSubject } from "@/lib/forum/subject";
import {
  resolveWriteContext,
  toThreadContext,
} from "@/lib/forum/write-context";
import { getSessionFanContext } from "@/lib/layout/get-header-data";
import { getLeaguesForNav } from "@/lib/leagues/queries";
import { getSessionUser } from "@/lib/auth/session";
import { parseThreadSlug, threadPath } from "@/lib/seo/paths";
import { getTrendingThreads } from "@/lib/feed/queries";
import { getSidebarStandings } from "@/lib/standings/queries";

// fallow-ignore-next-line complexity
export async function loadThreadPage(slug: string, threadSlug: string) {
  const parsed = parseThreadSlug(threadSlug);
  if (!parsed) {
    notFound();
  }

  const initial = await getThreadDetail(parsed.id, slug);
  if (!initial) {
    notFound();
  }

  if (parsed.slug !== initial.thread.slug) {
    permanentRedirect(threadPath(slug, initial.thread.id, initial.thread.slug));
  }

  const user = await getSessionUser();
  const subject = await buildWriteSubject(user, initial.thread.leagueId);

  const data =
    (await getThreadDetail(parsed.id, slug, {
      viewerFanProfileId: subject.fanProfile?.id,
      viewerIsModerator: user?.role === "moderator" || user?.role === "admin",
    })) ?? initial;

  const [sessionContext, leagues, trendingThreads, standings] =
    await Promise.all([
      getSessionFanContext(),
      getLeaguesForNav(),
      getTrendingThreads(),
      getSidebarStandings(slug),
    ]);

  const writeContext = resolveWriteContext({
    leagueId: data.thread.leagueId,
    teamId: data.thread.teamId,
  });

  const threadContext = toThreadContext({
    leagueId: data.thread.leagueId,
    teamId: data.thread.teamId,
    isLocked: data.thread.isLocked,
    type: data.thread.type,
    matchStatus: data.thread.matchStatus,
  });

  const blockMessage = writeBlockReason(writeContext, subject);
  const replyAllowed = canReply(threadContext, subject);
  const restriction = subject.fanProfile
    ? getWriteRestriction(subject, {
        leagueId: data.thread.leagueId,
        thread: threadContext,
      })
    : null;

  return {
    data,
    leagues,
    standings,
    trendingThreads,
    sessionContext,
    subject,
    path: threadPath(slug, data.thread.id, data.thread.slug),
    canReply: replyAllowed && !restriction,
    blockMessage: restriction?.message ?? blockMessage,
    isSignedIn: Boolean(user),
    hasFanProfileForLeague: Boolean(subject.fanProfile),
  };
}
