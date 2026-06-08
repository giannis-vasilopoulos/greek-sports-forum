import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/auth/onboarding-form";
import { getSessionUser } from "@/lib/auth/session";
import { getLeagueOptionsForNav } from "@/lib/leagues/queries";
import { getTeamsForLeague, userHasFanProfiles } from "@/lib/profiles/queries";
import { buildOnboardingMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildOnboardingMetadata();

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  const hasProfiles = await userHasFanProfiles(user.id);
  if (hasProfiles) {
    redirect("/");
  }

  const leagueOptions = await getLeagueOptionsForNav();
  const teamLists = await Promise.all(
    leagueOptions.map((league) => getTeamsForLeague(league.id)),
  );
  const teams = teamLists.flat().map((team) => ({
    id: team.id,
    leagueId: team.leagueId,
    name: team.name,
    logoUrl: team.logoUrl,
  }));

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-12">
      <OnboardingForm
        leagues={leagueOptions}
        teams={teams}
        defaultDisplayName={user.username ?? user.name}
      />
    </div>
  );
}
