import Link from "next/link";

import { copy } from "@/lib/copy";
import { standingsPath } from "@/lib/seo/paths";

const s = copy.standings;

export function StandingsUnavailable() {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-6 py-10 text-center">
      <p className="text-lg font-medium">{s.temporarilyUnavailable}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {s.temporarilyUnavailableHint}
      </p>
      <Link
        href={standingsPath()}
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        {s.backToOverview}
      </Link>
    </div>
  );
}
