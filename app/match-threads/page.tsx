/** SEO spec: seo/pages/match-threads.md */
import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { buildMatchThreadsJsonLd } from "@/lib/seo/json-ld";
import { buildMatchThreadsMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMatchThreadsMetadata();

export default function MatchThreadsPage() {
  return (
    <>
      <JsonLd
        data={buildMatchThreadsJsonLd({
          threadTitles: [],
          threadPaths: [],
        })}
      />
      <h1 className="sr-only">Match Threads</h1>
    </>
  );
}
