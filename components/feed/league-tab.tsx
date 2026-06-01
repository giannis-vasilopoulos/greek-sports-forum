"use client";

import type { FeedLeague } from "@/components/feed/feed-data";
import { cn } from "@/lib/utils";

interface LeagueTabsProps {
  leagues: FeedLeague[];
  activeSlug: string | null;
  onChange: (slug: string | null) => void;
  showLiveFilter?: boolean;
  liveActive?: boolean;
  onLiveChange?: (active: boolean) => void;
  className?: string;
}

export function LeagueTabs({
  leagues,
  activeSlug,
  onChange,
  showLiveFilter = true,
  liveActive = false,
  onLiveChange,
  className,
}: LeagueTabsProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="tablist"
      aria-label="Φίλτρο πρωταθλήματος"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeSlug === null && !liveActive}
        onClick={() => {
          onChange(null);
          onLiveChange?.(false);
        }}
        className={cn(
          "rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
          activeSlug === null && !liveActive
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Όλα
      </button>

      {showLiveFilter && (
        <button
          type="button"
          role="tab"
          aria-selected={liveActive}
          onClick={() => {
            onLiveChange?.(!liveActive);
            if (!liveActive) onChange(null);
          }}
          className={cn(
            "rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
            liveActive
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          LIVE
        </button>
      )}

      {leagues.map((league) => (
        <button
          key={league.slug}
          type="button"
          role="tab"
          aria-selected={activeSlug === league.slug}
          onClick={() => {
            onChange(league.slug);
            onLiveChange?.(false);
          }}
          className={cn(
            "rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
            activeSlug === league.slug
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span aria-hidden="true" className="mr-1">
            {league.emoji}
          </span>
          {league.name}
        </button>
      ))}
    </div>
  );
}
