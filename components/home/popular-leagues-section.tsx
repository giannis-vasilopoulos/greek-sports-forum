import Link from "next/link";

import type { LeagueWithActivity } from "@/components/home/home-data";
import { LeagueIcon } from "@/components/home/league-icon";
import { getLeagueHref } from "@/components/layout/site-data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PopularLeaguesSectionProps {
  leagues: LeagueWithActivity[];
}

export function PopularLeaguesSection({ leagues }: PopularLeaguesSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Εξερεύνησε τα leagues
        </h2>
        <p className="text-base text-muted-foreground">
          Διάλεξε πρωτάθλημα και μπες στην κερκίδα των φιλάθλων.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {leagues.map((league) => (
          <li key={league.slug}>
            <Link
              href={getLeagueHref(league.slug)}
              className="block cursor-pointer transition-colors duration-200"
            >
              <Card
                size="sm"
                className={cn(
                  "h-full border-l-4 border-l-primary py-4 transition-colors duration-200",
                  "hover:border-primary/60 hover:bg-muted/50",
                )}
              >
                <CardHeader className="grid-cols-1 gap-2 px-4 py-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <LeagueIcon slug={league.slug} sport={league.sport} />
                      <CardTitle className="text-base leading-snug">
                        {league.name}
                      </CardTitle>
                    </div>
                    {league.hasLiveThreads && (
                      <Badge className="shrink-0 gap-1 border-transparent bg-chart-2 text-primary-foreground">
                        <span
                          className="size-1.5 rounded-full bg-primary-foreground motion-safe:animate-pulse"
                          aria-hidden="true"
                        />
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Match threads, βαθμολογίες και fan profiles
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
