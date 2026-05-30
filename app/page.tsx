import { ActiveMembersSection } from "@/components/home/active-members-section";
import { HeroSection } from "@/components/home/hero-section";
import {
  mockActiveMembers,
  mockCommunityStats,
  mockLeaguesWithActivity,
} from "@/components/home/home-mock-data";
import { JoinCtaSection } from "@/components/home/join-cta-section";
import { PopularLeaguesSection } from "@/components/home/popular-leagues-section";

export default function Home() {
  return (
    <>
      {/* Mock data — replace when home is wired to DB/API */}
      <HeroSection stats={mockCommunityStats} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 md:gap-16 md:py-16">
        {/* Mock data — replace when home is wired to DB/API */}
        <PopularLeaguesSection leagues={mockLeaguesWithActivity} />
        {/* Mock data — replace when home is wired to DB/API */}
        <ActiveMembersSection members={mockActiveMembers} />
        <JoinCtaSection />
      </div>
    </>
  );
}
