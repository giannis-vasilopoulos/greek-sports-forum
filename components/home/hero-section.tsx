import Link from "next/link";
import { MessageSquareIcon, UsersIcon } from "lucide-react";

import {
  formatMemberCount,
  type CommunityStats,
} from "@/components/home/home-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  stats: CommunityStats;
}

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="home-hero-pattern border-y border-border bg-primary/5">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-14 text-center md:gap-10 md:py-20">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-medium text-primary">
          Κοινότητα φιλάθλων · Ελληνικό forum
        </div>

        <div className="flex max-w-2xl flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Η κερκίδα σου για κάθε league
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Φτιάξε ξεχωριστό fan profile ανά πρωτάθλημα, μπες σε match threads
            και μίλα με Έλληνες φιλάθλους — χωρίς να μπερδεύεσαι μεταξύ ομάδων
            και leagues.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm shadow-sm",
            )}
          >
            <UsersIcon className="size-4 text-primary" aria-hidden="true" />
            <span className="font-medium text-foreground">
              {formatMemberCount(stats.memberCount)}
            </span>
            <span className="text-muted-foreground">μέλη</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm shadow-sm">
            <MessageSquareIcon
              className="size-4 text-primary"
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">
              {stats.postsToday}
            </span>
            <span className="text-muted-foreground">posts σήμερα</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="cta" size="lg" asChild>
            <Link href="/sign-up">Εγγραφή</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/sign-in">Σύνδεση</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
