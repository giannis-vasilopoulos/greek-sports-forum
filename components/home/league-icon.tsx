import { Circle, Disc3, Trophy } from "lucide-react";

import type { Sport } from "@/components/home/home-data";
import { cn } from "@/lib/utils";

interface LeagueIconProps {
  slug: string;
  sport: Sport;
  className?: string;
}

export function LeagueIcon({ slug, sport, className }: LeagueIconProps) {
  const iconClass = "size-5";

  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
        className,
      )}
    >
      {slug === "champions-league" ? (
        <Trophy className={iconClass} aria-hidden="true" />
      ) : sport === "basketball" ? (
        <Disc3 className={iconClass} aria-hidden="true" />
      ) : (
        <Circle className={iconClass} aria-hidden="true" />
      )}
    </span>
  );
}
