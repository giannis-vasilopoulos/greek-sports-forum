/**
 * TODO(mock): Remove when dev/CI bootstrap uses real db/seed.ts leagues+teams
 * and e2e no longer depends on hardcoded demo threads.
 * Temporary replacement for feed-mock-data.ts after DB migration.
 */
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { fanProfiles, leagues, teams, threads, user } from "@/db/schema";
import { seedUsers } from "@/db/seed/users";

const MOCK_LEAGUES = [
  {
    slug: "super-league",
    name: "Super League",
    sport: "football" as const,
    displayOrder: 1,
  },
  {
    slug: "champions-league",
    name: "Champions League",
    sport: "football" as const,
    displayOrder: 2,
  },
  {
    slug: "premier-league",
    name: "Premier League",
    sport: "football" as const,
    displayOrder: 3,
  },
  {
    slug: "euroleague",
    name: "Euroleague",
    sport: "basketball" as const,
    displayOrder: 4,
  },
  {
    slug: "nba",
    name: "NBA",
    sport: "basketball" as const,
    displayOrder: 5,
  },
];

const MOCK_TEAMS: Record<string, Array<{ slug: string; name: string }>> = {
  "super-league": [
    { slug: "panathinaikos", name: "Παναθηναϊκός" },
    { slug: "olympiakos", name: "Ολυμπιακός" },
    { slug: "aek", name: "ΑΕΚ" },
    { slug: "paok", name: "ΠΑΟΚ" },
  ],
  "premier-league": [
    { slug: "arsenal", name: "Arsenal" },
    { slug: "chelsea", name: "Chelsea" },
  ],
  "champions-league": [
    { slug: "real-madrid", name: "Real Madrid" },
    { slug: "barcelona", name: "Barcelona" },
  ],
  euroleague: [
    { slug: "olympiakos-bc", name: "Ολυμπιακός" },
    { slug: "panathinaikos-bc", name: "Παναθηναϊκός" },
  ],
  nba: [
    { slug: "lakers", name: "Lakers" },
    { slug: "celtics", name: "Celtics" },
  ],
};

const MOCK_THREADS = [
  {
    id: 42,
    slug: "panathinaikos-olympiakos-live",
    title: "Παναθηναϊκός vs Ολυμπιακός — Live συζήτηση",
    leagueSlug: "super-league",
    type: "match_thread" as const,
    matchStatus: "live" as const,
    replyCount: 847,
    minutesAgo: 0,
  },
  {
    id: 38,
    slug: "aek-paok-preview",
    title: "ΑΕΚ vs ΠΑΟΚ — Προεπισκόπηση & προβλέψεις",
    leagueSlug: "super-league",
    type: "match_thread" as const,
    matchStatus: "scheduled" as const,
    replyCount: 312,
    minutesAgo: 2,
  },
  {
    id: 31,
    slug: "arsenal-chelsea-preview",
    title: "Arsenal vs Chelsea — Pre-match thread",
    leagueSlug: "premier-league",
    type: "match_thread" as const,
    matchStatus: "scheduled" as const,
    replyCount: 89,
    minutesAgo: 15,
  },
  {
    id: 28,
    slug: "champions-league-draw",
    title: "Κλήρωση Champions League — αντιδράσεις",
    leagueSlug: "champions-league",
    type: "news" as const,
    replyCount: 234,
    minutesAgo: 22,
  },
  {
    id: 25,
    slug: "euroleague-olympiakos-panathinaikos",
    title: "Ολυμπιακός vs Παναθηναϊκός — Euroleague derby",
    leagueSlug: "euroleague",
    type: "match_thread" as const,
    matchStatus: "finished" as const,
    replyCount: 178,
    minutesAgo: 35,
  },
  {
    id: 15,
    slug: "referee-decisions-week-12",
    title: "Αποφάσεις διαιτητών — 12η αγωνιστική",
    leagueSlug: "super-league",
    type: "discussion" as const,
    replyCount: 523,
    minutesAgo: 180,
  },
  {
    id: 12,
    slug: "premier-league-title-race",
    title: "Premier League title race — ποιος θα το πάρει;",
    leagueSlug: "premier-league",
    type: "discussion" as const,
    replyCount: 198,
    minutesAgo: 240,
  },
  {
    id: 10,
    slug: "super-league-relegation-battle",
    title: "Μάχη για τη σωτηρία — Super League",
    leagueSlug: "super-league",
    type: "discussion" as const,
    replyCount: 91,
    minutesAgo: 300,
  },
];

