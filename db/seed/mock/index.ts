/**
 * TODO(mock): Remove when dev/CI bootstrap uses real db/seed.ts leagues+teams
 * and e2e no longer depends on hardcoded demo threads.
 * Temporary replacement for feed-mock-data.ts after DB migration.
 */
import { seedNotifications } from "@/db/seed/notifications";
import { seedUsers } from "@/db/seed/users";

import { seedMockFanProfiles } from "./fan-profiles";
import { seedMockLeagues } from "./leagues";
import { seedMockTeams } from "./teams";
import { seedMockThreads } from "./threads";

export { seedMockLeagues } from "./leagues";
export { seedMockTeams } from "./teams";
export { seedMockFanProfiles, upsertMockFanProfile } from "./fan-profiles";
export { seedMockThreads } from "./threads";

export async function seedMockFixtures() {
  await seedUsers();

  const leagueIds = await seedMockLeagues();
  await seedMockTeams(leagueIds);
  const profileByLeague = await seedMockFanProfiles({ leagueIds });
  await seedMockThreads({ leagueIds, profileByLeague });

  console.log("Seeding notifications...");
  await seedNotifications();

  console.log("Mock fixture seed done.");
}
