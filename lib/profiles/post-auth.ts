"use server";

import { getSessionUser } from "@/lib/auth/session";

import { userHasFanProfiles } from "./queries";

export async function getPostAuthRedirectPath(): Promise<string> {
  const user = await getSessionUser();
  if (!user) {
    return "/sign-in";
  }

  const hasProfiles = await userHasFanProfiles(user.id);
  return hasProfiles ? "/" : "/onboarding";
}
