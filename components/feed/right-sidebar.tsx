import Link from "next/link";

import type {
  StandingRow,
  TrendingThread,
  UpcomingMatch,
} from "@/components/feed/feed-data";
import { threadPath } from "@/lib/seo/paths";
import { copy, formatReplyCount } from "@/lib/copy";
import { cn } from "@/lib/utils";

const s = copy.feed.sidebar;

interface RightSidebarProps {
  standings: StandingRow[];
  upcomingMatches: UpcomingMatch[];
  trendingThreads: TrendingThread[];
  className?: string;
}

export function RightSidebar({
  standings,
  upcomingMatches,
  trendingThreads,
  className,
}: RightSidebarProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <section>
        <p className="section-label mb-2">{s.standings}</p>
        <ul className="flex flex-col gap-1">
          {standings.map((row) => (
            <li
              key={row.rank}
              className="flex items-center justify-between text-[12px]"
            >
              <span className="flex items-center gap-2">
                <span className="text-muted-foreground w-4 tabular-nums">
                  {row.rank}
                </span>
                <span className="font-medium">{row.team}</span>
              </span>
              <span className="font-medium tabular-nums">{row.points}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/standings"
          className="text-primary mt-2 inline-block text-[11px] font-medium hover:underline"
        >
          {s.fullStandings}
        </Link>
      </section>

      <section>
        <p className="section-label mb-2">{s.upcoming}</p>
        <ul className="flex flex-col gap-2">
          {upcomingMatches.map((match) => (
            <li key={match.id} className="text-[12px]">
              <p className="font-medium">
                {match.homeTeam} vs {match.awayTeam}
              </p>
              <p className="text-muted-foreground text-[11px]">
                {match.kickoffTime} · {match.leagueName}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="section-label mb-2">{s.trending}</p>
        <ul className="flex flex-col gap-2">
          {trendingThreads.map((thread) => (
            <li key={thread.id}>
              <Link
                href={threadPath(thread.leagueSlug, thread.id, thread.slug)}
                className="hover:text-primary block text-[12px] font-medium"
              >
                {thread.title}
              </Link>
              <p className="text-muted-foreground text-[11px]">
                {formatReplyCount(thread.replyCount)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
