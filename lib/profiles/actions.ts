"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { fanProfiles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import { runDbResult } from "@/lib/db/run";
import { ACTIVE_FAN_PROFILE_COOKIE } from "@/lib/profiles/active-profile-cookie";
import { copy } from "@/lib/copy";
import { zodFieldErrors } from "@/lib/validation/parse";
import {
  createFanProfileSchema,
  type CreateFanProfileInput,
} from "@/lib/validation/profiles";

export type FanProfileActionState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof CreateFanProfileInput, string>>;
};

export async function createFanProfile(
  input: CreateFanProfileInput,
): Promise<FanProfileActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: copy.auth.onboarding.mustBeSignedIn };
  }

  const parsed = createFanProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { leagueId, favoriteTeamId, displayName } = parsed.data;

  const result = await runDbResult(async () => {
    const [profile] = await db
      .insert(fanProfiles)
      .values({
        userId: user.id,
        leagueId,
        favoriteTeamId,
        displayName,
      })
      .returning({ id: fanProfiles.id });

    return profile;
  });

  if (!result.ok) {
    if (result.error.kind === "conflict") {
      return {
        error: copy.auth.onboarding.profileConflict,
      };
    }
    return { error: copy.auth.onboarding.genericError };
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_FAN_PROFILE_COOKIE, String(result.value.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function setActiveFanProfile(profileId: number): Promise<void> {
  const user = await getSessionUser();
  if (!user) return;

  const owned = await db.query.fanProfiles.findFirst({
    where: and(eq(fanProfiles.id, profileId), eq(fanProfiles.userId, user.id)),
    columns: { id: true },
  });

  if (!owned) return;

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_FAN_PROFILE_COOKIE, String(profileId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/", "layout");
}
