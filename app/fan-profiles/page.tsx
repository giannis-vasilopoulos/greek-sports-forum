import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { FanProfilesManager } from "@/components/profile/fan-profiles-manager";
import { getSessionUser } from "@/lib/auth/session";
import {
  getFanProfileDetailsForUser,
  getLeaguesWithoutProfileForUser,
  getTeamsForLeagues,
} from "@/lib/profiles/queries";
import { buildFanProfilesMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildFanProfilesMetadata();

export default async function FanProfilesPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [profiles, availableLeagues] = await Promise.all([
    getFanProfileDetailsForUser(user.id),
    getLeaguesWithoutProfileForUser(user.id),
  ]);

  const leagueIds = availableLeagues.map((league) => league.id);
  const teamRows = await getTeamsForLeagues(leagueIds);
  const teams = teamRows.map((team) => ({
    id: team.id,
    leagueId: team.leagueId,
    name: team.name,
    logoUrl: team.logoUrl,
  }));

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-12">
      <FanProfilesManager
        profiles={profiles}
        availableLeagues={availableLeagues}
        teams={teams}
      />
    </div>
  );
}
