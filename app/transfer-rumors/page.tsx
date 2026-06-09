import type { Metadata } from "next";

import { TransferRumorsHubContent } from "@/components/transfer-rumors/transfer-rumors-hub-content";
import { JsonLd } from "@/components/seo/json-ld";
import {
  loadTransferRumorsHub,
  resolveHubLeagueSlug,
} from "@/lib/transfers/page-data";
import { buildTransferRumorsJsonLd } from "@/lib/seo/json-ld";
import { buildTransferRumorsMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildTransferRumorsMetadata();

interface PageProps {
  searchParams: Promise<{ league?: string }>;
}

export default async function TransferRumorsPage({ searchParams }: PageProps) {
  const { league } = await searchParams;
  const slug = resolveHubLeagueSlug(league);
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
