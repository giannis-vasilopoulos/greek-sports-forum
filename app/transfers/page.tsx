import type { Metadata } from "next";

import { TransfersHubContent } from "@/components/transfers/transfers-hub-content";
import { JsonLd } from "@/components/seo/json-ld";
import { buildTransfersJsonLd } from "@/lib/seo/json-ld";
import { buildTransfersMetadata } from "@/lib/seo/metadata";
import {
  loadTransfersHub,
  resolveHubLeagueSlug,
} from "@/lib/transfers/page-data";

export const metadata: Metadata = buildTransfersMetadata();

export default async function TransfersPage() {
  const slug = resolveHubLeagueSlug();
  const data = await loadTransfersHub(slug);

  return (
    <>
      <JsonLd data={buildTransfersJsonLd()} />
      <TransfersHubContent {...data} />
    </>
  );
}
