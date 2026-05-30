/** SEO spec: seo/pages/home.md */
import type { Metadata } from "next";

import { AdSlot } from "@/components/ads/ad-slot";
import { ActiveMembersSection } from "@/components/home/active-members-section";
import { HeroSection } from "@/components/home/hero-section";
import {
  mockActiveMembers,
  mockCommunityStats,
  mockLeaguesWithActivity,
} from "@/components/home/home-mock-data";
import { JoinCtaSection } from "@/components/home/join-cta-section";
import { PopularLeaguesSection } from "@/components/home/popular-leagues-section";
import { JsonLd } from "@/components/seo/json-ld";
import { buildHomeJsonLd } from "@/lib/seo/json-ld";
import { buildHomeMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildHomeMetadata();

export default function Home() {
  return (
    <>
      <JsonLd data={buildHomeJsonLd()} />
      {/* Mock data — replace when home is wired to DB/API */}
      <HeroSection stats={mockCommunityStats} />
      <AdSlot id="home-leaderboard" className="px-4 py-6 md:py-8" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 md:gap-16 md:py-16">
        {/* Mock data — replace when home is wired to DB/API */}
        <PopularLeaguesSection leagues={mockLeaguesWithActivity} />
        <AdSlot id="home-mid" />
        {/* Mock data — replace when home is wired to DB/API */}
        <ActiveMembersSection members={mockActiveMembers} />
        <JoinCtaSection />
      </div>
    </>
  );
}
