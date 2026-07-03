import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { account, fanProfiles, leagues, teams, user } from "@/db/schema";

import { runSeedCli } from "./cli";
import { MOCK_THREADS } from "./threads";
import { upsertMockFanProfile } from "./fan-profiles";

const MOCK_PASSWORD = "TestPass123!";

export type AuthorPool = Map<string, Map<string, number>>;

const SUPER_LEAGUE_PERSONAS = [
  {
    key: "olympiakos",
    username: "mockfan_olym",
    email: "mockfan.olym@kerkida.local",
    name: "Mock Olympiacos Fan",
    displayName: "Thrylos_7",
    teamSlug: "olympiakos",
  },
  {
    key: "aek",
    username: "mockfan_aek",
    email: "mockfan.aek@kerkida.local",
    name: "Mock AEK Fan",
    displayName: "Kitrinomavri_21",
    teamSlug: "aek",
  },
  {
    key: "neutral",
    username: "mockfan_neutral",
    email: "mockfan.neutral@kerkida.local",
    name: "Mock Neutral",
    displayName: "Taktikos_Analyst",
    teamSlug: "paok",
  },
  {
    key: "troll",
    username: "mockfan_troll",
    email: "mockfan.troll@kerkida.local",
    name: "Mock Troll",
    displayName: "Provokator_99",
    teamSlug: "olympiakos",
  },
] as const;

const PREMIER_LEAGUE_PERSONAS = [
  {
    key: "arsenal",
    username: "mockfan_ars",
    email: "mockfan.ars@kerkida.local",
    name: "Mock Arsenal Fan",
    displayName: "Gooner_North",
    teamSlug: "arsenal",
  },
  {
    key: "chelsea",
    username: "mockfan_che",
    email: "mockfan.che@kerkida.local",
    name: "Mock Chelsea Fan",
    displayName: "BlueBridge_8",
    teamSlug: "chelsea",
  },
  {
    key: "neutral",
    username: "mockfan_epl_neutral",
    email: "mockfan.epl@kerkida.local",
    name: "Mock EPL Neutral",
    displayName: "PremStatBot",
    teamSlug: "arsenal",
  },
] as const;

const LEAGUE_PERSONAS: Record<
  string,
  ReadonlyArray<{
    key: string;
    username: string;
    email: string;
    name: string;
    displayName: string;
    teamSlug: string;
  }>
> = {
  "super-league": SUPER_LEAGUE_PERSONAS,
  "premier-league": PREMIER_LEAGUE_PERSONAS,
  "champions-league": [
    {
      key: "madrid",
      username: "mockfan_madrid",
      email: "mockfan.madrid@kerkida.local",
      name: "Mock Madrid Fan",
      displayName: "Madridista_14",
      teamSlug: "real-madrid",
    },
    {
      key: "barca",
      username: "mockfan_barca",
      email: "mockfan.barca@kerkida.local",
      name: "Mock Barca Fan",
      displayName: "Cules_Camp",
      teamSlug: "barcelona",
    },
  ],
  euroleague: [
    {
      key: "pao_bc",
      username: "mockfan_pao_bc",
      email: "mockfan.paobc@kerkida.local",
      name: "Mock PAO BC Fan",
      displayName: "Prasinos_Euro",
      teamSlug: "panathinaikos-bc",
    },
    {
      key: "olym_bc",
      username: "mockfan_olym_bc",
      email: "mockfan.olymbc@kerkida.local",
      name: "Mock Olympiacos BC Fan",
      displayName: "Erythrolefkos_BC",
      teamSlug: "olympiakos-bc",
    },
  ],
};

async function upsertMockUser(input: {
  email: string;
  username: string;
  name: string;
}) {
  const hashedPassword = await hashPassword(MOCK_PASSWORD);

  const existing =
    (await db.query.user.findFirst({ where: eq(user.email, input.email) })) ??
    (await db.query.user.findFirst({
      where: eq(user.username, input.username),
    }));

  if (existing) {
    await db
      .update(user)
      .set({
        email: input.email,
        name: input.name,
        username: input.username,
        emailVerified: true,
      })
      .where(eq(user.id, existing.id));

    const credentialAccount = await db.query.account.findFirst({
      where: and(
        eq(account.userId, existing.id),
        eq(account.providerId, "credential"),
      ),
    });

    if (credentialAccount) {
      await db
        .update(account)
        .set({ password: hashedPassword })
        .where(eq(account.id, credentialAccount.id));
    } else {
      await db.insert(account).values({
        id: crypto.randomUUID(),
        accountId: existing.id,
        providerId: "credential",
        userId: existing.id,
        password: hashedPassword,
      });
    }

    return existing.id;
  }

  const userId = crypto.randomUUID();

  await db.insert(user).values({
    id: userId,
    email: input.email,
    name: input.name,
    username: input.username,
    role: "user",
    emailVerified: true,
  });

  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: hashedPassword,
  });

  return userId;
}

async function resolveTeamId(leagueId: number, teamSlug: string) {
  const team = await db.query.teams.findFirst({
    where: and(eq(teams.leagueId, leagueId), eq(teams.slug, teamSlug)),
    columns: { id: true },
  });

  return team?.id;
}

export async function seedMockPostAuthors(): Promise<AuthorPool> {
  console.log("Seeding mock post authors...");

  const pool: AuthorPool = new Map();
  const leagueSlugs = [
    ...new Set(MOCK_THREADS.map((thread) => thread.leagueSlug)),
  ];

  for (const leagueSlug of leagueSlugs) {
    const league = await db.query.leagues.findFirst({
      where: eq(leagues.slug, leagueSlug),
      columns: { id: true },
    });

    if (!league) continue;

    const personas = LEAGUE_PERSONAS[leagueSlug] ?? [];
    const leagueAuthors = new Map<string, number>();

    const testUser = await db.query.user.findFirst({
      where: eq(user.username, "testuser"),
      columns: { id: true },
    });

    if (testUser) {
      const testProfile = await db.query.fanProfiles.findFirst({
        where: and(
          eq(fanProfiles.userId, testUser.id),
          eq(fanProfiles.leagueId, league.id),
        ),
        columns: { id: true },
      });

      if (testProfile) {
        leagueAuthors.set("pao", testProfile.id);
      }
    }

    for (const persona of personas) {
      const userId = await upsertMockUser({
        email: persona.email,
        username: persona.username,
        name: persona.name,
      });

      const favoriteTeamId = await resolveTeamId(league.id, persona.teamSlug);
      if (!favoriteTeamId) continue;

      const profile = await upsertMockFanProfile({
        userId,
        leagueId: league.id,
        displayName: persona.displayName,
        favoriteTeamId,
      });

      leagueAuthors.set(persona.key, profile.id);
    }

    pool.set(leagueSlug, leagueAuthors);
  }

  return pool;
}

runSeedCli(import.meta.url, seedMockPostAuthors);
