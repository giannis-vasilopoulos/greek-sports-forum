import { eq } from "drizzle-orm";

import { db } from "@/db";
import { leagues, threads, user } from "@/db/schema";

import { runSeedCli } from "./cli";

export const MOCK_THREADS = [
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

async function resolveLeagueIds(
  leagueIds?: Map<string, number>,
): Promise<Map<string, number>> {
  if (leagueIds) return leagueIds;

  const resolved = new Map<string, number>();
  const slugs = [...new Set(MOCK_THREADS.map((thread) => thread.leagueSlug))];

  for (const leagueSlug of slugs) {
    const league = await db.query.leagues.findFirst({
      where: eq(leagues.slug, leagueSlug),
      columns: { id: true },
    });

    if (league) {
      resolved.set(leagueSlug, league.id);
    }
  }

  return resolved;
}

async function resolveProfileByLeague(
  profileByLeague?: Map<string, number>,
): Promise<Map<string, number>> {
  if (profileByLeague) return profileByLeague;

  const testUser = await db.query.user.findFirst({
    where: eq(user.username, "testuser"),
    columns: { id: true },
  });

  if (!testUser) return new Map();

  const resolved = new Map<string, number>();
  const slugs = [...new Set(MOCK_THREADS.map((thread) => thread.leagueSlug))];

  for (const leagueSlug of slugs) {
    const league = await db.query.leagues.findFirst({
      where: eq(leagues.slug, leagueSlug),
      columns: { id: true },
    });

    if (!league) continue;

    const profile = await db.query.fanProfiles.findFirst({
      where: (p, { and, eq: eqFn }) =>
        and(eqFn(p.userId, testUser.id), eqFn(p.leagueId, league.id)),
      columns: { id: true },
    });

    if (profile) {
      resolved.set(leagueSlug, profile.id);
    }
  }

  return resolved;
}

export async function seedMockThreads(options?: {
  leagueIds?: Map<string, number>;
  profileByLeague?: Map<string, number>;
}) {
  console.log("Seeding mock threads...");

  const leagueIds = await resolveLeagueIds(options?.leagueIds);
  const profileByLeague = await resolveProfileByLeague(
    options?.profileByLeague,
  );

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
}

runSeedCli(import.meta.url, seedMockThreads);
