import type { FeedMatch } from "@/components/feed/feed-data";
import { MatchChip } from "@/components/feed/match-chip";
import { cn } from "@/lib/utils";

interface MatchBarProps {
  matches: FeedMatch[];
  className?: string;
}

export function MatchBar({ matches, className }: MatchBarProps) {
  if (matches.length === 0) return null;

  return (
    <div className={cn("border-b border-border bg-background", className)}>
      <div
        className="flex gap-2 overflow-x-auto px-4 py-2.5 scrollbar-none"
        aria-label="Ζωντανά και επερχόμενα ματς"
      >
        {matches.map((match) => (
          <MatchChip key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
