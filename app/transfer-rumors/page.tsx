import type { Metadata } from "next";

import { TransferRumorsHubContent } from "@/components/transfer-rumors/transfer-rumors-hub-content";
import { JsonLd } from "@/components/seo/json-ld";
import { buildTransferRumorsJsonLd } from "@/lib/seo/json-ld";
import { buildTransferRumorsMetadata } from "@/lib/seo/metadata";
import {
  loadTransferRumorsHub,
  resolveHubLeagueSlug,
} from "@/lib/transfers/page-data";

export const metadata: Metadata = buildTransferRumorsMetadata();

export default async function TransferRumorsPage() {
  const slug = resolveHubLeagueSlug();
  const data = await loadTransferRumorsHub(slug);

  return (
    <>
      <JsonLd
        data={buildTransferRumorsJsonLd({ threadTitles: [], threadPaths: [] })}
      />
      <TransferRumorsHubContent {...data} />
    </>
  );
}
