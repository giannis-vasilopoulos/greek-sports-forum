import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TransfersHubContent } from "@/components/transfers/transfers-hub-content";
import { JsonLd } from "@/components/seo/json-ld";
import { getLeagueBySlug } from "@/lib/leagues/queries";
import { isTransferExcluded, TRANSFER_UI_SLUGS } from "@/lib/leagues/sources";
import { buildLeagueTransfersJsonLd } from "@/lib/seo/json-ld";
import { buildLeagueTransfersMetadata } from "@/lib/seo/metadata";
import { loadTransfersHub } from "@/lib/transfers/page-data";

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

  return buildLeagueTransfersMetadata({
    leagueName: league.name,
    slug,
  });
}

export default async function LeagueTransfersPage({ params }: PageProps) {
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

  const data = await loadTransfersHub(slug);

  return (
    <>
      <JsonLd
        data={buildLeagueTransfersJsonLd({
          leagueName: league.name,
          slug,
        })}
      />
      <TransfersHubContent {...data} />
    </>
  );
}
