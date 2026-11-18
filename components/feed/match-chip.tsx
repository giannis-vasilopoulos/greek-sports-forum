import type { FeedMatch } from "@/components/feed/feed-data";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const t = copy.feed;

interface MatchChipProps {
  match: FeedMatch;
  className?: string;
}

export function MatchChip({ match, className }: MatchChipProps) {
  const isLive = match.status === "live";
  const hasScore =
    match.homeScore !== undefined && match.awayScore !== undefined;

  return (
    <div
      className={cn(
        "bg-card flex min-w-[160px] shrink-0 flex-col gap-1 rounded-lg border px-3 py-2",
        isLive
          ? "border-destructive border-[1.5px]"
          : "border-primary/40 border-[1.5px]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-medium">
          {match.homeTeam}
        </span>
        {hasScore && (
          <span className="text-[15px] font-medium tabular-nums">
            {match.homeScore}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-medium">
          {match.awayTeam}
        </span>
        {hasScore && (
          <span className="text-[15px] font-medium tabular-nums">
            {match.awayScore}
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-[10px]">
        {isLive && match.minute && (
          <span className="text-destructive live-pulse font-medium">
            {t.thread.live} {match.minute}
          </span>
        )}
        {!isLive && match.kickoffTime && <span>{match.kickoffTime}</span>}
        {match.status === "finished" && !isLive && (
          <span>
            {t.matchChip.finishedPrefix} {match.leagueName}
          </span>
        )}
        {isLive && ` · ${match.leagueName}`}
        {match.status === "upcoming" && ` · ${match.leagueName}`}
      </p>
    </div>
  );
}
