import Link from "next/link";

import { copy } from "@/lib/copy";
import { standingsPath } from "@/lib/seo/paths";

const s = copy.standings;

export function StandingsUnavailable() {
  return (
    <div className="border-border bg-muted/30 rounded-lg border px-6 py-10 text-center">
      <p className="text-lg font-medium">{s.temporarilyUnavailable}</p>
      <p className="text-muted-foreground mt-2 text-sm">
        {s.temporarilyUnavailableHint}
      </p>
      <Link
        href={standingsPath()}
        className="text-primary mt-4 inline-block text-sm font-medium hover:underline"
      >
        {s.backToOverview}
      </Link>
    </div>
  );
}
