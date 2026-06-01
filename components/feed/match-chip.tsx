import type { FeedMatch } from "@/components/feed/feed-data";
import { cn } from "@/lib/utils";

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
        "flex min-w-[160px] shrink-0 flex-col gap-1 rounded-lg border bg-card px-3 py-2",
        isLive
          ? "border-[1.5px] border-destructive"
          : "border-[1.5px] border-primary/40",
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
      <p className="text-[10px] text-muted-foreground">
        {isLive && match.minute && (
          <span className="font-medium text-destructive live-pulse">
            LIVE {match.minute}
          </span>
        )}
        {!isLive && match.kickoffTime && <span>{match.kickoffTime}</span>}
        {match.status === "finished" && !isLive && (
          <span>Τελικό · {match.leagueName}</span>
        )}
        {isLive && ` · ${match.leagueName}`}
        {match.status === "upcoming" && ` · ${match.leagueName}`}
      </p>
    </div>
  );
}
