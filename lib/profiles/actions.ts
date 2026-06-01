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

export type FanProfileActionState = {
  error?: string;
};

export async function createFanProfile(
  _prev: FanProfileActionState,
  formData: FormData,
): Promise<FanProfileActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Πρέπει να είσαι συνδεδεμένος." };
  }

  const leagueId = Number.parseInt(String(formData.get("leagueId")), 10);
  const favoriteTeamIdRaw = String(formData.get("favoriteTeamId") ?? "");
  const favoriteTeamId = favoriteTeamIdRaw
    ? Number.parseInt(favoriteTeamIdRaw, 10)
    : null;
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!Number.isFinite(leagueId)) {
    return { error: "Επίλεξε πρωτάθλημα." };
  }

  if (!displayName || displayName.length < 2) {
    return {
      error: "Το όνομα εμφάνισης πρέπει να έχει τουλάχιστον 2 χαρακτήρες.",
    };
  }

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
        error:
          "Έχεις ήδη fan profile σε αυτό το πρωτάθλημα ή το όνομα χρησιμοποιείται.",
      };
    }
    return { error: "Κάτι πήγε στραβά. Δοκίμασε ξανά." };
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
