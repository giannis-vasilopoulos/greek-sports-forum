"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { fanProfiles, leagues, posts, teams, threads } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import { copy } from "@/lib/copy";
import { runDbResult } from "@/lib/db/run";
import { teamTransferRumorsPath } from "@/lib/seo/paths";
import { slugify, uniqueSlug } from "@/lib/seo/slug";
import { teamUrlSlug } from "@/lib/teams/queries";
import {
  createTransferRumorSchema,
  type CreateTransferRumorInput,
} from "@/lib/validation/transfer-rumors";
import { zodFieldErrors } from "@/lib/validation/parse";

export type CreateTransferRumorState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof CreateTransferRumorInput, string>>;
};

async function resolveUniqueThreadSlug(
  leagueId: number,
  title: string,
): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await db.query.threads.findFirst({
      where: and(eq(threads.leagueId, leagueId), eq(threads.slug, candidate)),
      columns: { id: true },
    });

    if (!existing) return candidate;
    candidate = uniqueSlug(base, suffix);
    suffix += 1;
  }
}

export async function createTransferRumor(
  input: CreateTransferRumorInput,
): Promise<CreateTransferRumorState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: copy.transferRumors.mustBeSignedIn };
  }

  const parsed = createTransferRumorSchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { leagueSlug, teamId, title, body } = parsed.data;

  const league = await db.query.leagues.findFirst({
    where: eq(leagues.slug, leagueSlug),
    columns: { id: true, slug: true },
  });

  if (!league) {
    return { error: copy.transferRumors.genericError };
  }

  const team = await db.query.teams.findFirst({
    where: and(eq(teams.id, teamId), eq(teams.leagueId, league.id)),
    columns: { id: true, slug: true },
  });

  if (!team) {
    return {
      fieldErrors: { teamId: copy.validation.transferRumor.teamRequired },
    };
  }

  const fanProfile = await db.query.fanProfiles.findFirst({
    where: and(
      eq(fanProfiles.userId, user.id),
      eq(fanProfiles.leagueId, league.id),
    ),
    columns: { id: true },
  });

  if (!fanProfile) {
    return { error: copy.transferRumors.needFanProfile };
  }

  const threadSlugValue = await resolveUniqueThreadSlug(league.id, title);

  const result = await runDbResult(async () => {
    const [thread] = await db
      .insert(threads)
      .values({
        fanProfileId: fanProfile.id,
        leagueId: league.id,
        teamId: team.id,
        title,
        slug: threadSlugValue,
        type: "transfer_rumor",
      })
      .returning({ id: threads.id });

    await db.insert(posts).values({
      threadId: thread!.id,
      fanProfileId: fanProfile.id,
      content: body,
    });

    return thread;
  });

  if (!result.ok) {
    return { error: copy.transferRumors.genericError };
  }

  redirect(
    teamTransferRumorsPath(league.slug, teamUrlSlug(team.slug, league.slug)),
  );
}
