import { cookies } from "next/headers";

export const ACTIVE_FAN_PROFILE_COOKIE = "kerkida_active_fan_profile";

export async function getActiveFanProfileIdFromCookie(): Promise<
  number | undefined
> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ACTIVE_FAN_PROFILE_COOKIE)?.value;
  if (!value) return undefined;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}