async function upsertFanProfile(input: {
  userId: string;
  leagueId: number;
  displayName: string;
  favoriteTeamId: number;
}) {
  const [profile] = await db
    .insert(fanProfiles)
    .values({
      userId: input.userId,
      leagueId: input.leagueId,
      favoriteTeamId: input.favoriteTeamId,
      displayName: input.displayName,
    })
    .onConflictDoUpdate({
      target: [fanProfiles.userId, fanProfiles.leagueId],
      set: {
        displayName: input.displayName,
        favoriteTeamId: input.favoriteTeamId,
      },
    })
    .returning();

  return profile;
}

export async function seedMockFixtures() {
  await seedUsers();

  console.log("Seeding mock leagues and teams...");

  const leagueIds = new Map<string, number>();

  for (const league of MOCK_LEAGUES) {
    const [row] = await db
      .insert(leagues)
      .values(league)
      .onConflictDoUpdate({
        target: leagues.slug,
        set: { name: league.name, displayOrder: league.displayOrder },
      })
      .returning();

    leagueIds.set(league.slug, row.id);
  }

  for (const [leagueSlug, leagueTeams] of Object.entries(MOCK_TEAMS)) {
    const leagueId = leagueIds.get(leagueSlug);
    if (!leagueId) continue;

    for (const team of leagueTeams) {
      await db
        .insert(teams)
        .values({ ...team, leagueId })
        .onConflictDoUpdate({
          target: teams.slug,
          set: { name: team.name, leagueId },
        });
    }
  }

  const testUser = await db.query.user.findFirst({
    where: eq(user.username, "testuser"),
  });

  if (!testUser) {
    console.warn("  testuser not found — skipping fan profiles and threads");
    return;
  }

  const teamIdsByLeagueSlug = new Map<string, number>();

  for (const [leagueSlug, leagueTeams] of Object.entries(MOCK_TEAMS)) {
    const leagueId = leagueIds.get(leagueSlug);
    if (!leagueId || leagueTeams.length === 0) continue;

    const firstTeam = await db.query.teams.findFirst({
      where: (t, { and, eq: eqFn }) =>
        and(eqFn(t.leagueId, leagueId), eqFn(t.slug, leagueTeams[0].slug)),
      columns: { id: true },
    });

    if (firstTeam) {
      teamIdsByLeagueSlug.set(leagueSlug, firstTeam.id);
    }
  }

  const profileByLeague = new Map<string, number>();

  for (const leagueSlug of new Set(
    MOCK_THREADS.map((thread) => thread.leagueSlug),
  )) {
    const leagueId = leagueIds.get(leagueSlug);
    const favoriteTeamId = teamIdsByLeagueSlug.get(leagueSlug);
    if (!leagueId || !favoriteTeamId) continue;

    const profile = await upsertFanProfile({
      userId: testUser.id,
      leagueId,
      displayName: "GreenEagle_Pao",
      favoriteTeamId,
    });

    profileByLeague.set(leagueSlug, profile.id);
  }

  console.log("Seeding mock threads...");

  for (const thread of MOCK_THREADS) {
    const leagueId = leagueIds.get(thread.leagueSlug);
    const fanProfileId = profileByLeague.get(thread.leagueSlug);
    if (!leagueId || !fanProfileId) continue;

    const lastActivityAt = new Date(Date.now() - thread.minutesAgo * 60_000);

    await db
      .insert(threads)
      .values({
        id: thread.id,
        fanProfileId,
        leagueId,
        title: thread.title,
        slug: thread.slug,
        type: thread.type,
        matchStatus: "matchStatus" in thread ? thread.matchStatus : null,
        replyCount: thread.replyCount,
        lastActivityAt,
      })
      .onConflictDoUpdate({
        target: threads.id,
        set: {
          title: thread.title,
          slug: thread.slug,
          type: thread.type,
          matchStatus: "matchStatus" in thread ? thread.matchStatus : null,
          replyCount: thread.replyCount,
          lastActivityAt,
          fanProfileId,
          leagueId,
        },
      });
  }

  console.log("Mock fixture seed done.");
}
