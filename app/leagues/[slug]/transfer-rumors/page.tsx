import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TransferRumorsHubContent } from "@/components/transfer-rumors/transfer-rumors-hub-content";
import { JsonLd } from "@/components/seo/json-ld";
import { getLeagueBySlug } from "@/lib/leagues/queries";
import { isTransferExcluded, TRANSFER_UI_SLUGS } from "@/lib/leagues/sources";
import { buildLeagueTransferRumorsJsonLd } from "@/lib/seo/json-ld";
import { buildLeagueTransferRumorsMetadata } from "@/lib/seo/metadata";
import { loadTransferRumorsHub } from "@/lib/transfers/page-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (
    isTransferExcluded(slug) ||
    !(TRANSFER_UI_SLUGS as readonly string[]).includes(slug)
  ) {
    notFound();
  }

  const league = await getLeagueBySlug(slug);
  if (!league) {
    notFound();
  }

  return buildLeagueTransferRumorsMetadata({
    leagueName: league.name,
    slug,
  });
}

export default async function LeagueTransferRumorsPage({ params }: PageProps) {
  const { slug } = await params;

  if (
    isTransferExcluded(slug) ||
    !(TRANSFER_UI_SLUGS as readonly string[]).includes(slug)
  ) {
    notFound();
  }

  const league = await getLeagueBySlug(slug);
  if (!league) {
    notFound();
  }

  const data = await loadTransferRumorsHub(slug);

  return (
    <>
      <JsonLd
        data={buildLeagueTransferRumorsJsonLd({
          leagueName: league.name,
          slug,
        })}
      />
      <TransferRumorsHubContent {...data} />
    </>
  );
}
