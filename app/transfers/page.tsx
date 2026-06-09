import type { Metadata } from "next";

import { TransfersHubContent } from "@/components/transfers/transfers-hub-content";
import { JsonLd } from "@/components/seo/json-ld";
import {
  loadTransfersHub,
  resolveHubLeagueSlug,
} from "@/lib/transfers/page-data";
import { buildTransfersJsonLd } from "@/lib/seo/json-ld";
import { buildTransfersMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildTransfersMetadata();

interface PageProps {
  searchParams: Promise<{ league?: string }>;
}

export default async function TransfersPage({ searchParams }: PageProps) {
  const { league } = await searchParams;
  const slug = resolveHubLeagueSlug(league);
  const data = await loadTransfersHub(slug);

  return (
    <>
      <JsonLd data={buildTransfersJsonLd()} />
      <TransfersHubContent {...data} />
    </>
  );
}
